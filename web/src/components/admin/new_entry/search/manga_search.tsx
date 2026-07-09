import { useState } from "react";

import { useAnilistSearch } from "@/components/admin";
import { SearchResultListItem } from "@/components/admin/new_entry";

import { TextInput } from "@/components/shared/form_fields/text_input";
import { Strings } from "@/constants/strings";

interface PropTypes {
  onSelect: (result: MangaSearchResult) => void;
}

function MangaSearch({ onSelect }: PropTypes) {
  const [query, setQuery] = useState("");
  const { results, isLoading, error } = useAnilistSearch(query);

  function handleSelect(result: MangaSearchResult) {
    setQuery(result.title.romaji ?? result.title.english ?? "");
    onSelect(result);
  }

  function renderSearchResult(result: MangaSearchResult) {
    return (
      <SearchResultListItem
        key={`${result.title}-${result.id}`}
        result={result}
        onSelect={handleSelect}
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <TextInput
        label={Strings.entry.primaryTitle}
        id="manga-search-input"
        onChange={(e) => setQuery(e.target.value)}
        placeholder={Strings.newEntry.searchTitle}
        currentValue={query}
      />

      {isLoading && (
        <p className="text-sm text-muted">{Strings.newEntry.searching}</p>
      )}

      {error && <p className="text-sm text-red-500">{Strings.newEntry.searchError}</p>}

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

export { MangaSearch };
