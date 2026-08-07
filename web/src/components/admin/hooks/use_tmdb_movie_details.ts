import { useState } from "react";

import { getMovie } from "@/api/imdb";

type TmdbMovieDetailsResult = {
  data: TmdbMovieDetails | null;
  isLoading: boolean;
  error: string | null;
  getMovieDetails: (id: number) => Promise<TmdbMovieDetails | null>;
};

function useTmdbMovieDetails(): TmdbMovieDetailsResult {
  const [data, setData] = useState<TmdbMovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getMovieDetails(id: number): Promise<TmdbMovieDetails | null> {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getMovie(id);
      setData(result);
      return result;
    } catch {
      setError("fetch_error");
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { data, isLoading, error, getMovieDetails };
}

export { useTmdbMovieDetails };
export type { TmdbMovieDetailsResult };
