import { GraphQLError } from "graphql";

import { franchiseResolvers } from "../franchise";
import { FranchiseService } from "../../services/franchise.service";

jest.mock("../../services/franchise.service", () => ({
  FranchiseService: {
    getFranchise: jest.fn(),
    getFranchises: jest.fn(),
    createFranchise: jest.fn(),
    deleteFranchise: jest.fn(),
    getEntriesForFranchise: jest.fn(),
    updateFranchise: jest.fn(),
  },
}));

const adminCtx = { isAdmin: true };
const guestCtx = { isAdmin: false };

const dbFranchise = { id: 1, title: "My Franchise", primaryEntryId: null };
const dbEntry = {
  id: 1,
  title: "Entry Title",
  altTitles: ["Alt"],
  franchiseId: 1,
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

describe("franchiseResolvers.Query.franchise", () => {
  test("maps title → primaryTitle when found", async () => {
    (FranchiseService.getFranchise as jest.Mock).mockResolvedValue(dbFranchise);
    const result = await franchiseResolvers.Query.franchise(undefined, { id: "1" });
    expect(result).toMatchObject({ primaryTitle: "My Franchise" });
  });

  test("returns null when not found", async () => {
    (FranchiseService.getFranchise as jest.Mock).mockResolvedValue(null);
    const result = await franchiseResolvers.Query.franchise(undefined, { id: "99" });
    expect(result).toBeNull();
  });

  test("passes numeric id to service", async () => {
    (FranchiseService.getFranchise as jest.Mock).mockResolvedValue(null);
    await franchiseResolvers.Query.franchise(undefined, { id: "7" });
    expect(FranchiseService.getFranchise).toHaveBeenCalledWith(7);
  });
});

describe("franchiseResolvers.Query.franchises", () => {
  test("maps title → primaryTitle for all rows", async () => {
    (FranchiseService.getFranchises as jest.Mock).mockResolvedValue([dbFranchise]);
    const result = await franchiseResolvers.Query.franchises(undefined, {});
    expect(result).toEqual([expect.objectContaining({ primaryTitle: "My Franchise" })]);
  });

  test("passes search argument through to service", async () => {
    (FranchiseService.getFranchises as jest.Mock).mockResolvedValue([]);
    await franchiseResolvers.Query.franchises(undefined, { search: "naruto" });
    expect(FranchiseService.getFranchises).toHaveBeenCalledWith({
      search: "naruto",
      genres: undefined,
      tags: undefined,
      status: undefined,
      medium: undefined,
    });
  });

  test("passes filter arguments through to service", async () => {
    (FranchiseService.getFranchises as jest.Mock).mockResolvedValue([]);
    await franchiseResolvers.Query.franchises(undefined, {
      genres: ["Action"],
      tags: ["Shounen"],
      status: "Ongoing",
    });
    expect(FranchiseService.getFranchises).toHaveBeenCalledWith({
      search: undefined,
      genres: ["Action"],
      tags: ["Shounen"],
      status: "Ongoing",
      medium: undefined,
    });
  });

  test("passes undefined for all args when none provided", async () => {
    (FranchiseService.getFranchises as jest.Mock).mockResolvedValue([]);
    await franchiseResolvers.Query.franchises(undefined, {});
    expect(FranchiseService.getFranchises).toHaveBeenCalledWith({
      search: undefined,
      genres: undefined,
      tags: undefined,
      status: undefined,
      medium: undefined,
    });
  });

  test("passes medium filter to service when provided", async () => {
    (FranchiseService.getFranchises as jest.Mock).mockResolvedValue([]);
    await franchiseResolvers.Query.franchises(undefined, { medium: "SHOW" });
    expect(FranchiseService.getFranchises).toHaveBeenCalledWith({
      search: undefined,
      genres: undefined,
      tags: undefined,
      status: undefined,
      medium: "SHOW",
    });
  });
});

describe("franchiseResolvers mapFranchise", () => {
  test("includes primaryEntryId as null when unset", async () => {
    (FranchiseService.getFranchise as jest.Mock).mockResolvedValue(dbFranchise);
    const result = await franchiseResolvers.Query.franchise(undefined, { id: "1" });
    expect(result).toMatchObject({ primaryEntryId: null });
  });

  test("includes primaryEntryId as string when set", async () => {
    (FranchiseService.getFranchise as jest.Mock).mockResolvedValue({
      ...dbFranchise,
      primaryEntryId: 5,
    });
    const result = await franchiseResolvers.Query.franchise(undefined, { id: "1" });
    expect(result).toMatchObject({ primaryEntryId: "5" });
  });
});

describe("franchiseResolvers.Mutation.createFranchise", () => {
  test("throws GraphQLError when not admin", async () => {
    await expect(
      franchiseResolvers.Mutation.createFranchise(
        undefined,
        { input: { primaryTitle: "X" } },
        guestCtx,
      ),
    ).rejects.toThrow(GraphQLError);
  });

  test("creates and maps franchise when admin", async () => {
    (FranchiseService.createFranchise as jest.Mock).mockResolvedValue(dbFranchise);
    const result = await franchiseResolvers.Mutation.createFranchise(
      undefined,
      { input: { primaryTitle: "My Franchise" } },
      adminCtx,
    );
    expect(result).toMatchObject({ primaryTitle: "My Franchise" });
  });

  test("does not call service when not admin", async () => {
    await expect(
      franchiseResolvers.Mutation.createFranchise(
        undefined,
        { input: { primaryTitle: "X" } },
        guestCtx,
      ),
    ).rejects.toThrow();
    expect(FranchiseService.createFranchise).not.toHaveBeenCalled();
  });
});

describe("franchiseResolvers.Mutation.deleteFranchise", () => {
  test("throws GraphQLError when not admin", async () => {
    await expect(
      franchiseResolvers.Mutation.deleteFranchise(undefined, { id: "1" }, guestCtx),
    ).rejects.toThrow(GraphQLError);
  });

  test("returns deletedFranchiseId as string and deletedEntryCount as number when admin", async () => {
    (FranchiseService.deleteFranchise as jest.Mock).mockResolvedValue({
      deletedFranchiseId: 1,
      deletedEntryCount: 3,
    });
    const result = await franchiseResolvers.Mutation.deleteFranchise(
      undefined,
      { id: "1" },
      adminCtx,
    );
    expect(result).toEqual({ deletedFranchiseId: "1", deletedEntryCount: 3 });
  });
});

describe("franchiseResolvers.Mutation.updateFranchise", () => {
  test("throws GraphQLError when not admin", async () => {
    await expect(
      franchiseResolvers.Mutation.updateFranchise(
        undefined,
        { id: "1", input: { primaryTitle: "New Name" } },
        guestCtx,
      ),
    ).rejects.toThrow(GraphQLError);
  });

  test("does not call service when not admin", async () => {
    await expect(
      franchiseResolvers.Mutation.updateFranchise(
        undefined,
        { id: "1", input: { primaryTitle: "X" } },
        guestCtx,
      ),
    ).rejects.toThrow();
    expect(FranchiseService.updateFranchise).not.toHaveBeenCalled();
  });

  test("returns mapped franchise when admin", async () => {
    (FranchiseService.updateFranchise as jest.Mock).mockResolvedValue({
      ...dbFranchise,
      title: "Updated Name",
    });
    const result = await franchiseResolvers.Mutation.updateFranchise(
      undefined,
      { id: "1", input: { primaryTitle: "Updated Name" } },
      adminCtx,
    );
    expect(result).toMatchObject({ primaryTitle: "Updated Name" });
  });

  test("passes numeric id and input to service", async () => {
    (FranchiseService.updateFranchise as jest.Mock).mockResolvedValue(dbFranchise);
    const input = { primaryTitle: "Renamed" };
    await franchiseResolvers.Mutation.updateFranchise(undefined, { id: "3", input }, adminCtx);
    expect(FranchiseService.updateFranchise).toHaveBeenCalledWith(3, input);
  });
});

describe("franchiseResolvers.Franchise.entries", () => {
  test("maps title → primaryTitle and altTitles → alternateTitles for each entry", async () => {
    (FranchiseService.getEntriesForFranchise as jest.Mock).mockResolvedValue([dbEntry]);
    const result = await franchiseResolvers.Franchise.entries({ id: 1 });
    expect(result).toEqual([
      expect.objectContaining({ primaryTitle: "Entry Title", alternateTitles: ["Alt"] }),
    ]);
  });

  test("returns empty array when franchise has no entries", async () => {
    (FranchiseService.getEntriesForFranchise as jest.Mock).mockResolvedValue([]);
    const result = await franchiseResolvers.Franchise.entries({ id: 1 });
    expect(result).toEqual([]);
  });
});
