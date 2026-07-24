import { Strings } from "@/constants/strings";
import { useSearchContext } from "@/components/home_page";
import { MultiSelectDropdown } from "@/components/shared/multi_select_dropdown";

interface GenreFilterProps {
  options: string[];
}

function GenreFilter({ options }: GenreFilterProps) {
  const { genreFilters, setGenreFilters } = useSearchContext();

  return (
    <MultiSelectDropdown
      label={Strings.filters.genrePlaceholder}
      options={options.map((g) => ({ label: g, value: g }))}
      selected={genreFilters}
      onChange={setGenreFilters}
      placeholder={Strings.filters.genrePlaceholder}
    />
  );
}

export { GenreFilter };
