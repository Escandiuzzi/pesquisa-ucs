CREATE TABLE IF NOT EXISTS "productions" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256),
	"pub_date" date,
	"type" varchar(256),
	"area" varchar,
	"collaborators" varchar,
	"links" varchar
);
--> statement-breakpoint
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
CREATE UNIQUE INDEX IF NOT EXISTS "productions_title_idx" ON "productions" ("title");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "projects_title_idx" ON "projects" ("title");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "researchers_name_idx" ON "researchers" ("name");