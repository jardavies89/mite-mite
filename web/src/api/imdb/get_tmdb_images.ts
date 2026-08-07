const TMDB_BASE = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;

async function getTmdbImages(id: number, medium: "tv" | "movie"): Promise<TmdbPosterImage[]> {
  const params = new URLSearchParams({ api_key: API_KEY });
  const response = await fetch(`${TMDB_BASE}/${medium}/${id}/images?${params}`);
  if (!response.ok) throw new Error(`TMDB request failed: ${response.status}`);
  const json: TmdbImagesResponse = await response.json();
  return json.posters;
}

export { getTmdbImages };
