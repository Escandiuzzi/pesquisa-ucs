import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { researchers, researchersToAreas } from "../db/schema";
import bcrypt from "bcryptjs";

export async function createResearcher(
  db: BetterSQLite3Database<any>,
  {
    email,
    password,
    name,
    idUniversity,
    idAreas,
    idMainArea,
    dateOfBirth,
    contactInfo,
    pictureUrl,
  }: {
    email: string;
    password: string;
    name: string;
    idUniversity: number;
    idAreas: number[];
    idMainArea: number;
    dateOfBirth: Date;
    contactInfo: string;
    pictureUrl?: string;
  }
) {
  const researcher = (
    await db
      .insert(researchers)
      .values([
        {
          email,
          name,
          passwordHash: await bcrypt.hash(password, 10),
          contactInfo,
          dateOfBirth:
            dateOfBirth.getFullYear() +
            "-" +
            (dateOfBirth.getMonth() + 1) +
            "-" +
            dateOfBirth.getDate(),
          mainAreaId: idMainArea,
          universityId: idUniversity,
          picture: pictureUrl,
        },
      ])
      .returning({ id: researchers.id })
  )[0];

  await db.insert(researchersToAreas).values(
    idAreas.map((idArea) => ({
      researcherId: researcher.id,
      areaId: idArea,
    }))
  );

  return researcher;
}
