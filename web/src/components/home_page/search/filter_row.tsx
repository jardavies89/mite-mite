import { useGetFilterOptions } from "@/api/mite_mite";
import { StatusFilter } from "@/components/home_page/search/status_filter";
import { GenreFilter } from "@/components/home_page/search/genre_filter";

function FilterRow() {
  const { availableGenres } = useGetFilterOptions();

  return (
    <div className="flex flex-row flex-wrap gap-3">
      <StatusFilter />
      <GenreFilter options={availableGenres} />
    </div>
  );
}

export { FilterRow };
