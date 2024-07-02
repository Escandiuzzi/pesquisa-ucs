import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { productions, researchersToProductions } from "../db/schema";
import * as schema from "../db/schema";
import { and, eq, ilike } from "drizzle-orm";

export type ProductionType = "artigo" | "livro" | "patente" | "trabalho";

export function getProductionType(type: ProductionType) {
  const typeId = ["artigo", "livro", "patente", "trabalho"].indexOf(type);

  if (typeId === -1) {
    return undefined;
  }

  return typeId;
}

export function getProductionTypeFromId(id: number) {
  const type = ["artigo", "livro", "patente", "trabalho"][id];

  if (type === undefined) {
    return undefined;
  }

  return type as ProductionType;
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
  const prodType = getProductionType(type);
  if (prodType === undefined) {
    throw new Error("Invalid production type");
  }

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
          typeId: prodType,
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
    idCollaborator,
    type,
  }: {
    q?: string;
    idArea?: number;
    idCollaborator?: number;
    type?: ProductionType;
  }
) {
  let productions = await db.query.productions.findMany({
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
      researchers: {
        with: {
          researcher: true,
        },
      },
    },
  });

  if (q) {
    productions = productions.filter((production) =>
      production.title.toLowerCase().includes(q.toLowerCase())
    );
  }

  if (idArea) {
    productions = productions.filter(
      (production) => production.area.id === idArea
    );
  }

  if (type) {
    productions = productions.filter(
      (production) => production.typeId === getProductionType(type)
    );
  }

  if (idCollaborator) {
    productions = productions.filter(
      (production) =>
        production.creator.id === idCollaborator ||
        production.researchers.some(
          (researcher) => researcher.researcherId === idCollaborator
        )
    );
  }

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
      researchers: {
        with: {
          researcher: true,
        },
      },
    },
    where: eq(schema.productions.id, id),
  });

  return production;
}

export async function updateProduction(
  db: BetterSQLite3Database<typeof schema>,
  id: number,
  {
    title,
    pubDate,
    idArea,
    idCollaborators,
    idProject,
    links,
    type,
  }: {
    title?: string;
    pubDate?: Date;
    idArea?: number;
    idCollaborators?: number[];
    idProject?: number;
    links?: string | null;
    type?: ProductionType;
  }
) {
  const prodType = type ? getProductionType(type) : undefined;
  if (prodType === undefined) {
    throw new Error("Invalid production type");
  }
  await db
    .update(productions)
    .set({
      title,
      areaId: idArea,
      projectId: idProject,
      links,
      typeId: prodType,
      pubDate: pubDate
        ? pubDate.getFullYear() +
          "-" +
          (pubDate.getMonth() + 1) +
          "-" +
          pubDate.getDate()
        : undefined,
    })
    .where(eq(productions.id, id));

  if (idCollaborators) {
    await db
      .delete(researchersToProductions)
      .where(eq(researchersToProductions.productionId, id));

    await db.insert(researchersToProductions).values(
      idCollaborators.map((rid) => ({
        productionId: id,
        researcherId: rid,
      }))
    );
  }
}

export async function deleteProduction(
  db: BetterSQLite3Database<typeof schema>,
  id: number
) {
  await db
    .delete(researchersToProductions)
    .where(eq(researchersToProductions.productionId, id));
  await db.delete(productions).where(eq(productions.id, id));
}
