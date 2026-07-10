import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { entries, franchises } from "../db/schema";
import { FranchiseService } from "./franchise.service";

export interface CreateEntryInput {
  medium: string;
  primaryTitle: string;
  alternateTitles?: string[];
  coverImageUrl?: string;
  franchiseId?: number;
  newFranchiseName?: string;
  genres?: string[];
  tags?: string[];
  referenceUrl?: string;
}

export const EntryService = {
  async getEntries() {
    return db.select().from(entries).orderBy(entries.title);
  },

  async getEntry(id: number) {
    const rows = await db.select().from(entries).where(eq(entries.id, id));
    return rows[0] ?? null;
  },

  async createEntry(input: CreateEntryInput) {
    let franchiseId = input.franchiseId ? Number(input.franchiseId) : null;

    if (input.newFranchiseName && !franchiseId) {
      const franchise = await FranchiseService.createFranchise({
        primaryTitle: input.newFranchiseName,
      });
      franchiseId = franchise.id;
    }

    const rows = await db
      .insert(entries)
      .values({
        medium: input.medium,
        title: input.primaryTitle,
        altTitles: input.alternateTitles ?? [],
        coverImageUrl: input.coverImageUrl ?? null,
        franchiseId: franchiseId ?? null,
        genres: input.genres ?? [],
        tags: input.tags ?? [],
        referenceUrl: input.referenceUrl ?? null,
      })
      .returning();

    return rows[0];
  },

  async deleteEntry(id: number) {
    const deleted = await db.delete(entries).where(eq(entries.id, id)).returning();
    return deleted.length > 0;
  },
};
