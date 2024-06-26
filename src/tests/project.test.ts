// import { afterAll, beforeAll, expect, test } from "vitest";
// import { createResearcher } from "../models/researcher";

// import { drizzle } from "drizzle-orm/better-sqlite3";
// import { migrate } from "drizzle-orm/better-sqlite3/migrator";
// import Database from "better-sqlite3";
// import { seed } from "../seed";
// import { createProduction } from "../models/production";
// import { createProject } from "../models/project";
// import * as schema from "../db/schema";

// const sqlite = new Database(":memory:");
// const db = drizzle(sqlite, { schema });

// beforeAll(async () => {
//   migrate(db, { migrationsFolder: "drizzle" });
//   seed(db);
// });

// test("criar um projeto", async () => {
//   let result = await createProject(db, {});

//   console.log(result);
//   expect(result).toStrictEqual({ id: 1 });
// });

// afterAll(async () => {
//   sqlite.close();
// });

import { expect, test } from "vitest";

test("test", () => {
  expect(1).toBe(1);
})