import { z } from 'zod'
import { publicProcedure, createTRPCRouter } from '../init'
import { db } from '../../db/client'
import {
  membersTable,
  memberDynamicFields,
  memberHistory,
} from '../../db/schema'
import { eq, and } from 'drizzle-orm'

// Zod schemaaa
const CSVRowSchema = z
  .object({
    id: z.preprocess((val) => Number(val), z.number()),
    first_name: z.string(),
    last_name: z.string(),
    dob: z.preprocess((val) => new Date(val as string), z.date()),
  })
  .catchall(z.string())

type CSVRow = z.infer<typeof CSVRowSchema>

// Vanilla TS CSV parser
function parseCSV(csvText: string): CSVRow[] {
  const lines = csvText.split('\n').filter(Boolean)
  if (lines.length === 0) return []

  const headers = lines
    .shift()!
    .split(',')
    .map((h) => h.trim())

  return lines.map((line) => {
    // Regex za CSV vrednosti, uključujući navodnike
    const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)
    if (!values) return {} as CSVRow

    const obj: Record<string, string> = {}
    headers.forEach((h, i) => {
      obj[h] = values[i]?.replace(/(^"|"$)/g, '') ?? ''
    })
    return CSVRowSchema.parse(obj) // validacija i tip konverzija
  })
}

export const membersRouter = createTRPCRouter({
  uploadCSV: publicProcedure
    .input(z.object({ csvText: z.string() }))
    .mutation(async ({ input }) => {
      const rows = parseCSV(input.csvText)

      for (const row of rows) {
        const { id, first_name, last_name, dob, ...dynamicFields } = row

        const existing = await db
          .select()
          .from(membersTable)
          .where(eq(membersTable.id, id))
          .limit(1)

        if (existing.length) {
          // Save snapshot
          const member = existing[0]!

          await db.insert(memberHistory).values({
            memberId: id,
            canonicalData: {
              firstName: member.firstName,
              lastName: member.lastName,
              dob: member.dob,
            },
            dynamicFields: member.dynamicFields || {},
          })

          // Update canonical
          await db
            .update(membersTable)
            .set({
              firstName: first_name,
              lastName: last_name,
              dob,
              updatedAt: new Date(),
              dynamicFields: {
                ...(member.dynamicFields as Record<string, string>),
                ...dynamicFields,
              },
            })
            .where(eq(membersTable.id, id))

          // Merge dynamic fields
          for (const key in dynamicFields) {
            const existingDynamic = await db
              .select()
              .from(memberDynamicFields)
              .where(
                and(
                  eq(memberDynamicFields.memberId, id),
                  eq(memberDynamicFields.fieldName, key)
                )
              )

            if (existingDynamic.length > 0) {
              const dynamicId = existingDynamic[0]?.id
              if (dynamicId === undefined) {
                throw new Error('Dynamic field ID is undefined')
              }

              await db
                .update(memberDynamicFields)
                .set({ fieldValue: dynamicFields[key] })
                .where(eq(memberDynamicFields.id, dynamicId))
            } else {
              await db.insert(memberDynamicFields).values({
                memberId: id,
                fieldName: key,
                fieldValue: dynamicFields[key],
              })
            }
          }
        } else {
          // New member
          const [newMember] = await db
            .insert(membersTable)
            .values({
              id,
              firstName: first_name,
              lastName: last_name,
              dob,
            })
            .returning()

          for (const key in dynamicFields) {
            await db.insert(memberDynamicFields).values({
              memberId: newMember!.id,
              fieldName: key,
              fieldValue: dynamicFields[key],
            })
          }
        }
      }

      return { success: true }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const member = await db
        .select()
        .from(membersTable)
        .where(eq(membersTable.id, input.id))
        .limit(1)

      const dynamicFields = await db
        .select()
        .from(memberDynamicFields)
        .where(eq(memberDynamicFields.memberId, input.id))

      return { ...member[0], dynamicFields }
    }),

  getHistory: publicProcedure
    .input(z.object({ memberId: z.number() }))
    .query(async ({ input }) => {
      return await db
        .select()
        .from(memberHistory)
        .where(eq(memberHistory.memberId, input.memberId))
    }),

  list: publicProcedure.input(z.void()).query(async () => {
    return await db.select().from(membersTable)
  }),
})
