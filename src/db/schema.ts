import {
  pgTable,
  serial,
  uniqueIndex,
  varchar,
  date,
  integer
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

export const projects = pgTable(
  "projects",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 256 }),
    startDate: date("start_date"),
    endDate: date("end_date"),
    collaborators: varchar("collaborators", { length: 256 }),
    description: varchar("description"),
    results: varchar("results"),
    status: integer("status"),
  },
  (projects) => {
    return {
      titleIndex: uniqueIndex("title_idx").on(projects.title),
    };
  }
);