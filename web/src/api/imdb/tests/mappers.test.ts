import {
  mapTmdbDateToDisplay,
  mapTmdbShowToEntryDraft,
  mapTmdbMovieToEntryDraft,
} from "../mappers";
import { Medium } from "@/constants/types";

const baseShow: TmdbTvDetails = {
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

  test("uses homepage as referenceUrl when set", () => {
    const draft = mapTmdbShowToEntryDraft(baseShow);
    expect(draft.referenceUrl).toBe("http://www.amctv.com/shows/breaking-bad");
  });

  test("falls back to TMDB URL when homepage is empty", () => {
    const noHomepage = { ...baseShow, homepage: "" };
    const draft = mapTmdbShowToEntryDraft(noHomepage);
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

  test("falls back to TMDB URL when homepage is empty", () => {
    const draft = mapTmdbMovieToEntryDraft(baseMovie);
    expect(draft.referenceUrl).toBe("https://www.themoviedb.org/movie/238");
  });

  test("uses homepage as referenceUrl when set", () => {
    const withHomepage = { ...baseMovie, homepage: "https://godfather.com" };
    const draft = mapTmdbMovieToEntryDraft(withHomepage);
    expect(draft.referenceUrl).toBe("https://godfather.com");
  });
});
