import { afterAll, beforeAll, expect, test } from "vitest";
import { createResearcher } from "../models/researcher";

import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import { seed } from "../seed";
import * as schema from "../db/schema";

const sqlite = new Database(":memory:");
const db = drizzle(sqlite, { schema });

beforeAll(async () => {
  migrate(db, { migrationsFolder: "drizzle" });
  seed(db);
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

  expect(result).toStrictEqual({ id: 1 });
});

afterAll(async () => {
  sqlite.close();
});