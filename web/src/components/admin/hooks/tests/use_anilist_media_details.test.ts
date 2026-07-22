import { renderHook, act } from "@testing-library/react";

import { useAnilistMediaDetails } from "../use_anilist_media_details";
import { getMedia } from "@/api/anilist";

vi.mock("@/api/anilist", () => ({
  searchMedia: vi.fn(),
  getMedia: vi.fn(),
}));

const mockGetMedia = getMedia as ReturnType<typeof vi.fn>;

const fakeDetails: AnilistMediaDetails = {
  id: 42,
  title: { romaji: "Berserk", english: "Berserk", native: "ベルセルク" },
  synonyms: [],
  description: "Dark fantasy manga.",
  format: "MANGA",
  status: "RELEASING",
  chapters: null,
  volumes: null,
  averageScore: 95,
  meanScore: 95,
  popularity: 500000,
  favourites: 200000,
  coverImage: { extraLarge: null, large: null, color: null },
  bannerImage: null,
  genres: ["Action", "Fantasy"],
  tags: [],
  staff: { edges: [] },
  externalLinks: [],
  siteUrl: "https://anilist.co/manga/42",
  source: "MANGA",
  countryOfOrigin: "JP",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useAnilistMediaDetails", () => {
  test("starts with null data, not loading, no error", () => {
    const { result } = renderHook(() => useAnilistMediaDetails());
    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test("sets isLoading true during fetch, then resolves with data", async () => {
    mockGetMedia.mockResolvedValue(fakeDetails);
    const { result } = renderHook(() => useAnilistMediaDetails());

    await act(async () => {
      await result.current.getMediaDetails(42);
    });

    expect(result.current.data).toEqual(fakeDetails);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test("returns the data from getMediaDetails call", async () => {
    mockGetMedia.mockResolvedValue(fakeDetails);
    const { result } = renderHook(() => useAnilistMediaDetails());

    let returned: AnilistMediaDetails | null = null;
    await act(async () => {
      returned = await result.current.getMediaDetails(42);
    });

    expect(returned).toEqual(fakeDetails);
  });

  test("sets error and returns null on rejection", async () => {
    mockGetMedia.mockRejectedValue(new Error("API error"));
    const { result } = renderHook(() => useAnilistMediaDetails());

    let returned: AnilistMediaDetails | null = null;
    await act(async () => {
      returned = await result.current.getMediaDetails(1);
    });

    expect(result.current.error).toBe("fetch_error");
    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(returned).toBeNull();
  });

  test("passes the id to the underlying API call", async () => {
    mockGetMedia.mockResolvedValue(fakeDetails);
    const { result } = renderHook(() => useAnilistMediaDetails());

    await act(async () => {
      await result.current.getMediaDetails(99);
    });

    expect(mockGetMedia).toHaveBeenCalledWith(99);
  });
});
