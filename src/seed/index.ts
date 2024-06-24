import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import {
  areas,
  projects,
  researchers,
  universities,
  productions,
  researchersToAreas,
  researchersToProductions,
  researchersToProjects,
} from "../db/schema";

export async function seed(db: BetterSQLite3Database<any>) {
  await db.delete(researchersToProjects);
  await db.delete(researchersToProductions);
  await db.delete(researchersToAreas);
  await db.delete(researchers);
  await db.delete(areas);
  await db.delete(productions);
  await db.delete(universities);
  await db.delete(projects);

  await db.insert(areas).values([
    { name: "Ciência da Computação", id: 0 },
    { name: "Matemática", id: 1 },
    { name: "Biologia", id: 2 },
    { name: "Biotecnologia", id: 3, parentId: 2 },
  ]);

  await db.insert(universities).values([
    { name: "Universidade Federal de Pernambuco", id: 0 },
    { name: "Universidade de São Paulo", id: 1 },
    { name: "Universidade Federal de Alagoas", id: 2 },
  ]);

  await db.insert(researchers).values([
    {
      id: 0,
      name: "João",
      email: "joao@mail.com",
      passwordHash: "123",
      universityId: 0,
      mainAreaId: 0,
      dateOfBirth: "1990-01-01",
      contactInfo: "81 99999-9999",
    },
  ]);

  await db.insert(projects).values([
    {
      id: 0,
      creatorId: 0,
      description: "Projeto de pesquisa em biotecnologia.",
      endDate: "2022-12-31",
      startDate: "2022-01-01",
      title: "Projeto de Biotecnologia",
    },
  ]);
}
