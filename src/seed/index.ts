import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { areas, universities } from "../db/schema";

export async function seed(db: BetterSQLite3Database) {
  await db.delete(areas);
  await db.insert(areas).values([
    { name: "Ciência da Computação", id: 0 },
    { name: "Matemática", id: 1 },
    { name: "Biologia", id: 2 },
    { name: "Biotecnologia", id: 3, parentId: 2 },
  ]);

  await db.delete(universities);
  await db.insert(universities).values([
    { name: "Universidade Federal de Pernambuco", id: 0 },
    { name: "Universidade de São Paulo", id: 1 },
    { name: "Universidade Federal de Alagoas", id: 2 },
  ]);
}
