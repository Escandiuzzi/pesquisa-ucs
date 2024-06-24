import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { projects, researchersToProjects } from "../db/schema";

export async function createProject(
  db: BetterSQLite3Database<any>,
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
    description: string;
    startDate: Date;
    endDate: Date;
    idCollaborators: number[];
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
          endDate:
            endDate.getFullYear() +
            "-" +
            (endDate.getMonth() + 1) +
            "-" +
            endDate.getDate(),
        },
      ])
      .returning({ id: projects.id })
  )[0];

  await db.insert(researchersToProjects).values(
    idCollaborators.map((id) => ({
      projectId: project.id,
      researcherId: id,
    }))
  );

  return project;
}