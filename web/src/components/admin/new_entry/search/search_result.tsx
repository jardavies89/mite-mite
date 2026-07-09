import classNames from "classnames";

interface PropTypes {
  result: MangaSearchResult;
  onSelect: (result: MangaSearchResult) => void;
}

function SearchResultListItem({ result, onSelect }: PropTypes) {
  const firstStaff = (result: MangaSearchResult) => result.staff.edges[0]?.node.name.full ?? null;

  const listItemClasses = classNames(
    "w-full text-left px-4 py-3",
    "hover:bg-gray-50 dark:hover:bg-gray-800",
    "border-b border-gray-100 dark:border-gray-700",
    "last:border-b-0 transition-colors",
  );

  return (
    <li key={result.id}>
      <button type="button" onClick={() => onSelect(result)} className={listItemClasses}>
        <span className="block font-medium text-gray-900 dark:text-white">
          {result.title.english ?? result.title.romaji}
        </span>

        <span className="flex gap-3 mt-0.5 items-center text-sm text-gray-500 dark:text-gray-400">
          {result.title.native && <span>{result.title.native}</span>}

          {result.format && (
            <span className="uppercase tracking-wide text-xs font-semibold">{result.format}</span>
          )}

          {firstStaff(result) && <span>{firstStaff(result)}</span>}
        </span>
      </button>
    </li>
  );
}

export { SearchResultListItem };
