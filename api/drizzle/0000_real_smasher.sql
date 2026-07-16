CREATE TABLE "entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"medium" text NOT NULL,
	"title" text NOT NULL,
	"alt_titles" text[] DEFAULT '{}' NOT NULL,
	"cover_image_url" text,
	"franchise_id" integer,
	"description" text,
	"comments" text,
	"genres" text[] DEFAULT '{}' NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"staff" text[] DEFAULT '{}' NOT NULL,
	"status" text,
	"reference_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "franchises" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"primary_entry_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "entries" ADD CONSTRAINT "entries_franchise_id_franchises_id_fk" FOREIGN KEY ("franchise_id") REFERENCES "public"."franchises"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "entries_franchise_id_idx" ON "entries" USING btree ("franchise_id");--> statement-breakpoint
CREATE INDEX "entries_medium_idx" ON "entries" USING btree ("medium");--> statement-breakpoint
CREATE INDEX "entries_created_at_idx" ON "entries" USING btree ("created_at");