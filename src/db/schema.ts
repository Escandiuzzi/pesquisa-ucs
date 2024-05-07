import {
  pgTable,
  serial,
  uniqueIndex,
  varchar,
  date,
} from "drizzle-orm/pg-core";

export const researchers = pgTable(
  "researchers",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    picture: varchar("picture", { length: 256 }),
    university: varchar("university", { length: 256 }),
    areas: varchar("areas", { length: 256 }),
    mainArea: varchar("main_area", { length: 256 }),
    dateOfBirth: date("date_of_birth"),
    contactInfo: varchar("contact_info", { length: 256 }),
  },
  (researchers) => {
    return {
      nameIndex: uniqueIndex("name_idx").on(researchers.name),
    };
  }
);
