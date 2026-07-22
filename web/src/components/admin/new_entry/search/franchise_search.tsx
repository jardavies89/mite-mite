import { useState } from "react";
import classNames from "classnames";

import { useGetFranchises } from "@/api/mite_mite";

import { TextInput } from "@/components/shared/form_fields/text_input";
import { Strings } from "@/constants/strings";

interface PropTypes {
  onSelect: (franchiseId: string) => void;
}

function FranchiseSearch({ onSelect }: PropTypes) {
  const [query, setQuery] = useState("");
  const { results, isLoading, error } = useGetFranchises(query);

  function handleSelect(franchise: Franchise) {
    setQuery("");
    onSelect(franchise.id);
  }

  function renderResult(franchise: Franchise) {
    const itemClasses = classNames(
      "w-full text-left px-4 py-3",
      "hover-surface border-b border-default",
      "last:border-b-0 transition-colors",
    );

    return (
      <li key={franchise.id}>
        <button type="button" onClick={() => handleSelect(franchise)} className={itemClasses}>
          <span className="block font-medium">{franchise.primaryTitle}</span>
        </button>
      </li>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <TextInput
        label={Strings.entry.franchise}
        id="franchise-search-input"
        onChange={(e) => setQuery(e.target.value)}
        placeholder={Strings.newEntry.franchisePlaceholder}
        currentValue={query}
      />

      {isLoading && <p className="text-sm text-muted">{Strings.search.searching}</p>}

      {error && <p className="text-sm text-red-500">{Strings.search.searchError}</p>}

      {!isLoading && !error && results.length > 0 && (
        <ul className="border border-default rounded-md overflow-hidden">
          {results.map(renderResult)}
        </ul>
      )}

      {!isLoading && !error && query.trim().length >= 2 && results.length === 0 && (
        <p className="text-sm text-muted">{Strings.newEntry.noResults}</p>
      )}
    </div>
  );
}

export { FranchiseSearch };
