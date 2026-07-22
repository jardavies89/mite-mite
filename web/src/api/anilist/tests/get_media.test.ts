import { getMedia } from "../get_media";

const fakeMedia: AnilistMediaDetails = {
  id: 42,
  title: { romaji: "Berserk", english: "Berserk", native: "ベルセルク" },
  synonyms: [],
  description: "Dark fantasy.",
  format: "MANGA",
  status: "RELEASING",
  chapters: null,
  volumes: null,
  averageScore: 95,
  meanScore: 95,
  popularity: 500000,
  favourites: 200000,
  coverImage: { extraLarge: null, large: null, color: null },
  bannerImage: null,
  genres: ["Action"],
  tags: [],
  staff: { edges: [] },
  externalLinks: [],
  siteUrl: "https://anilist.co/manga/42",
  source: "MANGA",
  countryOfOrigin: "JP",
};

function mockFetch(body: unknown, _ok = true, status = 200) {
  vi.spyOn(global, "fetch").mockResolvedValueOnce(
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }),
  );
}

beforeEach(() => vi.restoreAllMocks());

describe("getMedia", () => {
  test("returns the Media object from a successful response", async () => {
    mockFetch({ data: { Media: fakeMedia } });
    const result = await getMedia(42);
    expect(result).toEqual(fakeMedia);
  });

  test("sends the id in the request body variables", async () => {
    const spy = vi
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: { Media: fakeMedia } }), { status: 200 }),
      );
    await getMedia(42);
    const body = JSON.parse((spy.mock.calls[0][1] as RequestInit).body as string);
    expect(body.variables).toEqual({ id: 42 });
  });

  test("throws on a non-OK HTTP response", async () => {
    mockFetch({}, false, 429);
    await expect(getMedia(1)).rejects.toThrow("AniList request failed: 429");
  });

  test("throws the first GraphQL error message when errors are present", async () => {
    mockFetch({ errors: [{ message: "not found" }], data: null });
    await expect(getMedia(99999)).rejects.toThrow("not found");
  });
});
