import { useEffect, useRef, useState } from "react";

import { searchShows } from "@/api/imdb";

type SearchState = {
  results: TmdbTvSearchResult[];
  isLoading: boolean;
  error: string | null;
};

function useTmdbShowSearch(query: string): SearchState {
  const [results, setResults] = useState<TmdbTvSearchResult[]>([]);
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
        const data = await searchShows(query.trim());
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

export { useTmdbShowSearch };
