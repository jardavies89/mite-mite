import { useState } from "react";
import classNames from "classnames";
import { Button } from "@material-tailwind/react";

import { useGetFranchises } from "@/api/mite_mite";

import { TextInput } from "@/components/shared/form_fields/text_input";
import { Strings } from "@/constants/strings";

interface PropTypes {
  onSelect: (franchiseId: string) => void;
}

function FranchiseSearch({ onSelect }: PropTypes) {
  const [query, setQuery] = useState("");
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const { results, isLoading, error } = useGetFranchises(selectedName ? "" : query);

  function handleSelect(franchise: Franchise) {
    setSelectedName(franchise.primaryTitle);
    setQuery("");
    onSelect(franchise.id);
  }

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (selectedName) {
      setSelectedName(null);
      onSelect("");
    }
    setQuery(e.target.value);
  }

  function renderResult(franchise: Franchise) {
    const itemClasses = classNames(
      "w-full text-left px-4 py-3",
      "hover-surface border-b border-default",
      "last:border-b-0 transition-colors",
    );

    return (
      <li key={franchise.id}>
        <Button
          variant="text"
          onClick={() => handleSelect(franchise)}
          className={`normal-case text-gray-900 dark:text-white ${itemClasses}`}
        >
          <span className="block font-medium">{franchise.primaryTitle}</span>
        </Button>
      </li>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <TextInput
        label={Strings.entry.franchise}
        id="franchise-search-input"
        onChange={handleQueryChange}
        placeholder={Strings.newEntry.franchisePlaceholder}
        currentValue={selectedName ?? query}
      />

      {!selectedName && isLoading && (
        <p className="text-sm text-muted">{Strings.search.searching}</p>
      )}

      {!selectedName && error && (
        <p className="text-sm text-red-500">{Strings.search.searchError}</p>
      )}

      {!selectedName && !isLoading && !error && results.length > 0 && (
        <ul className="border border-default rounded-md overflow-hidden">
          {results.map(renderResult)}
        </ul>
      )}

      {!selectedName &&
        !isLoading &&
        !error &&
        query.trim().length >= 2 &&
        results.length === 0 && <p className="text-sm text-muted">{Strings.newEntry.noResults}</p>}
    </div>
  );
}

export { FranchiseSearch };
