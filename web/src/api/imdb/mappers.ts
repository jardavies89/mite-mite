import { Medium } from "@/constants/types";
import type { NewEntryFormState } from "@/components/admin/context/new_entry_context";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const TMDB_TV_BASE = "https://www.themoviedb.org/tv";
const TMDB_MOVIE_BASE = "https://www.themoviedb.org/movie";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const ENDED_STATUSES = new Set(["Ended", "Canceled"]);

function mapTmdbDateToDisplay(date: string | null): string | undefined {
  if (!date) return undefined;
  const [yearStr, monthStr] = date.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) return undefined;
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

function coverUrl(posterPath: string | null): string {
  return posterPath ? `${TMDB_IMAGE_BASE}${posterPath}` : "";
}

function mapTmdbShowToEntryDraft(details: TmdbTvDetails): Partial<NewEntryFormState> {
  const isAnimation = details.genres.some((g) => g.name === "Animation");
  const isEnded = details.status != null && ENDED_STATUSES.has(details.status);

  const metadata: ShowMetadata = {
    style: isAnimation ? "ANIME" : "LIVE_ACTION",
    studio: details.production_companies[0]?.name,
    startDate: mapTmdbDateToDisplay(details.first_air_date),
    endDate: isEnded ? mapTmdbDateToDisplay(details.last_air_date) : undefined,
  };

  return {
    primaryTitle: details.name,
    description: details.overview ?? "",
    coverImageUrl: coverUrl(details.poster_path),
    medium: Medium.Show,
    referenceUrl: details.homepage || `${TMDB_TV_BASE}/${details.id}`,
    metadata,
  };
}

function mapTmdbMovieToEntryDraft(details: TmdbMovieDetails): Partial<NewEntryFormState> {
  const runtime = details.runtime && details.runtime > 0 ? details.runtime : undefined;

  const metadata: MovieMetadata = {
    studio: details.production_companies[0]?.name,
    runtime,
    releaseDate: mapTmdbDateToDisplay(details.release_date),
  };

  return {
    primaryTitle: details.title,
    description: details.overview ?? "",
    coverImageUrl: coverUrl(details.poster_path),
    medium: Medium.Movie,
    referenceUrl: details.homepage || `${TMDB_MOVIE_BASE}/${details.id}`,
    metadata,
  };
}

export { mapTmdbDateToDisplay, mapTmdbShowToEntryDraft, mapTmdbMovieToEntryDraft };
