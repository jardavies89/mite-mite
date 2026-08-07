import { useEffect, useRef, useState } from "react";

import { searchMovies } from "@/api/imdb";

type SearchState = {
  results: TmdbMovieSearchResult[];
  isLoading: boolean;
  error: string | null;
};

function useTmdbMovieSearch(query: string): SearchState {
  const [results, setResults] = useState<TmdbMovieSearchResult[]>([]);
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
        const data = await searchMovies(query.trim());
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

export { useTmdbMovieSearch };
