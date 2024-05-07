import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connection = postgres("postgres://admin:admin@0.0.0.0:5432/ucs");
const db = drizzle(connection);

export { db, connection };
