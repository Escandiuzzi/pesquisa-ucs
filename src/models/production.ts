import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { productions, researchersToProductions } from "../db/schema";
import * as schema from "../db/schema";
import { and, eq, ilike } from "drizzle-orm";

export type ProductionType = "artigo" | "livro" | "patente" | "trabalho";

export function getProductionType(type: ProductionType): number {
  const typeId = ["artigo", "livro", "patente", "trabalho"].indexOf(type);

  if (typeId === -1) {
    throw new Error("Invalid production type");
  }

  return typeId;
}

export async function createProduction(
  db: BetterSQLite3Database<typeof schema>,
  {
    title,
    pubDate,
    idProject,
    type,
    idArea,
    idCollaborators,
    links,
    idCreator,
  }: {
    title: string;
    pubDate: Date;
    idProject: number;
    type: ProductionType;
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
          typeId: getProductionType(type),
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

export async function getProductions(
  db: BetterSQLite3Database<typeof schema>,
  {
    q,
    idArea,
    idCreator,
    type,
  }: {
    q?: string;
    idArea?: number;
    idCreator?: number;
    type?: ProductionType;
  }
) {
  const productions = await db.query.productions.findMany({
    columns: {
      id: true,
      title: true,
      pubDate: true,
      links: true,
      typeId: true,
    },
    with: {
      area: true,
      creator: true,
      project: true,
      researchers: true,
    },
    where: and(
      q ? ilike(schema.productions.title, q) : undefined,
      idArea ? eq(schema.productions.areaId, idArea) : undefined,
      idCreator ? eq(schema.productions.creatorId, idCreator) : undefined,
      type ? eq(schema.productions.typeId, getProductionType(type)) : undefined
    ),
  });

  return productions;
}

export async function getProduction(
  db: BetterSQLite3Database<typeof schema>,
  id: number
) {
  const production = await db.query.productions.findFirst({
    columns: {
      id: true,
      title: true,
      pubDate: true,
      links: true,
      typeId: true,
    },
    with: {
      area: true,
      creator: true,
      project: true,
      researchers: true,
    },
    where: eq(schema.productions.id, id),
  });

  return production;
}
