import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { entries } from "../db/schema";
import { FranchiseService } from "./franchise.service";

export interface CreateEntryInput {
  alternateTitles?: string[];
  comments?: string;
  coverImageUrl?: string;
  description?: string;
  franchiseId?: number;
  genres?: string[];
  medium: string;
  newFranchiseName?: string;
  primaryTitle: string;
  referenceUrl?: string;
  staff?: string[];
  status?: string;
  tags?: string[];
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
        comments: input.comments ?? null,
        description: input.description ?? null,
        genres: input.genres ?? [],
        referenceUrl: input.referenceUrl ?? null,
        staff: input.staff ?? [],
        status: input.status ?? null,
        tags: input.tags ?? [],
      })
      .returning();

    const entry = rows[0];

    if (franchiseId && entry) {
      const franchise = await FranchiseService.getFranchise(franchiseId);
      if (franchise && !franchise.primaryEntryId) {
        await FranchiseService.setPrimaryEntry(franchiseId, entry.id);
      }
    }

    return entry;
  },

  async deleteEntry(id: number) {
    const deleted = await db.delete(entries).where(eq(entries.id, id)).returning();
    return deleted.length > 0;
  },
};
