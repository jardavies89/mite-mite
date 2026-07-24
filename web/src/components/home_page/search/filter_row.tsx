import { useGetFilterOptions } from "@/api/mite_mite";
import { StatusFilter } from "@/components/home_page/search/status_filter";
import { GenreFilter } from "@/components/home_page/search/genre_filter";
import { TagFilter } from "@/components/home_page/search/tag_filter";

function FilterRow() {
  const { availableGenres, availableTags } = useGetFilterOptions();

  return (
    <div className="flex flex-row flex-wrap gap-3">
      <StatusFilter />
      <GenreFilter options={availableGenres} />
      <TagFilter options={availableTags} />
    </div>
  );
}

export { FilterRow };
