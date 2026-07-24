import { TAG_GROUPS } from "@/constants/types";
import { Strings } from "@/constants/strings";
import { useSearchContext } from "@/components/home_page";
import { MultiSelectDropdown } from "@/components/shared/multi_select_dropdown";

interface TagFilterProps {
  options: string[];
}

function TagFilter({ options }: TagFilterProps) {
  const { tagFilters, setTagFilters } = useSearchContext();

  const availableSet = new Set(options);
  const groups = TAG_GROUPS.map((group) => ({
    label: group.label,
    options: group.values.filter((v) => availableSet.has(v)).map((v) => ({ label: v, value: v })),
  })).filter((group) => group.options.length > 0);

  return (
    <MultiSelectDropdown
      label={Strings.filters.tagPlaceholder}
      groups={groups}
      selected={tagFilters}
      onChange={setTagFilters}
      placeholder={Strings.filters.tagPlaceholder}
    />
  );
}

export { TagFilter };
