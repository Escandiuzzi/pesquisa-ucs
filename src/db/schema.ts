import { relations } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  type AnySQLiteColumn,
} from "drizzle-orm/sqlite-core";

// Universities.
export const universities = sqliteTable("universities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").unique().notNull(),
});

export const universitiesRelations = relations(universities, ({ many }) => ({
  researchers: many(researchers),
}));

// Areas of research. Can have a parent area.
export const areas = sqliteTable("areas", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").unique().notNull(),
  parentId: integer("parent_id").references((): AnySQLiteColumn => areas.id),
});

export const areasRelations = relations(areas, ({ one, many }) => ({
  parent: one(areas, {
    fields: [areas.parentId],
    references: [areas.id],
  }),
  researchers: many(researchersToAreas),
  productions: many(productions),
}));

// Researchers.
export const researchers = sqliteTable("researchers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  token: text("token"),

  name: text("name").notNull(),
  picture: text("picture"),
  universityId: integer("university_id")
    .notNull()
    .references(() => universities.id),
  mainAreaId: integer("main_area_id")
    .notNull()
    .references(() => areas.id),
  dateOfBirth: text("date_of_birth").notNull(),
  contactInfo: text("contact_info"),
});

export const researchersRelations = relations(researchers, ({ one, many }) => ({
  university: one(universities, {
    fields: [researchers.universityId],
    references: [universities.id],
  }),
  mainArea: one(areas, {
    fields: [researchers.mainAreaId],
    references: [areas.id],
  }),
  areas: many(researchersToAreas),
}));

// Researchers to areas of research.
export const researchersToAreas = sqliteTable("researchers_to_areas", {
  researcherId: integer("researcher_id")
    .notNull()
    .references(() => researchers.id),
  areaId: integer("area_id")
    .notNull()
    .references(() => areas.id),
});

export const researchersToAreasRelations = relations(
  researchersToAreas,
  ({ one }) => ({
    researcher: one(researchers, {
      fields: [researchersToAreas.researcherId],
      references: [researchers.id],
    }),
    area: one(areas, {
      fields: [researchersToAreas.areaId],
      references: [areas.id],
    }),
  })
);

// Projects.
export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  creatorId: integer("creator_id")
    .notNull()
    .references(() => researchers.id),
  title: text("title").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  description: text("description"),
});

export const projectsRelations = relations(projects, ({ one, many }) => ({
  creator: one(researchers, {
    fields: [projects.creatorId],
    references: [researchers.id],
  }),
  researchers: many(researchersToProjects),
  productions: many(productions),
}));

// Researchers to projects.
export const researchersToProjects = sqliteTable("researchers_to_projects", {
  researcherId: integer("researcher_id")
    .notNull()
    .references(() => researchers.id),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id),
});

export const researchersToProjectsRelations = relations(
  researchersToProjects,
  ({ one }) => ({
    researcher: one(researchers, {
      fields: [researchersToProjects.researcherId],
      references: [researchers.id],
    }),
    project: one(projects, {
      fields: [researchersToProjects.projectId],
      references: [projects.id],
    }),
  })
);

// Productions
export const productions = sqliteTable("productions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  creatorId: integer("creator_id")
    .notNull()
    .references(() => researchers.id),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id),
  title: text("title").notNull(),
  pubDate: text("pub_date").notNull(),
  typeId: integer("type").notNull(),
  areaId: integer("area_id")
    .notNull()
    .references(() => areas.id),
  links: text("links"),
});

export const productionsRelations = relations(productions, ({ one, many }) => ({
  creator: one(researchers, {
    fields: [productions.creatorId],
    references: [researchers.id],
  }),
  project: one(projects, {
    fields: [productions.projectId],
    references: [projects.id],
    relationName: "projectsToProductions",
  }),
  area: one(areas, {
    fields: [productions.areaId],
    references: [areas.id],
  }),
  researchers: many(researchersToProductions),
}));

// Researchers to productions.
export const researchersToProductions = sqliteTable(
  "researchers_to_productions",
  {
    researcherId: integer("researcher_id")
      .notNull()
      .references(() => researchers.id),
    productionId: integer("production_id")
      .notNull()
      .references(() => productions.id),
  }
);

export const researchersToProductionsRelations = relations(
  researchersToProductions,
  ({ one }) => ({
    researcher: one(researchers, {
      fields: [researchersToProductions.researcherId],
      references: [researchers.id],
    }),
    production: one(productions, {
      fields: [researchersToProductions.productionId],
      references: [productions.id],
    }),
  })
);
