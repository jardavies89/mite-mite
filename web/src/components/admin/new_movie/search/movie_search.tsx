import { useState } from "react";

import { SearchResultListItem } from "@/components/admin/new_entry";
import { useTmdbMovieSearch } from "@/components/admin/hooks/use_tmdb_movie_search";
import { TextInput } from "@/components/shared/form_fields/text_input";
import { Strings } from "@/constants/strings";

interface PropTypes {
  onSelect: (result: TmdbMovieSearchResult) => void;
}

function MovieSearch({ onSelect }: PropTypes) {
  const [query, setQuery] = useState("");
  const { results, isLoading, error } = useTmdbMovieSearch(query);

  function handleSelect(result: TmdbMovieSearchResult) {
    setQuery("");
    onSelect(result);
  }

  function renderSearchResult(result: TmdbMovieSearchResult) {
    const year = result.release_date ? result.release_date.slice(0, 4) : undefined;
    return (
      <SearchResultListItem
        key={result.id}
        primaryLabel={result.title}
        secondaryLabel={year}
        badge="MOVIE"
        onSelect={() => handleSelect(result)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <TextInput
        label={Strings.entry.primaryTitle}
        id="movie-search-input"
        onChange={(e) => setQuery(e.target.value)}
        placeholder={Strings.search.searchTitle}
        currentValue={query}
      />

      {isLoading && <p className="text-sm text-muted">{Strings.search.searching}</p>}

      {error && <p className="text-sm text-red-500">{Strings.search.searchError}</p>}

      {!isLoading && !error && results.length > 0 && (
        <ul className="border border-default rounded-md overflow-hidden">
          {results.map(renderSearchResult)}
        </ul>
      )}

      {!isLoading && !error && query.trim().length >= 2 && results.length === 0 && (
        <p className="text-sm text-muted">{Strings.newEntry.noResults}</p>
      )}
    </div>
  );
}

export { MovieSearch };
