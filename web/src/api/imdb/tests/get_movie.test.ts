import { getMovie } from "../get_movie";

const fakeDetails: TmdbMovieDetails = {
  id: 238,
  title: "The Godfather",
  overview: "The aging patriarch of an organized crime dynasty.",
  poster_path: "/3bhkrj58Vtu7enYsLe1rjurvr2.jpg",
  release_date: "1972-03-14",
  runtime: 175,
  genres: [{ id: 18, name: "Drama" }],
  production_companies: [{ id: 4, name: "Paramount Pictures", logo_path: null }],
  homepage: "",
};

function mockFetch(body: unknown, status = 200) {
  vi.spyOn(global, "fetch").mockResolvedValueOnce(
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }),
  );
}

beforeEach(() => vi.restoreAllMocks());

describe("getMovie", () => {
  test("returns the movie details from a successful response", async () => {
    mockFetch(fakeDetails);
    const result = await getMovie(238);
    expect(result).toEqual(fakeDetails);
  });

  test("includes the movie id in the request URL", async () => {
    const spy = vi
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify(fakeDetails), { status: 200 }));
    await getMovie(238);
    const url = spy.mock.calls[0][0] as string;
    expect(url).toContain("/movie/238");
  });

  test("throws on a non-OK HTTP response", async () => {
    mockFetch({}, false, 404);
    await expect(getMovie(99999)).rejects.toThrow("TMDB request failed: 404");
  });
});
