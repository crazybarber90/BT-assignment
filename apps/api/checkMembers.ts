import { db } from '../api/src/db/client'
import { membersTable } from '../api/src/db/schema'
import { eq } from 'drizzle-orm'

async function main() {
  try {
    // Proverimo sve članove
    const allMembers = await db.select().from(membersTable)
    console.log('All members in database:', allMembers)

    // Proverimo da li postoji member sa ID 1
    const member1 = await db
      .select()
      .from(membersTable)
      .where(eq(membersTable.id, 1))
      .limit(1)

    if (member1.length === 0) {
      console.log('Member with ID 1 not found')
    } else {
      console.log('Member with ID 1:', member1[0])
    }
  } catch (err) {
    console.error('Error querying database:', err)
  }
}

main()
