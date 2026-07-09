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
