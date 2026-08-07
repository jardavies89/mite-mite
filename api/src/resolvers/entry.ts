import { GraphQLError } from "graphql";
import { EntryService } from "../services/entry.service";
import type { UpdateEntryInput } from "../services/entry.service";
import { FranchiseService } from "../services/franchise.service";
import type { ApolloContext } from "../auth";

function requireAdmin(ctx: ApolloContext) {
  if (!ctx.isAdmin) {
    throw new GraphQLError("Unauthorized", { extensions: { code: "UNAUTHENTICATED" } });
  }
}

function mapEntry(row: Awaited<ReturnType<typeof EntryService.getEntry>>) {
  if (!row) return null;
  return {
    ...row,
    primaryTitle: row.title,
    alternateTitles: row.altTitles,
    metadata: row.metadata ?? {},
  };
}

export const entryResolvers = {
  Query: {
    entries: async () => {
      const rows = await EntryService.getEntries();
      return rows.map((r) => mapEntry(r)!);
    },
    entry: async (_: unknown, { id }: { id: string }) => {
      return mapEntry(await EntryService.getEntry(Number(id)));
    },
  },

  Mutation: {
    createEntry: async (
      _: unknown,
      { input }: { input: Parameters<typeof EntryService.createEntry>[0] },
      ctx: ApolloContext,
    ) => {
      requireAdmin(ctx);
      return mapEntry(await EntryService.createEntry(input))!;
    },
    deleteEntry: async (_: unknown, { id }: { id: string }, ctx: ApolloContext) => {
      requireAdmin(ctx);
      return EntryService.deleteEntry(Number(id));
    },
    updateEntry: async (
      _: unknown,
      { id, input }: { id: string; input: UpdateEntryInput },
      ctx: ApolloContext,
    ) => {
      requireAdmin(ctx);
      return mapEntry(await EntryService.updateEntry(Number(id), input))!;
    },
  },

  Entry: {
    franchise: async (entry: { franchiseId: number | null }) => {
      if (!entry.franchiseId) return null;
      const f = await FranchiseService.getFranchise(entry.franchiseId);
      if (!f) return null;
      return { ...f, primaryTitle: f.title };
    },
  },
};
