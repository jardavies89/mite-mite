import {
  mapTmdbDateToDisplay,
  mapTmdbShowToEntryDraft,
  mapTmdbMovieToEntryDraft,
} from "../mappers";
import { Genres, Medium, Status } from "@/constants/types";

const baseShow: TmdbTvDetails = {
  id: 1396,
  name: "Breaking Bad",
  original_name: "Breaking Bad",
  overview: "A chemistry teacher turns to crime.",
  poster_path: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
  first_air_date: "2008-01-20",
  last_air_date: "2013-09-29",
  status: "Ended",
  genres: [{ id: 18, name: "Drama" }],
  production_companies: [{ id: 2575, name: "Sony Pictures Television", logo_path: null }],
  homepage: "http://www.amctv.com/shows/breaking-bad",
  seasons: [
    { season_number: 1, episode_count: 7, air_date: "2008-01-20" },
    { season_number: 2, episode_count: 13, air_date: "2009-03-08" },
  ],
};

const baseMovie: TmdbMovieDetails = {
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

describe("mapTmdbDateToDisplay", () => {
  test("converts a full YYYY-MM-DD date to Month YYYY", () => {
    expect(mapTmdbDateToDisplay("2008-01-20")).toBe("January 2008");
  });

  test("handles December correctly", () => {
    expect(mapTmdbDateToDisplay("2013-12-01")).toBe("December 2013");
  });

  test("returns undefined for null", () => {
    expect(mapTmdbDateToDisplay(null)).toBeUndefined();
  });

  test("returns undefined for an empty string", () => {
    expect(mapTmdbDateToDisplay("")).toBeUndefined();
  });

  test("returns undefined for a malformed date", () => {
    expect(mapTmdbDateToDisplay("not-a-date")).toBeUndefined();
  });
});

describe("mapTmdbShowToEntryDraft", () => {
  test("maps core fields from a full payload", () => {
    const draft = mapTmdbShowToEntryDraft(baseShow);
    expect(draft.primaryTitle).toBe("Breaking Bad");
    expect(draft.description).toBe("A chemistry teacher turns to crime.");
    expect(draft.coverImageUrl).toBe(
      "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    );
    expect(draft.medium).toBe(Medium.Show);
  });

  test("maps studio from the first production company", () => {
    const draft = mapTmdbShowToEntryDraft(baseShow);
    expect((draft.metadata as ShowMetadata).studio).toBe("Sony Pictures Television");
  });

  test("maps startDate when first_air_date is set", () => {
    const draft = mapTmdbShowToEntryDraft(baseShow);
    expect((draft.metadata as ShowMetadata).startDate).toBe("January 2008");
  });

  test("maps endDate only when status is Ended", () => {
    const draft = mapTmdbShowToEntryDraft(baseShow);
    expect((draft.metadata as ShowMetadata).endDate).toBe("September 2013");
  });

  test("omits endDate when status is not Ended or Canceled", () => {
    const ongoingShow = { ...baseShow, status: "Returning Series", last_air_date: "2024-01-01" };
    const draft = mapTmdbShowToEntryDraft(ongoingShow);
    expect((draft.metadata as ShowMetadata).endDate).toBeUndefined();
  });

  test("sets style to ANIME when genres include Animation", () => {
    const animeShow = {
      ...baseShow,
      genres: [
        { id: 16, name: "Animation" },
        { id: 18, name: "Drama" },
      ],
    };
    const draft = mapTmdbShowToEntryDraft(animeShow);
    expect((draft.metadata as ShowMetadata).style).toBe("ANIME");
  });

  test("defaults style to LIVE_ACTION for non-animation genres", () => {
    const draft = mapTmdbShowToEntryDraft(baseShow);
    expect((draft.metadata as ShowMetadata).style).toBe("LIVE_ACTION");
  });

  test("always uses the TMDB URL as referenceUrl", () => {
    const draft = mapTmdbShowToEntryDraft(baseShow);
    expect(draft.referenceUrl).toBe("https://www.themoviedb.org/tv/1396");
  });

  test("handles null poster_path with empty coverImageUrl", () => {
    const noPoster = { ...baseShow, poster_path: null };
    const draft = mapTmdbShowToEntryDraft(noPoster);
    expect(draft.coverImageUrl).toBe("");
  });

  test("handles empty production_companies with undefined studio", () => {
    const noCompanies = { ...baseShow, production_companies: [] };
    const draft = mapTmdbShowToEntryDraft(noCompanies);
    expect((draft.metadata as ShowMetadata).studio).toBeUndefined();
  });

  test("maps status Ended to Completed", () => {
    const draft = mapTmdbShowToEntryDraft(baseShow);
    expect(draft.status).toBe(Status.Completed);
  });

  test("maps status Canceled to Completed", () => {
    const canceled = { ...baseShow, status: "Canceled" };
    const draft = mapTmdbShowToEntryDraft(canceled);
    expect(draft.status).toBe(Status.Completed);
  });

  test("maps status Returning Series to Ongoing", () => {
    const ongoing = { ...baseShow, status: "Returning Series" };
    const draft = mapTmdbShowToEntryDraft(ongoing);
    expect(draft.status).toBe(Status.Ongoing);
  });

  test("maps null status to Ongoing", () => {
    const unknownStatus = { ...baseShow, status: null };
    const draft = mapTmdbShowToEntryDraft(unknownStatus);
    expect(draft.status).toBe(Status.Ongoing);
  });

  test("maps genre names that directly match our enum", () => {
    const show = {
      ...baseShow,
      genres: [
        { id: 18, name: "Drama" },
        { id: 80, name: "Crime" },
      ],
    };
    const draft = mapTmdbShowToEntryDraft(show);
    expect(draft.genres).toEqual([Genres.Drama, Genres.Crime]);
  });

  test("maps compound genre Sci-Fi & Fantasy to SciFi and Fantasy", () => {
    const show = { ...baseShow, genres: [{ id: 10765, name: "Sci-Fi & Fantasy" }] };
    const draft = mapTmdbShowToEntryDraft(show);
    expect(draft.genres).toEqual([Genres.SciFi, Genres.Fantasy]);
  });

  test("maps Science Fiction (movie naming) to SciFi", () => {
    const show = { ...baseShow, genres: [{ id: 878, name: "Science Fiction" }] };
    const draft = mapTmdbShowToEntryDraft(show);
    expect(draft.genres).toEqual([Genres.SciFi]);
  });

  test("maps History to Historical", () => {
    const show = { ...baseShow, genres: [{ id: 36, name: "History" }] };
    const draft = mapTmdbShowToEntryDraft(show);
    expect(draft.genres).toEqual([Genres.Historical]);
  });

  test("skips genres with no match in our enum", () => {
    const show = { ...baseShow, genres: [{ id: 10764, name: "Reality" }] };
    const draft = mapTmdbShowToEntryDraft(show);
    expect(draft.genres).toEqual([]);
  });

  test("adds original_name as alternate title when it differs from name", () => {
    const foreignShow = { ...baseShow, name: "Squid Game", original_name: "오징어 게임" };
    const draft = mapTmdbShowToEntryDraft(foreignShow);
    expect(draft.alternateTitles).toEqual(["오징어 게임"]);
  });

  test("omits alternate titles when original_name matches name", () => {
    const draft = mapTmdbShowToEntryDraft(baseShow);
    expect(draft.alternateTitles).toEqual([]);
  });

  test("maps seasons skipping season 0 (specials)", () => {
    const withSpecials = {
      ...baseShow,
      seasons: [
        { season_number: 0, episode_count: 3, air_date: "2008-01-01" },
        { season_number: 1, episode_count: 7, air_date: "2008-01-20" },
        { season_number: 2, episode_count: 13, air_date: "2009-03-08" },
      ],
    };
    const draft = mapTmdbShowToEntryDraft(withSpecials);
    expect((draft.metadata as ShowMetadata).seasons).toHaveLength(2);
    expect((draft.metadata as ShowMetadata).seasons?.[0].episodeCount).toBe(7);
  });

  test("maps season episode count and start date", () => {
    const draft = mapTmdbShowToEntryDraft(baseShow);
    const seasons = (draft.metadata as ShowMetadata).seasons;
    expect(seasons?.[0]).toEqual({ episodeCount: 7, startDate: "January 2008" });
    expect(seasons?.[1]).toEqual({ episodeCount: 13, startDate: "March 2009" });
  });

  test("omits seasons from metadata when seasons array is empty", () => {
    const noSeasons = { ...baseShow, seasons: [] };
    const draft = mapTmdbShowToEntryDraft(noSeasons);
    expect((draft.metadata as ShowMetadata).seasons).toBeUndefined();
  });
});

describe("mapTmdbMovieToEntryDraft", () => {
  test("maps core fields from a full payload", () => {
    const draft = mapTmdbMovieToEntryDraft(baseMovie);
    expect(draft.primaryTitle).toBe("The Godfather");
    expect(draft.description).toBe("The aging patriarch of an organized crime dynasty.");
    expect(draft.coverImageUrl).toBe(
      "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsLe1rjurvr2.jpg",
    );
    expect(draft.medium).toBe(Medium.Movie);
  });

  test("maps studio from the first production company", () => {
    const draft = mapTmdbMovieToEntryDraft(baseMovie);
    expect((draft.metadata as MovieMetadata).studio).toBe("Paramount Pictures");
  });

  test("maps runtime in minutes", () => {
    const draft = mapTmdbMovieToEntryDraft(baseMovie);
    expect((draft.metadata as MovieMetadata).runtime).toBe(175);
  });

  test("treats runtime of 0 as unset", () => {
    const noRuntime = { ...baseMovie, runtime: 0 };
    const draft = mapTmdbMovieToEntryDraft(noRuntime);
    expect((draft.metadata as MovieMetadata).runtime).toBeUndefined();
  });

  test("treats null runtime as unset", () => {
    const noRuntime = { ...baseMovie, runtime: null };
    const draft = mapTmdbMovieToEntryDraft(noRuntime);
    expect((draft.metadata as MovieMetadata).runtime).toBeUndefined();
  });

  test("maps releaseDate to display format", () => {
    const draft = mapTmdbMovieToEntryDraft(baseMovie);
    expect((draft.metadata as MovieMetadata).releaseDate).toBe("March 1972");
  });

  test("always uses the TMDB URL as referenceUrl", () => {
    const draft = mapTmdbMovieToEntryDraft(baseMovie);
    expect(draft.referenceUrl).toBe("https://www.themoviedb.org/movie/238");
  });
});
