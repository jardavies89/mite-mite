import { renderHook, act } from "@testing-library/react";

import { useAnilistSearch } from "../use_anilist_search";
import { searchMedia } from "@/api/anilist";

vi.mock("@/api/anilist", () => ({
  searchMedia: vi.fn(),
  getMedia: vi.fn(),
}));

const mockSearchMedia = searchMedia as ReturnType<typeof vi.fn>;

const fakeResult: MangaSearchResult = {
  id: 1,
  title: { romaji: "Naruto", english: "Naruto", native: "ナルト" },
  format: "MANGA",
  staff: { edges: [] },
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useAnilistSearch", () => {
  test("starts with empty results, not loading, no error", () => {
    const { result } = renderHook(() => useAnilistSearch(""));
    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test("does not trigger a search for a query shorter than 2 chars", async () => {
    renderHook(() => useAnilistSearch("a"));
    await act(async () => {
      vi.advanceTimersByTime(400);
    });
    expect(mockSearchMedia).not.toHaveBeenCalled();
  });

  test("triggers search after debounce for a valid query", async () => {
    mockSearchMedia.mockResolvedValue([fakeResult]);
    const { result } = renderHook(() => useAnilistSearch("naruto"));

    await act(async () => {
      vi.advanceTimersByTime(400);
    });

    expect(mockSearchMedia).toHaveBeenCalledWith("naruto");
    expect(result.current.results).toEqual([fakeResult]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test("sets error and clears results on API rejection", async () => {
    mockSearchMedia.mockRejectedValue(new Error("network error"));
    const { result } = renderHook(() => useAnilistSearch("naruto"));

    await act(async () => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current.error).toBe("search_error");
    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  test("cancels previous debounce when query changes before timeout", async () => {
    mockSearchMedia.mockResolvedValue([fakeResult]);
    const { rerender } = renderHook(({ q }) => useAnilistSearch(q), {
      initialProps: { q: "naru" },
    });

    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    rerender({ q: "naruto" });

    await act(async () => {
      vi.advanceTimersByTime(400);
    });

    expect(mockSearchMedia).toHaveBeenCalledTimes(1);
    expect(mockSearchMedia).toHaveBeenCalledWith("naruto");
  });
});
