import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { projects, researchersToProjects } from "../db/schema";
import * as schema from "../db/schema";

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
