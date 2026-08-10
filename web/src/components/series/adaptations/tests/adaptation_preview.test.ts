import { buildAdaptationPreview } from "../adaptation_preview";

function makeEntry(overrides: Partial<Entry>): Entry {
  return {
    id: "1",
    primaryTitle: "Test",
    alternateTitles: [],
    comments: "",
    coverImageUrl: "",
    description: "",
    genres: [],
    medium: "SHOW",
    metadata: {},
    referenceUrl: undefined,
    staff: [],
    status: "Ongoing",
    tags: [],
    ...overrides,
  };
}

describe("buildAdaptationPreview — Show", () => {
  test("returns 'Show' for show with no metadata", () => {
    const entry = makeEntry({ medium: "SHOW", metadata: null as unknown as EntryMetadata });
    expect(buildAdaptationPreview(entry)).toBe("Show");
  });

  test("returns 'Anime' for ANIME style, 'Show' for LIVE_ACTION, 'Show' for unset", () => {
    expect(
      buildAdaptationPreview(makeEntry({ medium: "SHOW", metadata: { style: "ANIME" } })),
    ).toMatch(/^Anime/);
    expect(
      buildAdaptationPreview(makeEntry({ medium: "SHOW", metadata: { style: "LIVE_ACTION" } })),
    ).toMatch(/^Show/);
    expect(buildAdaptationPreview(makeEntry({ medium: "SHOW", metadata: {} }))).toMatch(/^Show/);
  });

  test("includes season count when seasons are present", () => {
    const entry = makeEntry({
      medium: "SHOW",
      metadata: {
        style: "ANIME",
        seasons: [{ episodeCount: 12 }, { episodeCount: 24 }],
      },
    });
    expect(buildAdaptationPreview(entry)).toContain("2 seasons");
  });

  test("uses '1 season' singular when one season", () => {
    const entry = makeEntry({
      medium: "SHOW",
      metadata: { seasons: [{ episodeCount: 12 }] },
    });
    expect(buildAdaptationPreview(entry)).toContain("1 season");
  });

  test("omits season segment when seasons is absent or empty", () => {
    const entry = makeEntry({ medium: "SHOW", metadata: { style: "ANIME" } });
    expect(buildAdaptationPreview(entry)).not.toContain("season");
  });

  test("includes studio when present", () => {
    const entry = makeEntry({ medium: "SHOW", metadata: { studio: "MAPPA" } });
    expect(buildAdaptationPreview(entry)).toContain("MAPPA");
  });

  test("omits studio segment when not present", () => {
    const entry = makeEntry({ medium: "SHOW", metadata: {} });
    expect(buildAdaptationPreview(entry)).not.toContain("undefined");
  });

  test("includes start year from ISO date string", () => {
    const entry = makeEntry({ medium: "SHOW", metadata: { startDate: "2013-04-07" } });
    expect(buildAdaptationPreview(entry)).toContain("2013");
  });

  test("appends '–present' when endDate is not set but startDate is", () => {
    const entry = makeEntry({ medium: "SHOW", metadata: { startDate: "2021-01-01" } });
    expect(buildAdaptationPreview(entry)).toContain("2021–present");
  });

  test("shows 'startYear–endYear' when both dates are set", () => {
    const entry = makeEntry({
      medium: "SHOW",
      metadata: { startDate: "2013-04-07", endDate: "2023-03-27" },
    });
    expect(buildAdaptationPreview(entry)).toContain("2013–2023");
  });

  test("omits date range when startDate is not set", () => {
    const entry = makeEntry({ medium: "SHOW", metadata: { endDate: "2020-01-01" } });
    expect(buildAdaptationPreview(entry)).not.toContain("–");
  });

  test("full show preview: Anime · 2 seasons · MAPPA · 2021–present", () => {
    const entry = makeEntry({
      medium: "SHOW",
      metadata: {
        style: "ANIME",
        seasons: [{}, {}],
        studio: "MAPPA",
        startDate: "2021-01-10",
      },
    });
    expect(buildAdaptationPreview(entry)).toBe("Anime · 2 seasons · MAPPA · 2021–present");
  });

  test("segments are joined with ' · ' and no blank segments appear", () => {
    const entry = makeEntry({ medium: "SHOW", metadata: { style: "ANIME", studio: "Ufotable" } });
    const result = buildAdaptationPreview(entry);
    expect(result).not.toMatch(/ · {2,}/);
    expect(result).not.toMatch(/^ · | · $/);
  });
});

describe("buildAdaptationPreview — Movie", () => {
  test("returns 'Movie' with no metadata", () => {
    const entry = makeEntry({ medium: "MOVIE", metadata: null as unknown as EntryMetadata });
    expect(buildAdaptationPreview(entry)).toBe("Movie");
  });

  test("includes studio when present", () => {
    const entry = makeEntry({ medium: "MOVIE", metadata: { studio: "Toei Animation" } });
    expect(buildAdaptationPreview(entry)).toContain("Toei Animation");
  });

  test("includes release year from releaseDate ISO string", () => {
    const entry = makeEntry({ medium: "MOVIE", metadata: { releaseDate: "2022-08-15" } });
    expect(buildAdaptationPreview(entry)).toContain("2022");
  });

  test("omits missing fields with no blank segments", () => {
    const entry = makeEntry({ medium: "MOVIE", metadata: {} });
    const result = buildAdaptationPreview(entry);
    expect(result).toBe("Movie");
    expect(result).not.toContain("undefined");
  });

  test("full movie preview: Movie · Toei Animation · 2022", () => {
    const entry = makeEntry({
      medium: "MOVIE",
      metadata: { studio: "Toei Animation", releaseDate: "2022-03-14" },
    });
    expect(buildAdaptationPreview(entry)).toBe("Movie · Toei Animation · 2022");
  });
});

describe("buildAdaptationPreview — Manga", () => {
  test("returns 'Manga' with no metadata", () => {
    const entry = makeEntry({ medium: "MANGA", metadata: null as unknown as EntryMetadata });
    expect(buildAdaptationPreview(entry)).toBe("Manga");
  });

  test("includes first publisher when publishers are present", () => {
    const entry = makeEntry({
      medium: "MANGA",
      metadata: { publishers: ["Kodansha", "Viz Media"] },
    });
    expect(buildAdaptationPreview(entry)).toContain("Kodansha");
    expect(buildAdaptationPreview(entry)).not.toContain("Viz Media");
  });

  test("includes volume count using singular 'vol.' when 1", () => {
    const entry = makeEntry({ medium: "MANGA", metadata: { volumeCount: 1 } });
    expect(buildAdaptationPreview(entry)).toContain("1 vol.");
  });

  test("includes volume count using plural 'vols.' when more than 1", () => {
    const entry = makeEntry({ medium: "MANGA", metadata: { volumeCount: 42 } });
    expect(buildAdaptationPreview(entry)).toContain("42 vols.");
  });

  test("omits volume segment when volumeCount is absent", () => {
    const entry = makeEntry({ medium: "MANGA", metadata: {} });
    expect(buildAdaptationPreview(entry)).not.toContain("vol");
  });

  test("full manga preview: Manga · Kodansha · 42 vols.", () => {
    const entry = makeEntry({
      medium: "MANGA",
      metadata: { publishers: ["Kodansha"], volumeCount: 42 },
    });
    expect(buildAdaptationPreview(entry)).toBe("Manga · Kodansha · 42 vols.");
  });
});
