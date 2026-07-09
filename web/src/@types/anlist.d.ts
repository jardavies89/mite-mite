type MangaSearchResult = {
  id: number;
  title: {
    romaji: string | null;
    english: string | null;
    native: string | null;
  };
  format: string | null;
  staff: {
    edges: Array<{
      role: string;
      node: { name: { full: string } };
    }>;
  };
};

type AnilistMediaDetails = {
  id: number;
  title: { romaji: string | null; english: string | null; native: string | null };
  synonyms: string[];
  description: string | null;
  format: string | null;
  status: string | null;
  chapters: number | null;
  volumes: number | null;
  averageScore: number | null;
  meanScore: number | null;
  popularity: number | null;
  favourites: number | null;
  coverImage: { extraLarge: string | null; large: string | null; color: string | null };
  bannerImage: string | null;
  genres: string[];
  tags: Array<{
    id: number;
    name: string;
    category: string;
    rank: number;
    isGeneralSpoiler: boolean;
    isAdult: boolean;
  }>;
  staff: {
    edges: Array<{ role: string; node: { name: { full: string; native: string | null } } }>;
  };
  externalLinks: Array<{ url: string; site: string; type: string }>;
  siteUrl: string | null;
  source: string | null;
  countryOfOrigin: string | null;
};
