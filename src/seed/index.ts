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
import { createResearcher } from "../models/researcher";
import { createProject } from "../models/project";
import { createProduction } from "../models/production";

export async function seed(db: BetterSQLite3Database<any>) {
  await db.delete(researchersToProjects);
  await db.delete(researchersToProductions);
  await db.delete(researchersToAreas);
  await db.delete(researchers);
  await db.delete(areas);
  await db.delete(productions);
  await db.delete(universities);
  await db.delete(projects);

  const [compsci, maths, biology, philosophy] = await db
    .insert(areas)
    .values([
      { name: "Ciência da Computação" },
      { name: "Matemática" },
      { name: "Biologia" },
      { name: "Filosofia" },
    ])
    .returning();

  const [
    ai,
    algorithms,
    geometry,
    algebra,
    botanics,
    zoology,
    biotech,
    genetics,
    epistemology,
    ethics,
  ] = await db
    .insert(areas)
    .values([
      { name: "Inteligência Artificial", parentId: compsci.id },
      { name: "Algoritmos", parentId: compsci.id },
      { name: "Geometria", parentId: maths.id },
      { name: "Álgebra", parentId: maths.id },
      { name: "Botânica", parentId: biology.id },
      { name: "Zoologia", parentId: biology.id },
      { name: "Biotecnologia", parentId: biology.id },
      { name: "Genética", parentId: biology.id },
      { name: "Epistemologia", parentId: philosophy.id },
      { name: "Ética", parentId: philosophy.id },
    ])
    .returning();

  const [molbio, geneng] = await db
    .insert(areas)
    .values([
      { name: "Biologia Molecular", parentId: biotech.id },
      { name: "Engenharia Genética", parentId: biotech.id },
    ])
    .returning();

  const [up, usp, ua, ucs] = await db
    .insert(universities)
    .values([
      { name: "Universidade Federal de Pernambuco", id: 0 },
      { name: "Universidade de São Paulo", id: 1 },
      { name: "Universidade Federal de Alagoas", id: 2 },
      { name: "Universidade de Caxias do Sul", id: 3 },
    ])
    .returning();

  const [joao, barbara, heitor, julia] = await Promise.all([
    createResearcher(db, {
      name: "João",
      email: "joao@mail.com",
      password: "senha123",
      idUniversity: up.id,
      idMainArea: compsci.id,
      dateOfBirth: new Date(1990, 0, 1),
      contactInfo: "81 99999-9999",
      idAreas: [algorithms.id, geometry.id],
    }),
    createResearcher(db, {
      name: "Bárbara",
      email: "barbara@mail.com",
      password: "senha123",
      idUniversity: usp.id,
      idMainArea: maths.id,
      dateOfBirth: new Date(1995, 0, 1),
      contactInfo: "81 99999-9999",
      idAreas: [algebra.id, geometry.id],
    }),
    createResearcher(db, {
      name: "Heitor",
      email: "heitor@mail.com",
      password: "senha123",
      idUniversity: ua.id,
      idMainArea: biology.id,
      dateOfBirth: new Date(1985, 0, 1),
      contactInfo: "81 99999-9999",
      idAreas: [botanics.id, zoology.id, biotech.id],
    }),
    createResearcher(db, {
      name: "Júlia",
      email: "julia@mail.com",
      password: "senha123",
      idUniversity: ucs.id,
      idMainArea: philosophy.id,
      dateOfBirth: new Date(2001, 0, 1),
      contactInfo: "81 99999-9999",
      idAreas: [epistemology.id, ethics.id],
    }),
  ]);

  const [projAi, projGeometry, projBotanics, projEthics] = await Promise.all([
    createProject(db, {
      title: "Projeto de IA",
      description: "Projeto de IA para automação de processos",
      creatorId: joao.id,
      startDate: new Date(2021, 0, 1),
      idCollaborators: [joao.id, barbara.id],
    }),
    createProject(db, {
      title: "Projeto de Geometria",
      description: "Projeto de Geometria para cálculo de áreas",
      creatorId: barbara.id,
      startDate: new Date(2022, 0, 1),
      idCollaborators: [joao.id, barbara.id],
    }),
    createProject(db, {
      title: "Projeto de Botânica",
      description: "Projeto de Botânica para estudo de plantas",
      creatorId: heitor.id,
      startDate: new Date(2023, 0, 1),
      idCollaborators: [heitor.id, julia.id],
    }),
    createProject(db, {
      title: "Projeto de Ética",
      description: "Projeto de Ética para estudo de filosofia",
      creatorId: julia.id,
      startDate: new Date(2024, 0, 1),
      idCollaborators: [heitor.id, julia.id],
    }),
  ]);

  await Promise.all([
    createProduction(db, {
      title: "Artigo de IA",
      idArea: ai.id,
      idCollaborators: [joao.id, barbara.id],
      idCreator: joao.id,
      idProject: projAi.id,
      idType: "artigo",
      links: "https://www.artigo.com",
      pubDate: new Date(2021, 0, 1),
    }),
    createProduction(db, {
      title: "Livro de Geometria",
      idArea: geometry.id,
      idCollaborators: [joao.id, barbara.id],
      idCreator: barbara.id,
      idProject: projGeometry.id,
      idType: "livro",
      links: "https://www.livro.com",
      pubDate: new Date(2022, 0, 1),
    }),
    createProduction(db, {
      title: "Artigo de Botânica",
      idArea: botanics.id,
      idCollaborators: [heitor.id, julia.id],
      idCreator: heitor.id,
      idProject: projBotanics.id,
      idType: "artigo",
      links: "https://www.artigo.com",
      pubDate: new Date(2023, 0, 1),
    }),
    createProduction(db, {
      title: "Livro de Ética",
      idArea: ethics.id,
      idCollaborators: [heitor.id, julia.id],
      idCreator: julia.id,
      idProject: projEthics.id,
      idType: "livro",
      links: "https://www.livro.com",
      pubDate: new Date(2024, 0, 1),
    }),
    createProduction(db, {
      title: "Patente de AI",
      idArea: ai.id,
      idCollaborators: [joao.id, barbara.id],
      idCreator: joao.id,
      idProject: projAi.id,
      idType: "patente",
      links: "https://www.patente.com",
      pubDate: new Date(2021, 0, 1),
    }),
    createProduction(db, {
      title: "Trabalho de Geometria",
      idArea: geometry.id,
      idCollaborators: [joao.id, barbara.id],
      idCreator: barbara.id,
      idProject: projGeometry.id,
      idType: "trabalho",
      links: "https://www.trabalho.com",
      pubDate: new Date(2022, 0, 1),
    }),
    createProduction(db, {
      title: "Patente de Botânica",
      idArea: botanics.id,
      idCollaborators: [heitor.id, julia.id],
      idCreator: heitor.id,
      idProject: projBotanics.id,
      idType: "patente",
      links: "https://www.patente.com",
      pubDate: new Date(2023, 0, 1),
    }),
    createProduction(db, {
      title: "Trabalho de Ética",
      idArea: ethics.id,
      idCollaborators: [heitor.id, julia.id],
      idCreator: julia.id,
      idProject: projEthics.id,
      idType: "trabalho",
      links: "https://www.trabalho.com",
      pubDate: new Date(2024, 0, 1),
    }),
  ]);
}
