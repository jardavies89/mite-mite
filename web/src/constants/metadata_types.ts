// ANIME covers all animation styles (anime, western cartoons, CGI, etc.) — displayed as "Animation"
type ShowStyle = "ANIME" | "LIVE_ACTION";

type MangaMetadata = {
  volumeCount?: number;
  chapterCount?: number;
  publishers?: string[];
  startDate?: string;
  endDate?: string;
};

type Season = {
  episodeCount?: number;
  startDate?: string;
  endDate?: string;
};

type ShowMetadata = {
  style?: ShowStyle;
  studio?: string;
  startDate?: string;
  endDate?: string;
  seasons?: Season[];
};

type MovieMetadata = {
  runtime?: number;
  studio?: string;
  releaseDate?: string;
};

type BookMetadata = Record<string, never>;

type EntryMetadata = MangaMetadata | ShowMetadata | MovieMetadata | BookMetadata;

export type {
  BookMetadata,
  EntryMetadata,
  MangaMetadata,
  MovieMetadata,
  Season,
  ShowMetadata,
  ShowStyle,
};
