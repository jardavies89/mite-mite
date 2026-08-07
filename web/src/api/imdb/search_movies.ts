const TMDB_BASE = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;

async function searchMovies(query: string): Promise<TmdbMovieSearchResult[]> {
  const params = new URLSearchParams({ query, api_key: API_KEY });
  const response = await fetch(`${TMDB_BASE}/search/movie?${params}`);

  if (!response.ok) throw new Error(`TMDB request failed: ${response.status}`);

  const json: { results: TmdbMovieSearchResult[] } = await response.json();
  return json.results;
}

export { searchMovies };
