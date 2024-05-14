import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: "0.0.0.0",
    port: 5432,
    user: "admin",
    password: "admin",
    database: "ucs",
  },
} satisfies Config;
