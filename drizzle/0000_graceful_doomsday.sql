CREATE TABLE IF NOT EXISTS "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256),
	"start_date" date,
	"end_date" date,
	"collaborators" varchar(256),
	"description" varchar,
	"results" varchar,
	"status" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "researchers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"picture" varchar(256),
	"university" varchar(256),
	"areas" varchar(256),
	"main_area" varchar(256),
	"date_of_birth" date,
	"contact_info" varchar(256)
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "title_idx" ON "projects" ("title");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "name_idx" ON "researchers" ("name");