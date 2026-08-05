import { GraphQLError } from "graphql";

import { entryResolvers } from "../entry";
import { EntryService } from "../../services/entry.service";
import { FranchiseService } from "../../services/franchise.service";

jest.mock("../../services/entry.service", () => ({
  EntryService: {
    getEntries: jest.fn(),
    getEntry: jest.fn(),
    createEntry: jest.fn(),
    deleteEntry: jest.fn(),
    updateEntry: jest.fn(),
  },
}));

jest.mock("../../services/franchise.service", () => ({
  FranchiseService: {
    getFranchise: jest.fn(),
  },
}));

const adminCtx = { isAdmin: true };
const guestCtx = { isAdmin: false };

const dbEntry = {
  id: 1,
  title: "My Title",
  altTitles: ["Alt 1", "Alt 2"],
  franchiseId: null,
  medium: "MANGA",
  status: null,
  coverImageUrl: null,
  description: null,
  comments: null,
  genres: [],
  tags: [],
  staff: [],
  referenceUrl: null,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("entryResolvers.Query.entries", () => {
  test("maps title → primaryTitle and altTitles → alternateTitles", async () => {
    (EntryService.getEntries as jest.Mock).mockResolvedValue([dbEntry]);
    const result = await entryResolvers.Query.entries();
    expect(result).toEqual([
      expect.objectContaining({ primaryTitle: "My Title", alternateTitles: ["Alt 1", "Alt 2"] }),
    ]);
  });

  test("returns empty array when no entries exist", async () => {
    (EntryService.getEntries as jest.Mock).mockResolvedValue([]);
    const result = await entryResolvers.Query.entries();
    expect(result).toEqual([]);
  });
});

describe("entryResolvers.Query.entry", () => {
  test("returns mapped entry when found", async () => {
    (EntryService.getEntry as jest.Mock).mockResolvedValue(dbEntry);
    const result = await entryResolvers.Query.entry(undefined, { id: "1" });
    expect(result).toMatchObject({ primaryTitle: "My Title", alternateTitles: ["Alt 1", "Alt 2"] });
  });

  test("returns null when not found", async () => {
    (EntryService.getEntry as jest.Mock).mockResolvedValue(null);
    const result = await entryResolvers.Query.entry(undefined, { id: "99" });
    expect(result).toBeNull();
  });

  test("passes numeric id to service", async () => {
    (EntryService.getEntry as jest.Mock).mockResolvedValue(null);
    await entryResolvers.Query.entry(undefined, { id: "42" });
    expect(EntryService.getEntry).toHaveBeenCalledWith(42);
  });
});

describe("entryResolvers.Mutation.createEntry", () => {
  test("throws GraphQLError when not admin", async () => {
    await expect(
      entryResolvers.Mutation.createEntry(
        undefined,
        { input: { primaryTitle: "X", medium: "MANGA" } },
        guestCtx,
      ),
    ).rejects.toThrow(GraphQLError);
  });

  test("creates and maps entry when admin", async () => {
    (EntryService.createEntry as jest.Mock).mockResolvedValue(dbEntry);
    const result = await entryResolvers.Mutation.createEntry(
      undefined,
      { input: { primaryTitle: "My Title", medium: "MANGA" } },
      adminCtx,
    );
    expect(result).toMatchObject({ primaryTitle: "My Title" });
  });

  test("does not call service when not admin", async () => {
    await expect(
      entryResolvers.Mutation.createEntry(
        undefined,
        { input: { primaryTitle: "X", medium: "MANGA" } },
        guestCtx,
      ),
    ).rejects.toThrow();
    expect(EntryService.createEntry).not.toHaveBeenCalled();
  });
});

describe("entryResolvers.Mutation.deleteEntry", () => {
  test("throws GraphQLError when not admin", async () => {
    await expect(
      entryResolvers.Mutation.deleteEntry(undefined, { id: "1" }, guestCtx),
    ).rejects.toThrow(GraphQLError);
  });

  test("delegates to service with numeric id when admin", async () => {
    (EntryService.deleteEntry as jest.Mock).mockResolvedValue(true);
    await entryResolvers.Mutation.deleteEntry(undefined, { id: "5" }, adminCtx);
    expect(EntryService.deleteEntry).toHaveBeenCalledWith(5);
  });
});

describe("entryResolvers.Mutation.updateEntry", () => {
  test("throws GraphQLError when not admin", async () => {
    await expect(
      entryResolvers.Mutation.updateEntry(
        undefined,
        { id: "1", input: { primaryTitle: "New" } },
        guestCtx,
      ),
    ).rejects.toThrow(GraphQLError);
  });

  test("does not call service when not admin", async () => {
    await expect(
      entryResolvers.Mutation.updateEntry(undefined, { id: "1", input: {} }, guestCtx),
    ).rejects.toThrow();
    expect(EntryService.updateEntry).not.toHaveBeenCalled();
  });

  test("returns mapped entry when admin", async () => {
    (EntryService.updateEntry as jest.Mock).mockResolvedValue(dbEntry);
    const result = await entryResolvers.Mutation.updateEntry(
      undefined,
      { id: "1", input: { primaryTitle: "Updated" } },
      adminCtx,
    );
    expect(result).toMatchObject({ primaryTitle: "My Title", alternateTitles: ["Alt 1", "Alt 2"] });
  });

  test("passes numeric id and input to service", async () => {
    (EntryService.updateEntry as jest.Mock).mockResolvedValue(dbEntry);
    const input = { primaryTitle: "Updated", status: "Completed" };
    await entryResolvers.Mutation.updateEntry(undefined, { id: "7", input }, adminCtx);
    expect(EntryService.updateEntry).toHaveBeenCalledWith(7, input);
  });
});

describe("entryResolvers.Entry.franchise", () => {
  test("returns null when franchiseId is null", async () => {
    const result = await entryResolvers.Entry.franchise({ franchiseId: null });
    expect(result).toBeNull();
    expect(FranchiseService.getFranchise).not.toHaveBeenCalled();
  });

  test("maps franchise title to primaryTitle when found", async () => {
    const dbFranchise = { id: 10, title: "Franchise Name", primaryEntryId: null };
    (FranchiseService.getFranchise as jest.Mock).mockResolvedValue(dbFranchise);
    const result = await entryResolvers.Entry.franchise({ franchiseId: 10 });
    expect(result).toMatchObject({ primaryTitle: "Franchise Name" });
  });

  test("returns null when franchise not found in service", async () => {
    (FranchiseService.getFranchise as jest.Mock).mockResolvedValue(null);
    const result = await entryResolvers.Entry.franchise({ franchiseId: 10 });
    expect(result).toBeNull();
  });
});
