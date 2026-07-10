import { useEffect, useRef, useState } from "react";

import { searchMedia } from "@/api/anilist";

type SearchState = {
  results: MangaSearchResult[];
  isLoading: boolean;
  error: string | null;
};

function useAnilistSearch(query: string): SearchState {
  const [results, setResults] = useState<MangaSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await searchMedia(query.trim());
        setResults(data);
      } catch {
        setError("search_error");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return { results, isLoading, error };
}

export { useAnilistSearch };
