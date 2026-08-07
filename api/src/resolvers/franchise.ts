import { GraphQLError } from "graphql";
import { FranchiseService } from "../services/franchise.service";
import type { UpdateFranchiseInput } from "../services/franchise.service";
import type { ApolloContext } from "../auth";

function requireAdmin(ctx: ApolloContext) {
  if (!ctx.isAdmin) {
    throw new GraphQLError("Unauthorized", { extensions: { code: "UNAUTHENTICATED" } });
  }
}

function mapFranchise(row: Awaited<ReturnType<typeof FranchiseService.getFranchise>>) {
  if (!row) return null;
  return {
    ...row,
    primaryTitle: row.title,
    primaryEntryId: row.primaryEntryId ? String(row.primaryEntryId) : null,
  };
}

export const franchiseResolvers = {
  Query: {
    availableFilterOptions: async () => {
      return FranchiseService.getAvailableFilterOptions();
    },
    franchise: async (_: unknown, { id }: { id: string }) => {
      return mapFranchise(await FranchiseService.getFranchise(Number(id)));
    },
    franchises: async (
      _: unknown,
      {
        search,
        genres,
        tags,
        status,
        medium,
      }: { search?: string; genres?: string[]; tags?: string[]; status?: string; medium?: string },
    ) => {
      const rows = await FranchiseService.getFranchises({ search, genres, tags, status, medium });
      return rows.map((r) => mapFranchise(r)!);
    },
  },

  Mutation: {
    createFranchise: async (
      _: unknown,
      { input }: { input: { primaryTitle: string } },
      ctx: ApolloContext,
    ) => {
      requireAdmin(ctx);
      const row = await FranchiseService.createFranchise({ primaryTitle: input.primaryTitle });
      return mapFranchise(row)!;
    },
    deleteFranchise: async (_: unknown, { id }: { id: string }, ctx: ApolloContext) => {
      requireAdmin(ctx);
      const result = await FranchiseService.deleteFranchise(Number(id));
      return {
        deletedFranchiseId: String(result.deletedFranchiseId),
        deletedEntryCount: result.deletedEntryCount,
      };
    },
    updateFranchise: async (
      _: unknown,
      { id, input }: { id: string; input: UpdateFranchiseInput },
      ctx: ApolloContext,
    ) => {
      requireAdmin(ctx);
      return mapFranchise(await FranchiseService.updateFranchise(Number(id), input))!;
    },
  },

  Franchise: {
    entries: async (franchise: { id: number }) => {
      const rows = await FranchiseService.getEntriesForFranchise(franchise.id);
      return rows.map((r) => ({ ...r, primaryTitle: r.title, alternateTitles: r.altTitles, metadata: r.metadata ?? {} }));
    },
  },
};
