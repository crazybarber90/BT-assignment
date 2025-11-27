import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";

export const db = drizzle(process.env.DATABASE_URL!);

export type Database = typeof db;

export async function checkDatabaseConnection(): Promise<void> {
  try {
    await db.execute(sql`SELECT 1`);
  } catch (error) {
    throw new Error(
      `Failed to connect to database: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}