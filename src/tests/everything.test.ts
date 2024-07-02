import { afterAll, beforeAll, expect, test } from "vitest";
import { createResearcher } from "../models/researcher";

import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import { seed } from "../seed";
import { createProduction } from "../models/production";
import { createProject } from "../models/project";
import * as schema from "../db/schema";

const sqlite = new Database(":memory:");
const db = drizzle(sqlite, { schema });

beforeAll(async () => {
  migrate(db, { migrationsFolder: "drizzle" });
  await seed(db);
});

test("criar um pesquisador", async () => {
  let result = await createResearcher(db, {
    name: "Testson",
    email: "example@gmail.com",
    password: "pass123",
    contactInfo: "123456789",
    dateOfBirth: new Date(),
    idAreas: [1, 2],
    idMainArea: 1,
    idUniversity: 1,
  });

  expect(result.id).toBeTruthy();
});

test("criar uma produção", async () => {
  let result = await createProduction(db, {
    title: "Teste",
    idCreator: 1,
    pubDate: new Date(),
    idProject: 1,
    type: "artigo",
    idArea: 1,
    idCollaborators: [1],
    links: "http://example.com",
  });

  expect(result.id).toBeTruthy();
});

test("criar um projeto", async () => {
  let result = await createProject(db, {
    creatorId: 1,
    title: "Teste",
    description: "Teste",
    startDate: new Date(),
    endDate: new Date(),
    idCollaborators: [1],
  });

  expect(result).toBeTruthy();
});

afterAll(async () => {
  // sqlite.close();
});
