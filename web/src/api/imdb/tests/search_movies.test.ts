import { searchMovies } from "../search_movies";

const fakeResult: TmdbMovieSearchResult = {
  id: 238,
  title: "The Godfather",
  overview: "The aging patriarch of an organized crime dynasty.",
  poster_path: "/3bhkrj58Vtu7enYsLe1rjurvr2.jpg",
  release_date: "1972-03-14",
};

function mockFetch(body: unknown, ok = true, status = 200) {
  vi.spyOn(global, "fetch").mockResolvedValueOnce(
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }),
  );
}

beforeEach(() => vi.restoreAllMocks());

describe("searchMovies", () => {
  test("returns the results array from a successful response", async () => {
    mockFetch({ results: [fakeResult] });
    const results = await searchMovies("the godfather");
    expect(results).toEqual([fakeResult]);
  });

  test("returns an empty array when there are no results", async () => {
    mockFetch({ results: [] });
    const results = await searchMovies("xyzzy");
    expect(results).toEqual([]);
  });

  test("sends the query in the request URL", async () => {
    const spy = vi
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ results: [] }), { status: 200 }));
    await searchMovies("godfather");
    const url = spy.mock.calls[0][0] as string;
    expect(url).toContain("query=godfather");
  });

  test("throws on a non-OK HTTP response", async () => {
    mockFetch({}, false, 401);
    await expect(searchMovies("test")).rejects.toThrow("TMDB request failed: 401");
  });
});
