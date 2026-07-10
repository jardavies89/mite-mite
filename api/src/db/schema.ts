import { pgTable, serial, text, integer, timestamp, index } from "drizzle-orm/pg-core";

export const franchises = pgTable("franchises", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  primaryEntryId: integer("primary_entry_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const entries = pgTable(
  "entries",
  {
    id: serial("id").primaryKey(),
    medium: text("medium").notNull(),
    title: text("title").notNull(),
    altTitles: text("alt_titles").array().notNull().default([]),
    coverImageUrl: text("cover_image_url"),
    franchiseId: integer("franchise_id").references(() => franchises.id, {
      onDelete: "set null",
    }),
    description: text("description"),
    comments: text("comments"),
    genres: text("genres").array().notNull().default([]),
    tags: text("tags").array().notNull().default([]),
    staff: text("staff").array().notNull().default([]),
    status: text("status"),
    referenceUrl: text("reference_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("entries_franchise_id_idx").on(t.franchiseId),
    index("entries_medium_idx").on(t.medium),
    index("entries_created_at_idx").on(t.createdAt),
  ],
);
