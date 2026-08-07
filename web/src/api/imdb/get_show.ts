const TMDB_BASE = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;

async function getShow(id: number): Promise<TmdbTvDetails> {
  const params = new URLSearchParams({ api_key: API_KEY });
  const response = await fetch(`${TMDB_BASE}/tv/${id}?${params}`);

  if (!response.ok) throw new Error(`TMDB request failed: ${response.status}`);

  return response.json() as Promise<TmdbTvDetails>;
}

export { getShow };
