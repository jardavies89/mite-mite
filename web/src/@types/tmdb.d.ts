type TmdbTvSearchResult = {
  id: number;
  name: string;
  overview: string | null;
  poster_path: string | null;
  first_air_date: string | null;
  genre_ids: number[];
  origin_country: string[];
};

type TmdbTvDetails = {
  id: number;
  name: string;
  overview: string | null;
  poster_path: string | null;
  first_air_date: string | null;
  last_air_date: string | null;
  status: string | null;
  genres: Array<{ id: number; name: string }>;
  production_companies: Array<{ id: number; name: string; logo_path: string | null }>;
  homepage: string | null;
};

type TmdbMovieSearchResult = {
  id: number;
  title: string;
  overview: string | null;
  poster_path: string | null;
  release_date: string | null;
};

type TmdbPosterImage = {
  file_path: string;
  iso_639_1: string | null;
};

type TmdbImagesResponse = {
  id: number;
  posters: TmdbPosterImage[];
};

type TmdbMovieDetails = {
  id: number;
  title: string;
  overview: string | null;
  poster_path: string | null;
  release_date: string | null;
  runtime: number | null;
  genres: Array<{ id: number; name: string }>;
  production_companies: Array<{ id: number; name: string; logo_path: string | null }>;
  homepage: string | null;
};
