import { Genres, Medium, Status } from "@/constants/types";
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

// TMDB genre names that don't directly match our Genres enum values by name
const TMDB_GENRE_MAP: Partial<Record<string, Genres[]>> = {
  "science fiction": [Genres.SciFi],
  "sci-fi & fantasy": [Genres.SciFi, Genres.Fantasy],
  "action & adventure": [Genres.Action, Genres.Adventure],
  history: [Genres.Historical],
};

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

function mapTmdbGenres(genres: Array<{ id: number; name: string }>): Genres[] {
  const validGenres = Object.values(Genres);
  const result: Genres[] = [];
  for (const g of genres) {
    const lower = g.name.toLowerCase();
    const mapped = TMDB_GENRE_MAP[lower];
    if (mapped) {
      result.push(...mapped);
    } else {
      const match = validGenres.find((v) => v.toLowerCase() === lower);
      if (match) result.push(match);
    }
  }
  return result;
}

function mapTmdbStatus(status: string | null): Status {
  if (status === "Ended" || status === "Canceled") return Status.Completed;
  return Status.Ongoing;
}

function mapTmdbShowToEntryDraft(details: TmdbTvDetails): Partial<NewEntryFormState> {
  const isAnimation = details.genres.some((g) => g.name === "Animation");
  const isEnded = details.status != null && ENDED_STATUSES.has(details.status);

  const seasons = details.seasons
    .filter((s) => s.season_number > 0)
    .map((s) => ({
      episodeCount: s.episode_count,
      startDate: mapTmdbDateToDisplay(s.air_date),
    }));

  const metadata: ShowMetadata = {
    style: isAnimation ? "ANIME" : "LIVE_ACTION",
    studio: details.production_companies[0]?.name,
    startDate: mapTmdbDateToDisplay(details.first_air_date),
    endDate: isEnded ? mapTmdbDateToDisplay(details.last_air_date) : undefined,
    seasons: seasons.length > 0 ? seasons : undefined,
  };

  const alternateTitles = details.original_name !== details.name ? [details.original_name] : [];

  return {
    primaryTitle: details.name,
    description: details.overview ?? "",
    coverImageUrl: coverUrl(details.poster_path),
    medium: Medium.Show,
    referenceUrl: `${TMDB_TV_BASE}/${details.id}`,
    genres: mapTmdbGenres(details.genres),
    status: mapTmdbStatus(details.status),
    alternateTitles,
    metadata,
    tmdbId: details.id,
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
    referenceUrl: `${TMDB_MOVIE_BASE}/${details.id}`,
    metadata,
    tmdbId: details.id,
  };
}

export { mapTmdbDateToDisplay, mapTmdbShowToEntryDraft, mapTmdbMovieToEntryDraft };
