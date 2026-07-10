import { useState } from "react";
import { getMedia } from "@/api/anilist";

type AnlistMediaDetilsResult = {
  data: AnilistMediaDetails | null;
  isLoading: boolean;
  error: string | null;
  getMediaDetails: (id: number) => Promise<AnilistMediaDetails | null>;
};

function useAnilistMediaDetails(): AnlistMediaDetilsResult {
  const [data, setData] = useState<AnilistMediaDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getMediaDetails(id: number): Promise<AnilistMediaDetails | null> {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getMedia(id);
      setData(result);
      return result;
    } catch {
      setError("fetch_error");
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { data, isLoading, error, getMediaDetails };
}

export { useAnilistMediaDetails };
export type { AnlistMediaDetilsResult };
