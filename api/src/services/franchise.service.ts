import { eq, ilike, or } from "drizzle-orm";
import { db } from "../db/index";
import { franchises, entries } from "../db/schema";

export interface CreateFranchiseInput {
  primaryTitle: string;
}

export const FranchiseService = {
  async getFranchises(search?: string) {
    if (search) {
      return db
        .select()
        .from(franchises)
        .where(ilike(franchises.title, `%${search}%`));
    }
    return db.select().from(franchises).orderBy(franchises.title);
  },

  async getFranchise(id: number) {
    const rows = await db.select().from(franchises).where(eq(franchises.id, id));
    return rows[0] ?? null;
  },

  async createFranchise(input: CreateFranchiseInput) {
    const rows = await db.insert(franchises).values({ title: input.primaryTitle }).returning();
    return rows[0];
  },

  async deleteFranchise(id: number) {
    const entryRows = await db.select().from(entries).where(eq(entries.franchiseId, id));

    await db.delete(entries).where(eq(entries.franchiseId, id));
    await db.delete(franchises).where(eq(franchises.id, id));

    return { deletedFranchiseId: id, deletedEntryCount: entryRows.length };
  },

  async getEntriesForFranchise(franchiseId: number) {
    return db.select().from(entries).where(eq(entries.franchiseId, franchiseId));
  },
};
