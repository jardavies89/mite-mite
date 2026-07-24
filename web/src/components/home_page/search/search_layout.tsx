import classNames from "classnames";

import { Strings } from "@/constants/strings";
import { useSearchContext } from "@/components/home_page";

function SearchLayout() {
  const { query, setQuery } = useSearchContext();

  const searchBarClasses = classNames(
    "w-full mb-6 px-3 py-2 rounded-md",
    "border border-default bg-transparent text-sm",
    "focus:outline-none focus:ring-1 focus:ring-blue-gray-300",
  );

  return (
    <input
      type="search"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder={Strings.home.searchPlaceholder}
      className={searchBarClasses}
    />
  );
}

export { SearchLayout };
