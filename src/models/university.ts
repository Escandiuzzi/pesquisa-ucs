import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "../db/schema";
import { universities } from "../db/schema";

export async function getUniversities(
  db: BetterSQLite3Database<typeof schema>
) {
  return await db.select().from(universities);
}
