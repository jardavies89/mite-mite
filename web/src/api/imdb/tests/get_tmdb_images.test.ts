import { getTmdbImages } from "../get_tmdb_images";

const fakePosters: TmdbPosterImage[] = [
  { file_path: "/abc.jpg", iso_639_1: "en" },
  { file_path: "/def.jpg", iso_639_1: null },
];

function mockFetch(body: unknown, status = 200) {
  vi.spyOn(global, "fetch").mockResolvedValueOnce(
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }),
  );
}

beforeEach(() => vi.restoreAllMocks());

describe("getTmdbImages", () => {
  test("returns posters for a tv show", async () => {
    mockFetch({ id: 1396, posters: fakePosters });
    const result = await getTmdbImages(1396, "tv");
    expect(result).toEqual(fakePosters);
  });

  test("returns posters for a movie", async () => {
    mockFetch({ id: 238, posters: fakePosters });
    const result = await getTmdbImages(238, "movie");
    expect(result).toEqual(fakePosters);
  });

  test("includes the correct path segment for tv", async () => {
    const spy = vi
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: 1, posters: [] }), { status: 200 }));
    await getTmdbImages(1396, "tv");
    expect(spy.mock.calls[0][0] as string).toContain("/tv/1396/images");
  });

  test("includes the correct path segment for movie", async () => {
    const spy = vi
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: 1, posters: [] }), { status: 200 }));
    await getTmdbImages(238, "movie");
    expect(spy.mock.calls[0][0] as string).toContain("/movie/238/images");
  });

  test("returns empty array when posters is empty", async () => {
    mockFetch({ id: 1, posters: [] });
    const result = await getTmdbImages(1, "tv");
    expect(result).toEqual([]);
  });

  test("throws on a non-OK HTTP response", async () => {
    mockFetch({}, 404);
    await expect(getTmdbImages(1, "tv")).rejects.toThrow("TMDB request failed: 404");
  });
});
