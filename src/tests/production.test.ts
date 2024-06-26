import { afterAll, beforeAll, expect, test } from "vitest";

import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import { seed } from "../seed";
import { createProduction } from "../models/production";
import * as schema from "../db/schema";
import { createResearcher } from "../models/researcher";

const sqlite = new Database(":memory:");
const db = drizzle(sqlite, { schema });

beforeAll(async () => {
    migrate(db, { migrationsFolder: "drizzle" });
    seed(db);
});

test("criar uma produção", async () => {
    await createResearcher(db, {
        name: "Testson",
        email: "example@gmail.com",
        password: "pass123",
        contactInfo: "123456789",
        dateOfBirth: new Date(),
        idAreas: [1, 2],
        idMainArea: 1,
        idUniversity: 1,
    });

    console.log("Researcher:");
    var data = await db.select().from(schema.researchers);
    console.log(data);

    let result = await createProduction(db, {
        title: "Teste",
        pubDate: new Date(),
        idProject: 0,
        idType: 1,
        idArea: 1,
        idCollaborators: [0],
        links: "http://example.com",
    });

    expect(result).toStrictEqual({ id: 1 });
});

afterAll(async () => {
    sqlite.close();
});
