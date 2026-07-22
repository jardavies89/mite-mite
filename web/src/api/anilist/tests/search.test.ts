import { searchMedia } from "../search";

const fakeResult: MangaSearchResult = {
  id: 1,
  title: { romaji: "Naruto", english: "Naruto", native: "ナルト" },
  format: "MANGA",
  staff: { edges: [] },
};

function mockFetch(body: unknown, _ok = true, status = 200) {
  vi.spyOn(global, "fetch").mockResolvedValueOnce(
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }),
  );
}

beforeEach(() => vi.restoreAllMocks());

describe("searchMedia", () => {
  test("returns the media array from a successful response", async () => {
    mockFetch({ data: { Page: { media: [fakeResult] } } });
    const results = await searchMedia("naruto");
    expect(results).toEqual([fakeResult]);
  });

  test("returns an empty array when the page has no results", async () => {
    mockFetch({ data: { Page: { media: [] } } });
    const results = await searchMedia("xyzzy");
    expect(results).toEqual([]);
  });

  test("sends the search term and type in the request body", async () => {
    const spy = vi
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: { Page: { media: [] } } }), { status: 200 }),
      );
    await searchMedia("berserk", "MANGA");
    const body = JSON.parse((spy.mock.calls[0][1] as RequestInit).body as string);
    expect(body.variables).toEqual({ search: "berserk", type: "MANGA" });
  });

  test("defaults type to MANGA when not specified", async () => {
    const spy = vi
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: { Page: { media: [] } } }), { status: 200 }),
      );
    await searchMedia("berserk");
    const body = JSON.parse((spy.mock.calls[0][1] as RequestInit).body as string);
    expect(body.variables.type).toBe("MANGA");
  });

  test("throws on a non-OK HTTP response", async () => {
    mockFetch({}, false, 500);
    await expect(searchMedia("naruto")).rejects.toThrow("AniList request failed: 500");
  });

  test("throws the first GraphQL error message when errors are present", async () => {
    mockFetch({ errors: [{ message: "rate limited" }, { message: "other" }], data: null });
    await expect(searchMedia("naruto")).rejects.toThrow("rate limited");
  });
});
