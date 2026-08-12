import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";

// --- DB mock (must be before importing the module under test) ---

const mockWhere = jest.fn();
const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
const mockSelect = jest.fn().mockReturnValue({ from: mockFrom });

const mockUpdateWhere = jest.fn();
const mockSet = jest.fn().mockReturnValue({ where: mockUpdateWhere });
const mockUpdate = jest.fn().mockReturnValue({ set: mockSet });

jest.mock("../../db/index", () => ({
  db: { select: mockSelect, update: mockUpdate },
}));

jest.mock("../../db/schema", () => ({
  entries: {},
}));

import {
  extractAniListId,
  fetchAniListCounts,
  fetchAniListMangaEntries,
  classifyCounts,
  buildUpdatedMetadata,
  runRefresh,
} from "../refresh_manga_counts";

// ---------------------------------------------------------------------------
// Phase 2 — T003: extractAniListId
// ---------------------------------------------------------------------------

describe("extractAniListId", () => {
  it("extracts ID from a standard AniList manga URL", () => {
    expect(extractAniListId("https://anilist.co/manga/12345")).toBe(12345);
  });

  it("extracts ID from a URL with a title slug", () => {
    expect(extractAniListId("https://anilist.co/manga/12345/Berserk")).toBe(12345);
  });

  it("returns null for a non-AniList URL", () => {
    expect(extractAniListId("https://myanimelist.net/manga/2")).toBeNull();
  });

  it("returns null for a malformed URL", () => {
    expect(extractAniListId("not-a-url")).toBeNull();
  });

  it("returns null for an AniList URL that is not a manga path", () => {
    expect(extractAniListId("https://anilist.co/anime/21")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Phase 2 — T005: fetchAniListCounts
// ---------------------------------------------------------------------------

describe("fetchAniListCounts", () => {
  beforeEach(() => {
    jest.spyOn(global, "fetch");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns volumes and chapters on a successful response", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { Media: { volumes: 12, chapters: 104 } } }),
    });

    const result = await fetchAniListCounts(12345);
    expect(result).toEqual({ volumes: 12, chapters: 104 });
  });

  it("throws when AniList returns a non-ok HTTP status", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 429 });

    await expect(fetchAniListCounts(12345)).rejects.toThrow("AniList request failed: 429");
  });

  it("throws when AniList returns GraphQL errors", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ errors: [{ message: "Not Found" }], data: null }),
    });

    await expect(fetchAniListCounts(12345)).rejects.toThrow("Not Found");
  });

  it("throws when fetch itself fails (network error)", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("network failure"));

    await expect(fetchAniListCounts(12345)).rejects.toThrow("network failure");
  });
});

// ---------------------------------------------------------------------------
// Phase 2 — T007: fetchAniListMangaEntries
// ---------------------------------------------------------------------------

