import { renderHook, act } from "@testing-library/react";

import { useTmdbMovieSearch } from "../use_tmdb_movie_search";
import { searchMovies } from "@/api/imdb";

vi.mock("@/api/imdb", () => ({
  searchShows: vi.fn(),
  getShow: vi.fn(),
  searchMovies: vi.fn(),
  getMovie: vi.fn(),
  mapTmdbShowToEntryDraft: vi.fn(),
  mapTmdbMovieToEntryDraft: vi.fn(),
}));

const mockSearchMovies = searchMovies as ReturnType<typeof vi.fn>;

const fakeResult: TmdbMovieSearchResult = {
  id: 238,
  title: "The Godfather",
  overview: "The aging patriarch of an organized crime dynasty.",
  poster_path: "/3bhkrj58Vtu7enYsLe1rjurvr2.jpg",
  release_date: "1972-03-14",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useTmdbMovieSearch", () => {
  test("starts with empty results, not loading, no error", () => {
    const { result } = renderHook(() => useTmdbMovieSearch(""));
    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test("does not trigger a search for a query shorter than 2 chars", async () => {
    renderHook(() => useTmdbMovieSearch("a"));
    await act(async () => {
      vi.advanceTimersByTime(400);
    });
    expect(mockSearchMovies).not.toHaveBeenCalled();
  });

  test("triggers search after debounce for a valid query", async () => {
    mockSearchMovies.mockResolvedValue([fakeResult]);
    const { result } = renderHook(() => useTmdbMovieSearch("godfather"));

    await act(async () => {
      vi.advanceTimersByTime(400);
    });

    expect(mockSearchMovies).toHaveBeenCalledWith("godfather");
    expect(result.current.results).toEqual([fakeResult]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test("sets error and clears results on API rejection", async () => {
    mockSearchMovies.mockRejectedValue(new Error("network error"));
    const { result } = renderHook(() => useTmdbMovieSearch("godfather"));

    await act(async () => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current.error).toBe("search_error");
    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  test("cancels previous debounce when query changes before timeout", async () => {
    mockSearchMovies.mockResolvedValue([fakeResult]);
    const { rerender } = renderHook(({ q }) => useTmdbMovieSearch(q), {
      initialProps: { q: "godf" },
    });

    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    rerender({ q: "godfather" });

    await act(async () => {
      vi.advanceTimersByTime(400);
    });

    expect(mockSearchMovies).toHaveBeenCalledTimes(1);
    expect(mockSearchMovies).toHaveBeenCalledWith("godfather");
  });
});
