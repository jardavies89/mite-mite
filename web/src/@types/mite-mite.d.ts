// ANIME covers all animation styles (anime, western cartoons, CGI, etc.) — displayed as "Animation"
type ShowStyle = "ANIME" | "LIVE_ACTION";

interface Entry {
  id: string;
  alternateTitles: string[];
  comments: string;
  coverImageUrl: string;
  description: string;
  genres: string[];
  medium: string;
  metadata: EntryMetadata;
  primaryTitle: string;
  referenceUrl?: string;
  staff: string[];
  status: string;
  tags: string[];
}

interface Franchise {
  id: string;
  primaryTitle: string;
  primaryEntryId?: string;
  entries: Entry[];
}

type MangaMetadata = {
  volumeCount?: number;
  chapterCount?: number;
  publishers?: string[];
  startDate?: string;
  endDate?: string;
};

type MovieMetadata = {
  runtime?: number;
  studio?: string;
  releaseDate?: string;
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

type BookMetadata = Record<string, never>;
type EntryMetadata = MangaMetadata | ShowMetadata | MovieMetadata | BookMetadata;
