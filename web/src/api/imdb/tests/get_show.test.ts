import { getShow } from "../get_show";

const fakeDetails: TmdbTvDetails = {
  id: 1396,
  name: "Breaking Bad",
  overview: "A chemistry teacher turns to crime.",
  poster_path: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
  first_air_date: "2008-01-20",
  last_air_date: "2013-09-29",
  status: "Ended",
  genres: [{ id: 18, name: "Drama" }],
  production_companies: [{ id: 2575, name: "Sony Pictures Television", logo_path: null }],
  homepage: "http://www.amctv.com/shows/breaking-bad",
};

function mockFetch(body: unknown, ok = true, status = 200) {
  vi.spyOn(global, "fetch").mockResolvedValueOnce(
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }),
  );
}

beforeEach(() => vi.restoreAllMocks());

describe("getShow", () => {
  test("returns the show details from a successful response", async () => {
    mockFetch(fakeDetails);
    const result = await getShow(1396);
    expect(result).toEqual(fakeDetails);
  });

  test("includes the show id in the request URL", async () => {
    const spy = vi
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify(fakeDetails), { status: 200 }));
    await getShow(1396);
    const url = spy.mock.calls[0][0] as string;
    expect(url).toContain("/tv/1396");
  });

  test("throws on a non-OK HTTP response", async () => {
    mockFetch({}, false, 404);
    await expect(getShow(99999)).rejects.toThrow("TMDB request failed: 404");
  });
});
