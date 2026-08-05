type ShowStyle = "ANIME" | "LIVE_ACTION";

type MangaMetadata = {
  volumeCount?: number;
  chapterCount?: number;
  publisher?: string;
  firstPublishedDate?: string;
  concludedDate?: string;
};

type ShowMetadata = {
  style?: ShowStyle;
  seasonCount?: number;
  episodeCount?: number;
  studio?: string;
  broadcastStartDate?: string;
  broadcastEndDate?: string;
};

type MovieMetadata = {
  runtime?: number;
  studio?: string;
  releaseDate?: string;
};

type BookMetadata = Record<string, never>;

type EntryMetadata =
  | { medium: "MANGA"; metadata: MangaMetadata }
  | { medium: "SHOW"; metadata: ShowMetadata }
  | { medium: "MOVIE"; metadata: MovieMetadata }
  | { medium: "BOOK"; metadata: BookMetadata };

export type {
  BookMetadata,
  EntryMetadata,
  MangaMetadata,
  MovieMetadata,
  ShowMetadata,
  ShowStyle,
};
