import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { productions, researchersToProductions } from "../db/schema";

export async function createProduction(
  db: BetterSQLite3Database<any>,
  {
    title,
    pubDate,
    idProject,
    idType,
    idArea,
    idCollaborators,
    links,
    idCreator,
  }: {
    title: string;
    pubDate: Date;
    idProject: number;
    idType: number;
    idArea: number;
    idCollaborators: number[];
    links: string;
    idCreator: number;
  }
) {
  const production = (
    await db
      .insert(productions)
      .values([
        {
          title,
          areaId: idArea,
          links,
          projectId: idProject,
          pubDate:
            pubDate.getFullYear() +
            "-" +
            (pubDate.getMonth() + 1) +
            "-" +
            pubDate.getDate(),
          typeId: idType,
          creatorId: idCreator,
        },
      ])
      .returning({ id: productions.id })
  )[0];

  await db.insert(researchersToProductions).values(
    idCollaborators.map((id) => ({
      productionId: production.id,
      researcherId: id,
    }))
  );

  return production;
}
