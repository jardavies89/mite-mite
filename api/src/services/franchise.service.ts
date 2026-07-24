import { and, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "../db/index";
import { franchises, entries } from "../db/schema";

export interface CreateFranchiseInput {
  primaryTitle: string;
}

export interface GetFranchisesParams {
  search?: string;
  genres?: string[];
  tags?: string[];
  status?: string;
}

export const FranchiseService = {
  async getFranchises(params?: GetFranchisesParams) {
    const { search, genres, tags, status } = params ?? {};

    const needsJoin =
      search || (genres && genres.length > 0) || (tags && tags.length > 0) || status;

    if (needsJoin) {
      const conditions = [];

      if (search) {
        const term = `%${search}%`;
        conditions.push(
          or(
            ilike(franchises.title, term),
            sql`array_to_string(${entries.altTitles}, ',') ILIKE ${term}`,
            sql`array_to_string(${entries.staff}, ',') ILIKE ${term}`,
          ),
        );
      }

      if (genres && genres.length > 0) {
        conditions.push(
          sql`${entries.genres} @> ARRAY[${sql.join(genres.map((g) => sql`${g}`), sql`, `)}]::text[]`,
        );
      }

      if (tags && tags.length > 0) {
        conditions.push(
          sql`${entries.tags} @> ARRAY[${sql.join(tags.map((t) => sql`${t}`), sql`, `)}]::text[]`,
        );
      }

      if (status) {
        conditions.push(eq(entries.status, status));
      }

      const rows = await db
        .selectDistinct({ franchise: franchises })
        .from(franchises)
        .leftJoin(entries, eq(entries.id, franchises.primaryEntryId))
        .where(conditions.length === 1 ? conditions[0] : and(...conditions))
        .orderBy(franchises.title);
      return rows.map((r) => r.franchise);
    }

    return db.select().from(franchises).orderBy(franchises.title);
  },

  async getAvailableFilterOptions() {
    const rows = await db.select({ genres: entries.genres, tags: entries.tags }).from(entries);
    const genres = [...new Set(rows.flatMap((r) => r.genres))].sort();
    const tags = [...new Set(rows.flatMap((r) => r.tags))].sort();
    return { genres, tags };
  },

  async getFranchise(id: number) {
    const rows = await db.select().from(franchises).where(eq(franchises.id, id));
    return rows[0] ?? null;
  },

  async createFranchise(input: CreateFranchiseInput) {
    const rows = await db.insert(franchises).values({ title: input.primaryTitle }).returning();
    return rows[0];
  },

  async setPrimaryEntry(franchiseId: number, entryId: number) {
    const rows = await db
      .update(franchises)
      .set({ primaryEntryId: entryId })
      .where(eq(franchises.id, franchiseId))
      .returning();
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