describe("fetchAniListMangaEntries", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSelect.mockReturnValue({ from: mockFrom });
    mockFrom.mockReturnValue({ where: mockWhere });
  });

  it("returns entries from the DB query", async () => {
    const fakeEntries = [
      { id: 1, referenceUrl: "https://anilist.co/manga/1", metadata: null },
      { id: 2, referenceUrl: "https://anilist.co/manga/2", metadata: { volumeCount: 5 } },
    ];
    mockWhere.mockResolvedValueOnce(fakeEntries);

    const result = await fetchAniListMangaEntries();
    expect(result).toEqual(fakeEntries);
    expect(mockSelect).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Phase 3 — T009: classifyCounts (US1)
// ---------------------------------------------------------------------------

describe("classifyCounts", () => {
  it("returns update when volumeCount has changed", () => {
    const result = classifyCounts(
      { volumeCount: 10, chapterCount: 80 },
      { volumes: 11, chapters: 80 },
    );
    expect(result).toEqual({ volumeCount: 11 });
  });

  it("returns update when chapterCount has changed", () => {
    const result = classifyCounts(
      { volumeCount: 5, chapterCount: 40 },
      { volumes: 5, chapters: 45 },
    );
    expect(result).toEqual({ chapterCount: 45 });
  });

  it("returns update for both when both have changed", () => {
    const result = classifyCounts(
      { volumeCount: 5, chapterCount: 40 },
      { volumes: 6, chapters: 50 },
    );
    expect(result).toEqual({ volumeCount: 6, chapterCount: 50 });
  });

  it("returns null when stored counts match AniList (no update needed)", () => {
    const result = classifyCounts(
      { volumeCount: 5, chapterCount: 40 },
      { volumes: 5, chapters: 40 },
    );
    expect(result).toBeNull();
  });

  it("returns update when stored count is null (initial population)", () => {
    const result = classifyCounts(null, { volumes: 12, chapters: 104 });
    expect(result).toEqual({ volumeCount: 12, chapterCount: 104 });
  });

  it("skips volumeCount when AniList returns null (FR-008)", () => {
    const result = classifyCounts(
      { volumeCount: 10, chapterCount: 80 },
      { volumes: null, chapters: 85 },
    );
    expect(result).toEqual({ chapterCount: 85 });
  });

  it("skips chapterCount when AniList returns 0 (FR-008)", () => {
    const result = classifyCounts(
      { volumeCount: 10, chapterCount: 80 },
      { volumes: 11, chapters: 0 },
    );
    expect(result).toEqual({ volumeCount: 11 });
  });

  it("returns null when AniList returns null/0 for both counts and stored values exist", () => {
    const result = classifyCounts(
      { volumeCount: 10, chapterCount: 80 },
      { volumes: null, chapters: 0 },
    );
    expect(result).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Phase 3 — T010 / Phase 4 — T018: buildUpdatedMetadata (US1 + US2)
// ---------------------------------------------------------------------------

describe("buildUpdatedMetadata", () => {
  it("merges volumeCount into existing metadata without touching other fields", () => {
    const existing = {
      volumeCount: 10,
      chapterCount: 80,
      publishers: ["Shueisha"],
      startYear: 2005,
    };
    const result = buildUpdatedMetadata(existing, { volumeCount: 11 });
    expect(result).toEqual({
      volumeCount: 11,
      chapterCount: 80,
      publishers: ["Shueisha"],
      startYear: 2005,
    });
  });

  it("merges both counts while preserving all other metadata fields", () => {
    const existing = {
      volumeCount: 5,
      chapterCount: 40,
      publishers: ["Kodansha"],
      tags: ["action"],
    };
    const result = buildUpdatedMetadata(existing, { volumeCount: 6, chapterCount: 50 });
    expect(result).toEqual({
      volumeCount: 6,
      chapterCount: 50,
      publishers: ["Kodansha"],
      tags: ["action"],
    });
  });

  it("handles null existing metadata (initial population)", () => {
    const result = buildUpdatedMetadata(null, { volumeCount: 12, chapterCount: 104 });
    expect(result).toEqual({ volumeCount: 12, chapterCount: 104 });
  });
});

// ---------------------------------------------------------------------------
// Phase 3 — T011: per-entry error isolation
// ---------------------------------------------------------------------------

describe("runRefresh — error isolation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSelect.mockReturnValue({ from: mockFrom });
    mockFrom.mockReturnValue({ where: mockWhere });
    mockUpdate.mockReturnValue({ set: mockSet });
    mockSet.mockReturnValue({ where: mockUpdateWhere });
    mockUpdateWhere.mockResolvedValue([]);
    jest.spyOn(global, "fetch");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("continues processing remaining entries when one AniList fetch fails", async () => {
    const entries = [
      {
        id: 1,
        referenceUrl: "https://anilist.co/manga/1",
        metadata: { volumeCount: 5, chapterCount: 40 },
      },
      {
        id: 2,
        referenceUrl: "https://anilist.co/manga/2",
        metadata: { volumeCount: 3, chapterCount: 20 },
      },
    ];
    mockWhere.mockResolvedValueOnce(entries);

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: false, status: 500 }) // entry 1 fails
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { Media: { volumes: 4, chapters: 25 } } }),
      }); // entry 2 succeeds

    const results = await runRefresh();

    const kinds = results.map((r) => r.kind);
    expect(kinds).toContain("error");
    expect(kinds).toContain("updated");
    expect(results).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// Phase 3 — T012: runRefresh summary / Phase 4 — T019: no write when no change
// ---------------------------------------------------------------------------

describe("runRefresh — results summary", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSelect.mockReturnValue({ from: mockFrom });
    mockFrom.mockReturnValue({ where: mockWhere });
    mockUpdate.mockReturnValue({ set: mockSet });
    mockSet.mockReturnValue({ where: mockUpdateWhere });
    mockUpdateWhere.mockResolvedValue([]);
    jest.spyOn(global, "fetch");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns 'updated' result when counts have changed", async () => {
    mockWhere.mockResolvedValueOnce([
      {
        id: 7,
        referenceUrl: "https://anilist.co/manga/7",
        metadata: { volumeCount: 41, chapterCount: 364 },
      },
    ]);
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { Media: { volumes: 42, chapters: 364 } } }),
    });

    const results = await runRefresh();
    expect(results).toHaveLength(1);
    expect(results[0].kind).toBe("updated");
    if (results[0].kind === "updated") {
      expect(results[0].changes).toEqual({ volumeCount: 42 });
    }
  });

  it("returns 'no_change' and does NOT write to DB when counts match", async () => {
    mockWhere.mockResolvedValueOnce([
      {
        id: 7,
        referenceUrl: "https://anilist.co/manga/7",
        metadata: { volumeCount: 42, chapterCount: 364 },
      },
    ]);
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { Media: { volumes: 42, chapters: 364 } } }),
    });

    const results = await runRefresh();
    expect(results[0].kind).toBe("no_change");
    expect(mockUpdate).not.toHaveBeenCalled(); // T019: no write when no change
  });

  it("returns 'skipped' when AniList ID cannot be extracted from referenceUrl", async () => {
    mockWhere.mockResolvedValueOnce([
      { id: 9, referenceUrl: "https://myanimelist.net/manga/9", metadata: null },
    ]);

    const results = await runRefresh();
    expect(results[0].kind).toBe("skipped");
  });

  it("returns 'skipped' when AniList returns null/0 for all counts", async () => {
    mockWhere.mockResolvedValueOnce([
      {
        id: 10,
        referenceUrl: "https://anilist.co/manga/10",
        metadata: { volumeCount: 5, chapterCount: 40 },
      },
    ]);
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { Media: { volumes: null, chapters: 0 } } }),
    });

    const results = await runRefresh();
    expect(results[0].kind).toBe("skipped");
  });

  it("skips a completed entry whose counts are already populated without calling AniList", async () => {
    mockWhere.mockResolvedValueOnce([
      {
        id: 11,
        referenceUrl: "https://anilist.co/manga/11",
        status: "Completed",
        metadata: { volumeCount: 37, chapterCount: 363 },
      },
    ]);

    const results = await runRefresh();
    expect(results[0].kind).toBe("skipped");
    expect(results[0].kind === "skipped" && results[0].reason).toMatch(/completed/i);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("does NOT skip a completed entry when counts are missing (initial population)", async () => {
    mockWhere.mockResolvedValueOnce([
      {
        id: 12,
        referenceUrl: "https://anilist.co/manga/12",
        status: "Completed",
        metadata: { volumeCount: 37 }, // chapterCount missing
      },
    ]);
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { Media: { volumes: 37, chapters: 363 } } }),
    });

    const results = await runRefresh();
    expect(results[0].kind).toBe("updated");
  });
});
