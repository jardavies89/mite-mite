import { searchManga, searchMangaCandidates } from "../search";

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

describe("searchManga", () => {
  test("returns id and English title when 'en' key is present", async () => {
    mockFetch({
      data: [{ id: "abc-123", attributes: { title: { en: "Berserk", ja: "ベルセルク" } } }],
    });
    const result = await searchManga("Berserk");
    expect(result).toEqual({ id: "abc-123", title: "Berserk" });
  });

  test("falls back to first available title when 'en' key is absent", async () => {
    mockFetch({
      data: [{ id: "abc-123", attributes: { title: { ja: "ベルセルク" } } }],
    });
    const result = await searchManga("Berserk");
    expect(result).toEqual({ id: "abc-123", title: "ベルセルク" });
  });

  test("falls back to 'Unknown' when title object is empty", async () => {
    mockFetch({
      data: [{ id: "abc-123", attributes: { title: {} } }],
    });
    const result = await searchManga("???");
    expect(result).toEqual({ id: "abc-123", title: "Unknown" });
  });

  test("returns null when no results are found", async () => {
    mockFetch({ data: [] });
    const result = await searchManga("xyzzy");
    expect(result).toBeNull();
  });

  test("includes the title and limit in the request URL", async () => {
    const spy = vi
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: [] }), { status: 200 }));
    await searchManga("Berserk");
    const url = spy.mock.calls[0][0] as string;
    expect(url).toContain("title=Berserk");
    expect(url).toContain("limit=1");
  });

  test("throws on a non-OK HTTP response", async () => {
    mockFetch({}, false, 503);
    await expect(searchManga("Berserk")).rejects.toThrow("MangaDex search failed: 503");
  });
});

describe("searchMangaCandidates", () => {
  test("returns an array of results with id and English title", async () => {
    mockFetch({
      data: [
        { id: "abc-123", attributes: { title: { en: "Berserk", ja: "ベルセルク" } } },
        { id: "def-456", attributes: { title: { en: "Berserk: The Prototype" } } },
      ],
    });
    const result = await searchMangaCandidates("Berserk");
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ id: "abc-123", title: "Berserk" });
    expect(result[1]).toEqual({ id: "def-456", title: "Berserk: The Prototype" });
  });

  test("falls back to first available title when 'en' key is absent", async () => {
    mockFetch({
      data: [{ id: "abc-123", attributes: { title: { ja: "ベルセルク" } } }],
    });
    const result = await searchMangaCandidates("Berserk");
    expect(result[0]).toEqual({ id: "abc-123", title: "ベルセルク" });
  });

  test("returns an empty array when no results are found", async () => {
    mockFetch({ data: [] });
    const result = await searchMangaCandidates("xyzzy");
    expect(result).toEqual([]);
  });

  test("passes title and limit=5 in the request URL by default", async () => {
    const spy = vi
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: [] }), { status: 200 }));
    await searchMangaCandidates("Berserk");
    const url = spy.mock.calls[0][0] as string;
    expect(url).toContain("title=Berserk");
    expect(url).toContain("limit=5");
  });

  test("respects a custom limit parameter", async () => {
    const spy = vi
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: [] }), { status: 200 }));
    await searchMangaCandidates("Berserk", 10);
    const url = spy.mock.calls[0][0] as string;
    expect(url).toContain("limit=10");
  });

  test("throws on a non-OK HTTP response", async () => {
    mockFetch({}, false, 503);
    await expect(searchMangaCandidates("Berserk")).rejects.toThrow("MangaDex search failed: 503");
  });
});
