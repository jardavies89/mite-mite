const TMDB_BASE = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;

async function getMovie(id: number): Promise<TmdbMovieDetails> {
  const params = new URLSearchParams({ api_key: API_KEY });
  const response = await fetch(`${TMDB_BASE}/movie/${id}?${params}`);

  if (!response.ok) throw new Error(`TMDB request failed: ${response.status}`);

  return response.json() as Promise<TmdbMovieDetails>;
}

export { getMovie };
