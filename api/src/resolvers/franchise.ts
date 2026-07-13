import { GraphQLError } from "graphql";
import { FranchiseService } from "../services/franchise.service";
import type { ApolloContext } from "../auth";

function requireAdmin(ctx: ApolloContext) {
  if (!ctx.isAdmin) {
    throw new GraphQLError("Unauthorized", { extensions: { code: "UNAUTHENTICATED" } });
  }
}

function mapFranchise(row: Awaited<ReturnType<typeof FranchiseService.getFranchise>>) {
  if (!row) return null;
  return { ...row, primaryTitle: row.title };
}

export const franchiseResolvers = {
  Query: {
    franchise: async (_: unknown, { id }: { id: string }) => {
      return mapFranchise(await FranchiseService.getFranchise(Number(id)));
    },
    franchises: async (_: unknown, { search }: { search?: string }) => {
      const rows = await FranchiseService.getFranchises(search);
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
  },

  Franchise: {
    entries: async (franchise: { id: number }) => {
      const rows = await FranchiseService.getEntriesForFranchise(franchise.id);
      return rows.map((r) => ({ ...r, primaryTitle: r.title, alternateTitles: r.altTitles }));
    },
  },
};
