import { useState } from "react";
import { Input, Typography } from "@material-tailwind/react";
import classNames from "classnames";

import { Strings } from "@/constants/strings";
import type { Medium } from "@/components/admin";

export type SearchResult = {
  id: string;
  title: string;
  thumbnailUrl?: string;
  medium: Medium;
};

const MOCK_RESULTS: Record<Medium, SearchResult[]> = {
  manga: [
    { id: "anilist-1", title: "Dungeon Meshi", medium: "manga" },
    { id: "anilist-2", title: "Attack on Titan", medium: "manga" },
    { id: "anilist-3", title: "Fullmetal Alchemist", medium: "manga" },
    { id: "anilist-4", title: "Berserk", medium: "manga" },
    { id: "anilist-5", title: "Vinland Saga", medium: "manga" },
  ],
  book: [
    { id: "ol-1", title: "Dune", medium: "book" },
    { id: "ol-2", title: "The Name of the Wind", medium: "book" },
    { id: "ol-3", title: "Mistborn: The Final Empire", medium: "book" },
    { id: "ol-4", title: "The Way of Kings", medium: "book" },
  ],
  movie_show: [
    { id: "tmdb-1", title: "Inception", medium: "movie_show" },
    { id: "tmdb-2", title: "The Dark Knight", medium: "movie_show" },
    { id: "tmdb-3", title: "Spirited Away", medium: "movie_show" },
    { id: "tmdb-4", title: "Your Name", medium: "movie_show" },
  ],
};

type MediaSearchState = "idle" | "results" | "no-results" | "error";

type MediaSearchProps = {
  medium: Medium;
  onSelect: (result: SearchResult) => void;
  onContinueManually: () => void;
};

function MediaSearch({ medium, onSelect, onContinueManually }: MediaSearchProps) {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<MediaSearchState>("idle");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  function handleSearch() {
    if (!query.trim()) return;
    const pool = MOCK_RESULTS[medium];
    const matches = pool.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()));
    setResults(matches);
    setState(matches.length > 0 ? "results" : "no-results");
  }

  function handleSelect(result: SearchResult) {
    setSelected(result.id);
    onSelect(result);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            label={Strings.entry.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </div>

      {state === "error" && (
        <div className="flex items-center justify-between rounded-md bg-red-50 dark:bg-red-900/20 px-4 py-3">
          <Typography variant="small" className="text-red-700 dark:text-red-400">
            {Strings.entry.searchError}
          </Typography>
          <button
            type="button"
            onClick={onContinueManually}
            className="text-sm text-blue-600 dark:text-blue-400 underline hover:no-underline ml-4"
          >
            {Strings.entry.continueManually}
          </button>
        </div>
      )}

      {state === "no-results" && (
        <div className="flex items-center justify-between rounded-md bg-gray-50 dark:bg-gray-800 px-4 py-3">
          <Typography variant="small" className="text-gray-600 dark:text-gray-400">
            {Strings.entry.noResults}
          </Typography>
          <button
            type="button"
            onClick={onContinueManually}
            className="text-sm text-blue-600 dark:text-blue-400 underline hover:no-underline ml-4"
          >
            {Strings.entry.continueManually}
          </button>
        </div>
      )}

      {state === "results" && results.length > 0 && (
        <div className="flex flex-col gap-1 rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <Typography variant="small" className="font-medium text-gray-700 dark:text-gray-300">
              {Strings.entry.searchResults}
            </Typography>
          </div>
          {results.map((result) => (
            <button
              key={result.id}
              type="button"
              onClick={() => handleSelect(result)}
              className={classNames(
                "flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                selected === result.id && "bg-blue-50 dark:bg-blue-900/20",
              )}
            >
              <div className="w-8 h-10 flex-shrink-0 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {result.thumbnailUrl ? (
                  <img
                    src={result.thumbnailUrl}
                    alt=""
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">?</span>
                )}
              </div>
              <Typography
                variant="small"
                className={classNames(
                  "text-gray-900 dark:text-gray-100",
                  selected === result.id && "font-semibold",
                )}
              >
                {result.title}
              </Typography>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export { MediaSearch };
