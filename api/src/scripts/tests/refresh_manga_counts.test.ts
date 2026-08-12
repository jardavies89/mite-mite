import {
  parseVolumeCount,
  pickBestMatch,
  buildUpdatedMetadata,
  classifyResult,
} from "../refresh_manga_counts";

// T002: test suite skeleton
// T003: parseVolumeCount tests
describe("parseVolumeCount", () => {
  it("parses ongoing volume count", () => {
    expect(parseVolumeCount("12 Volumes (Ongoing)")).toBe(12);
  });

  it("parses completed volume count", () => {
    expect(parseVolumeCount("115 Volumes (Completed)")).toBe(115);
  });

  it("parses singular Volume", () => {
    expect(parseVolumeCount("1 Volume (Ongoing)")).toBe(1);
  });

  it("returns null when no number present", () => {
    expect(parseVolumeCount("Ongoing")).toBeNull();
  });

  it("returns null for null input", () => {
    expect(parseVolumeCount(null)).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(parseVolumeCount("")).toBeNull();
  });

  it("is case-insensitive", () => {
    expect(parseVolumeCount("8 volumes (ongoing)")).toBe(8);
  });
});

// T004: pickBestMatch tests
type SearchResult = { series_id: number; title: string };

describe("pickBestMatch", () => {
  const results: SearchResult[] = [
    { series_id: 1, title: "Frieren: Beyond Journey's End" },
    { series_id: 2, title: "Frieren Side Story" },
  ];

  it("returns exact title match", () => {
    const match = pickBestMatch(results, "Frieren: Beyond Journey's End");
    expect(match?.series_id).toBe(1);
  });

  it("is case-insensitive", () => {
    const match = pickBestMatch(results, "frieren: beyond journey's end");
    expect(match?.series_id).toBe(1);
  });

  it("falls back to first result when no exact match", () => {
    const match = pickBestMatch(results, "Frieren");
    expect(match?.series_id).toBe(1);
  });

  it("returns null for empty results", () => {
    expect(pickBestMatch([], "Frieren")).toBeNull();
  });
});

// T005: buildUpdatedMetadata tests
describe("buildUpdatedMetadata", () => {
  it("merges volumeCount into existing metadata", () => {
    const existing = { chapterCount: 5, publishers: ["VIZ Media"] };
    const result = buildUpdatedMetadata(existing, { volumeCount: 12, mangaUpdatesId: "123" });
    expect(result).toEqual({
      chapterCount: 5,
      publishers: ["VIZ Media"],
      volumeCount: 12,
      mangaUpdatesId: "123",
    });
  });

  it("overwrites existing volumeCount", () => {
    const existing = { volumeCount: 8 };
    const result = buildUpdatedMetadata(existing, { volumeCount: 12, mangaUpdatesId: "123" });
    expect(result.volumeCount).toBe(12);
  });

  it("preserves all existing keys not in patch", () => {
    const existing = { chapterCount: 100, startDate: "2020-01", manualCounts: false };
    const result = buildUpdatedMetadata(existing, { volumeCount: 5, mangaUpdatesId: "456" });
    expect(result.chapterCount).toBe(100);
    expect(result.startDate).toBe("2020-01");
    expect(result.manualCounts).toBe(false);
  });

  it("handles null/undefined existing metadata", () => {
    const result = buildUpdatedMetadata(null, { volumeCount: 3, mangaUpdatesId: "789" });
    expect(result).toEqual({ volumeCount: 3, mangaUpdatesId: "789" });
  });
});

// T006: skip-logic / classifyResult tests
type EntryStub = {
  id: number;
  metadata: Record<string, unknown> | null;
  storedVolumeCount: number | null;
};

describe("classifyResult", () => {
  const baseEntry: EntryStub = { id: 1, metadata: {}, storedVolumeCount: null };

  it("skips when manualCounts is true", () => {
    const entry = { ...baseEntry, metadata: { manualCounts: true } };
    expect(classifyResult(entry, 10)).toEqual({
      status: "skipped",
      reason: "manualCounts flag set",
    });
  });

  it("skips when MU returns null volume", () => {
    expect(classifyResult(baseEntry, null)).toEqual({
      status: "skipped",
      reason: "MangaUpdates returned null/zero volume count",
    });
  });

  it("skips when MU returns zero volume", () => {
    expect(classifyResult(baseEntry, 0)).toEqual({
      status: "skipped",
      reason: "MangaUpdates returned null/zero volume count",
    });
  });

  it("skips when volume count is unchanged", () => {
    const entry = { ...baseEntry, storedVolumeCount: 12 };
    expect(classifyResult(entry, 12)).toEqual({
      status: "skipped",
      reason: "volume count unchanged (12)",
    });
  });

  it("returns update when count changes", () => {
    const entry = { ...baseEntry, storedVolumeCount: 8 };
    expect(classifyResult(entry, 12)).toEqual({ status: "update", newCount: 12 });
  });

  it("returns update when stored count is null and MU has a value", () => {
    expect(classifyResult(baseEntry, 5)).toEqual({ status: "update", newCount: 5 });
  });
});
