import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { projects, researchersToProjects } from "../db/schema";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";
import { getProjectStatus } from "../lib/dateFormatter";
import { deleteProduction } from "./production";

export async function createProject(
  db: BetterSQLite3Database<typeof schema>,
  {
    creatorId,
    title,
    description,
    startDate,
    endDate,
    idCollaborators,
  }: {
    creatorId: number;
    title: string;
    description?: string;
    startDate: Date;
    endDate?: Date;
    idCollaborators?: number[];
  }
) {
  const project = (
    await db
      .insert(projects)
      .values([
        {
          creatorId,
          title,
          description,
          startDate:
            startDate.getFullYear() +
            "-" +
            (startDate.getMonth() + 1) +
            "-" +
            startDate.getDate(),
          endDate: endDate
            ? endDate.getFullYear() +
              "-" +
              (endDate.getMonth() + 1) +
              "-" +
              endDate.getDate()
            : undefined,
        },
      ])
      .returning({ id: projects.id })
  )[0];

  idCollaborators &&
    idCollaborators.length > 0 &&
    (await db.insert(researchersToProjects).values(
      idCollaborators.map((id) => ({
        projectId: project.id,
        researcherId: id,
      }))
    ));

  return project;
}

export async function getProject(
  db: BetterSQLite3Database<typeof schema>,
  id: number
) {
  return await db.query.projects.findFirst({
    where: eq(projects.id, id),
    with: {
      creator: true,
      researchers: {
        with: {
          researcher: {
            with: {
              mainArea: true,
              university: true,
            },
          },
        },
      },
      productions: {
        with: {
          area: true,
          creator: true,
          researchers: {
            with: {
              researcher: true,
            },
          },
        },
      },
    },
  });
}

export async function getProjects(
  db: BetterSQLite3Database<typeof schema>,
  {
    q,
    idCollaborator,
    status,
  }: {
    q?: string;
    idCollaborator?: number;
    status?: "Concluído" | "Em andamento";
  }
) {
  let query = await db.query.projects.findMany({
    with: {
      creator: true,
      researchers: {
        with: {
          researcher: true,
        },
      },
      productions: {
        with: {
          area: true,
          creator: true,
          researchers: {
            with: {
              researcher: true,
            },
          },
        },
      },
    },
  });

  if (q !== undefined) {
    query = query.filter((p) =>
      p.title.toLowerCase().includes(q.toLowerCase())
    );
  }

  if (idCollaborator !== undefined) {
    query = query.filter(
      (p) =>
        p.creatorId === idCollaborator ||
        p.researchers.some((r) => r.researcher.id === idCollaborator)
    );
  }

  if (status !== undefined) {
    query = query.filter((p) => getProjectStatus(p.endDate) === status);
  }

  return query;
}

export async function updateProject(
  db: BetterSQLite3Database<typeof schema>,
  id: number,
  {
    title,
    description,
    startDate,
    endDate,
    idCollaborators,
  }: {
    title?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    idCollaborators?: number[];
  }
) {
  await db
    .update(projects)
    .set({
      title,
      description,
      startDate:
        startDate &&
        startDate.getFullYear() +
          "-" +
          (startDate.getMonth() + 1) +
          "-" +
          startDate.getDate(),
      endDate:
        endDate &&
        endDate.getFullYear() +
          "-" +
          (endDate.getMonth() + 1) +
          "-" +
          endDate.getDate(),
    })
    .where(eq(projects.id, id));

  if (idCollaborators && idCollaborators.length > 0) {
    await db
      .delete(researchersToProjects)
      .where(eq(researchersToProjects.projectId, id));

    await db.insert(researchersToProjects).values(
      idCollaborators.map((id) => ({
        projectId: id,
        researcherId: id,
      }))
    );
  }
}

export async function deleteProject(
  db: BetterSQLite3Database<typeof schema>,
  id: number
) {
  await db
    .delete(researchersToProjects)
    .where(eq(researchersToProjects.projectId, id));
  const productions = await db
    .select()
    .from(schema.productions)
    .where(eq(schema.productions.projectId, id));
  productions.forEach(async (production) => {
    await deleteProduction(db, production.id);
  });
  await db.delete(projects).where(eq(projects.id, id));
}
