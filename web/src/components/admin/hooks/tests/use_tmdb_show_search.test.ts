import { renderHook, act } from "@testing-library/react";

import { useTmdbShowSearch } from "../use_tmdb_show_search";
import { searchShows } from "@/api/imdb";

vi.mock("@/api/imdb", () => ({
  searchShows: vi.fn(),
  getShow: vi.fn(),
  searchMovies: vi.fn(),
  getMovie: vi.fn(),
  mapTmdbShowToEntryDraft: vi.fn(),
  mapTmdbMovieToEntryDraft: vi.fn(),
}));

const mockSearchShows = searchShows as ReturnType<typeof vi.fn>;

const fakeResult: TmdbTvSearchResult = {
  id: 1396,
  name: "Breaking Bad",
  overview: "A chemistry teacher turns to crime.",
  poster_path: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
  first_air_date: "2008-01-20",
  genre_ids: [18, 80],
  origin_country: ["US"],
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useTmdbShowSearch", () => {
  test("starts with empty results, not loading, no error", () => {
    const { result } = renderHook(() => useTmdbShowSearch(""));
    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test("does not trigger a search for a query shorter than 2 chars", async () => {
    renderHook(() => useTmdbShowSearch("a"));
    await act(async () => {
      vi.advanceTimersByTime(400);
    });
    expect(mockSearchShows).not.toHaveBeenCalled();
  });

  test("triggers search after debounce for a valid query", async () => {
    mockSearchShows.mockResolvedValue([fakeResult]);
    const { result } = renderHook(() => useTmdbShowSearch("breaking bad"));

    await act(async () => {
      vi.advanceTimersByTime(400);
    });

    expect(mockSearchShows).toHaveBeenCalledWith("breaking bad");
    expect(result.current.results).toEqual([fakeResult]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test("sets error and clears results on API rejection", async () => {
    mockSearchShows.mockRejectedValue(new Error("network error"));
    const { result } = renderHook(() => useTmdbShowSearch("breaking bad"));

    await act(async () => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current.error).toBe("search_error");
    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  test("cancels previous debounce when query changes before timeout", async () => {
    mockSearchShows.mockResolvedValue([fakeResult]);
    const { rerender } = renderHook(({ q }) => useTmdbShowSearch(q), {
      initialProps: { q: "break" },
    });

    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    rerender({ q: "breaking bad" });

    await act(async () => {
      vi.advanceTimersByTime(400);
    });

    expect(mockSearchShows).toHaveBeenCalledTimes(1);
    expect(mockSearchShows).toHaveBeenCalledWith("breaking bad");
  });
});
