import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import {
  researchers,
  researchersToAreas,
  researchersToProjects,
} from "../db/schema";
import bcrypt from "bcryptjs";
import * as schema from "../db/schema";
import { eq, inArray } from "drizzle-orm";

export async function createResearcher(
  db: BetterSQLite3Database<typeof schema>,
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
    contactInfo?: string;
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
      .returning()
  )[0];

  idAreas.length > 0 &&
    (await db.insert(researchersToAreas).values(
      idAreas.map((idArea) => ({
        researcherId: researcher.id,
        areaId: idArea,
      }))
    ));

  return researcher;
}

export async function getResearchers(
  db: BetterSQLite3Database<typeof schema>,
  {
    q,
    area,
    university,
  }: {
    q?: string;
    area?: number;
    university?: number;
  }
) {
  let query = await db.query.researchers.findMany({
    with: {
      mainArea: true,
      university: true,
      areas: {
        with: {
          area: true,
        },
      },
    },
  });

  if (q !== undefined) {
    query = query.filter((r) =>
      r.name?.toLowerCase().includes(q.toLowerCase())
    );
  }

  if (area !== undefined) {
    query = query.filter(
      (r) => r.mainArea?.id === area || r.areas.some((a) => a.area?.id === area)
    );
  }

  if (university !== undefined) {
    query = query.filter((r) => r.university?.id === university);
  }

  return query;
}

export async function getResearcher(
  db: BetterSQLite3Database<typeof schema>,
  id: number
) {
  const researcher = {
    ...(await db.query.researchers.findFirst({
      where: eq(researchers.id, id),
      with: {
        mainArea: true,
        university: true,
        areas: {
          with: {
            area: true,
          },
        },
      },
    })),
    projects: [] as {
      id: number;
      description: string | null;
      creatorId: number | null;
      title: string | null;
      startDate: string | null;
      endDate: string | null;
    }[],
    collaboratedWith: [] as {
      researcherId: number | null;
      projectId: number | null;
      researcher: {
        id: number;
        name: string | null;
        email: string | null;
        passwordHash: string | null;
        picture: string | null;
        universityId: number | null;
        mainAreaId: number | null;
        dateOfBirth: string | null;
        contactInfo: string | null;
      } | null;
    }[],
  };

  if (!researcher) {
    return null;
  }

  let projects = await db.query.projects.findMany({
    where: eq(schema.projects.creatorId, id),
  });

  const moreProjects = (
    await db.query.researchersToProjects.findMany({
      where: eq(researchersToProjects.researcherId, id),
      with: {
        project: true,
      },
    })
  ).map((r) => r.project!);

  projects = projects.concat(moreProjects);

  // Deduplicate projects
  projects = projects.filter(
    (p, i) => projects.findIndex((p2) => p2.id === p.id) === i
  );

  const projectIds = projects.map((p) => p.id);

  let collaboratedWith =
    projectIds.length > 0
      ? (
          await db.query.researchersToProjects.findMany({
            where: inArray(researchersToProjects.projectId, projectIds),
            with: {
              researcher: true,
            },
          })
        ).filter((r) => r.researcherId !== id)
      : [];

  // Deduplicate collaborators
  collaboratedWith = collaboratedWith.filter(
    (c, i) =>
      collaboratedWith.findIndex((c2) => c2.researcherId === c.researcherId) ===
      i
  );

  researcher.projects = projects;
  researcher.collaboratedWith = collaboratedWith;

  return researcher;
}

export async function updateResearcher(
  db: BetterSQLite3Database<typeof schema>,
  id: number,
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
    email?: string;
    password?: string;
    name?: string;
    idUniversity?: number;
    idAreas?: number[];
    idMainArea?: number;
    dateOfBirth?: Date;
    contactInfo?: string;
    pictureUrl?: string;
  }
) {
  const researcher = (
    await db
      .update(researchers)
      .set({
        email,
        name,
        passwordHash: password ? await bcrypt.hash(password, 10) : undefined,
        contactInfo,
        dateOfBirth: dateOfBirth
          ? dateOfBirth.getFullYear() +
            "-" +
            (dateOfBirth.getMonth() + 1) +
            "-" +
            dateOfBirth.getDate()
          : undefined,
        mainAreaId: idMainArea,
        universityId: idUniversity,
        picture: pictureUrl,
      })
      .where(eq(researchers.id, id))
      .returning()
  )[0];

  await db
    .delete(researchersToAreas)
    .where(eq(researchersToAreas.researcherId, id));

  idAreas &&
    idAreas.length > 0 &&
    (await db.insert(researchersToAreas).values(
      idAreas.map((idArea) => ({
        researcherId: researcher.id,
        areaId: idArea,
      }))
    ));

  return researcher;
}

export async function deleteResearcher(
  db: BetterSQLite3Database<typeof schema>,
  id: number
) {
  await db
    .delete(researchersToAreas)
    .where(eq(researchersToAreas.researcherId, id));
  await db
    .delete(researchersToProjects)
    .where(eq(researchersToProjects.researcherId, id));
  await db.delete(researchers).where(eq(researchers.id, id));
}
