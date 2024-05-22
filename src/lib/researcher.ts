import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { db } from "../db";
import { researchers } from "../db/schema";
import bcrypt from "bcrypt";

export async function createResearcher(
  db: BetterSQLite3Database,
  {
    email,
    password,
    name,
    idUniversity,
    idAreas,
    idMainArea,
    dateOfBirth,
    contactInfo,
  }: {
    email: string;
    password: string;
    name: string;
    idUniversity: number;
    idAreas: number[];
    idMainArea: number;
    dateOfBirth: Date;
    contactInfo: string;
  }
) {
  return await db
    .insert(researchers)
    .values([
      {
        email,
        name,
        passwordHash: await bcrypt.hash(password, 10),
        contactInfo,
        dateOfBirth: dateOfBirth.toISOString(),
        mainAreaId: idMainArea,
        universityId: idUniversity,
      },
    ])
    .returning({ id: researchers.id });
}
