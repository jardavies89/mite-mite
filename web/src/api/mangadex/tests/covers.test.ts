import { getCovers } from "../covers";

function makeCoverData(id: string, fileName: string, volume: string | null, locale: string | null) {
  return {
    id,
    attributes: { volume, fileName, locale },
    relationships: [{ id: "manga-id", type: "manga" }],
  };
}

function mockFetch(body: unknown, _ok = true, status = 200) {
  vi.spyOn(global, "fetch").mockResolvedValueOnce(
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }),
  );
}

beforeEach(() => {
  vi.restoreAllMocks();
  vi.stubEnv("VITE_API_URL", "http://localhost:4100");
});

afterEach(() => vi.unstubAllEnvs());

describe("getCovers", () => {
  test("returns a mapped cover with url and thumbUrl", async () => {
    mockFetch({ data: [makeCoverData("cov-1", "cover.jpg", "1", "en")] });
    const results = await getCovers("manga-abc");

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      id: "cov-1",
      volume: "1",
      locale: "en",
    });
    expect(results[0].url).toContain("cover.jpg");
    expect(results[0].thumbUrl).toContain("cover.jpg.512.jpg");
  });

  test("uses the direct mangadex upload URL in non-prod environment", async () => {
    // PROD defaults to false in the test environment, so MANGADEX_UPLOADS resolves
    // to uploads.mangadex.org at module load time (not proxied through our API).
    mockFetch({ data: [makeCoverData("cov-1", "cover.jpg", null, null)] });
    const results = await getCovers("manga-abc");
    expect(results[0].url).toContain("uploads.mangadex.org");
  });

  test("returns an empty array when data is empty", async () => {
    mockFetch({ data: [] });
    const results = await getCovers("manga-abc");
    expect(results).toEqual([]);
  });

  test("includes the manga id and correct params in the request URL", async () => {
    const spy = vi
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: [] }), { status: 200 }));
    await getCovers("manga-abc");
    const url = spy.mock.calls[0][0] as string;
    expect(url).toContain("manga%5B%5D=manga-abc");
    expect(url).toContain("limit=100");
  });

  test("preserves null volume and locale from the response", async () => {
    mockFetch({ data: [makeCoverData("cov-2", "cover2.jpg", null, null)] });
    const results = await getCovers("manga-abc");
    expect(results[0].volume).toBeNull();
    expect(results[0].locale).toBeNull();
  });

  test("throws on a non-OK HTTP response", async () => {
    mockFetch({}, false, 404);
    await expect(getCovers("manga-abc")).rejects.toThrow("MangaDex request failed: 404");
  });
});
