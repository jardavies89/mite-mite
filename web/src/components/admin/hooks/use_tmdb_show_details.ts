import { useState } from "react";

import { getShow } from "@/api/imdb";

type TmdbShowDetailsResult = {
  data: TmdbTvDetails | null;
  isLoading: boolean;
  error: string | null;
  getShowDetails: (id: number) => Promise<TmdbTvDetails | null>;
};

function useTmdbShowDetails(): TmdbShowDetailsResult {
  const [data, setData] = useState<TmdbTvDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getShowDetails(id: number): Promise<TmdbTvDetails | null> {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getShow(id);
      setData(result);
      return result;
    } catch {
      setError("fetch_error");
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { data, isLoading, error, getShowDetails };
}

export { useTmdbShowDetails };
export type { TmdbShowDetailsResult };
