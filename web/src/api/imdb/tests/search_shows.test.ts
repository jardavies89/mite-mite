import { searchShows } from "../search_shows";

const fakeResult: TmdbTvSearchResult = {
  id: 1396,
  name: "Breaking Bad",
  overview: "A chemistry teacher turns to crime.",
  poster_path: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
  first_air_date: "2008-01-20",
  genre_ids: [18, 80],
  origin_country: ["US"],
};

function mockFetch(body: unknown, status = 200) {
  vi.spyOn(global, "fetch").mockResolvedValueOnce(
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }),
  );
}

beforeEach(() => vi.restoreAllMocks());

describe("searchShows", () => {
  test("returns the results array from a successful response", async () => {
    mockFetch({ results: [fakeResult] });
    const results = await searchShows("breaking bad");
    expect(results).toEqual([fakeResult]);
  });

  test("returns an empty array when there are no results", async () => {
    mockFetch({ results: [] });
    const results = await searchShows("xyzzy");
    expect(results).toEqual([]);
  });

  test("sends the query in the request URL", async () => {
    const spy = vi
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ results: [] }), { status: 200 }));
    await searchShows("the bear");
    const url = spy.mock.calls[0][0] as string;
    expect(url).toContain("query=the+bear");
  });

  test("throws on a non-OK HTTP response", async () => {
    mockFetch({}, false, 401);
    await expect(searchShows("test")).rejects.toThrow("TMDB request failed: 401");
  });
});
