import classNames from "classnames";

import { Strings } from "@/constants/strings";
import { useSearchContext } from "@/components/home_page";
import { FilterRow } from "@/components/home_page/search/filter_row";

function SearchLayout() {
  const { query, setQuery } = useSearchContext();

  const searchBarClasses = classNames(
    "w-full px-3 py-2 rounded-md",
    "border border-default bg-transparent text-sm",
    "focus:outline-none focus:ring-1 focus:ring-blue-gray-300",
  );

  return (
    <div className="flex flex-col gap-3 mb-6">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={Strings.home.searchPlaceholder}
        className={searchBarClasses}
      />
      <FilterRow />
    </div>
  );
}

export { SearchLayout };
