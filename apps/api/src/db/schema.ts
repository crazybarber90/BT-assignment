import {
  integer,
  pgTable,
  varchar,
  text,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core'

export const exampleTable = pgTable('example', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  description: text(),
  status: varchar({ length: 50 }).default('pending'),
  count: integer().default(0),
  createdAt: timestamp().defaultNow(),
})

export const membersTable = pgTable('members', {
  id: integer().primaryKey(),
  firstName: varchar({ length: 255 }).notNull(),
  lastName: varchar({ length: 255 }).notNull(),
  dob: timestamp().notNull(),
  dynamicFields: jsonb().default('{}'),
  updatedAt: timestamp().defaultNow(),
})
export const memberDynamicFields = pgTable('member_dynamic_fields', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  memberId: integer().notNull(),
  fieldName: varchar({ length: 255 }).notNull(),
  fieldValue: text(),
  createdAt: timestamp().defaultNow(),
})

export const memberHistory = pgTable('member_history', {
  historyId: integer().primaryKey().generatedAlwaysAsIdentity(),
  memberId: integer().notNull(),
  canonicalData: jsonb().notNull(),
  dynamicFields: jsonb().notNull(),
  createdAt: timestamp().defaultNow(),
})
