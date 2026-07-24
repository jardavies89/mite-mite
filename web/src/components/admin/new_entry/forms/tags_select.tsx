import { useNewEntryContext } from "@/components/admin/context/new_entry_context";
import {
  ContentWarningTags,
  DemographicTags,
  NarrativeTags,
  SubGenreTags,
} from "@/constants/types";
import type { Tags } from "@/constants/types";
import { Strings } from "@/constants/strings";
import { MultiSelectDropdown } from "@/components/shared/multi_select_dropdown";

const TAG_GROUPS: { label: string; options: { label: Tags; value: Tags }[] }[] = [
  {
    label: "Sub-genres",
    options: Object.values(SubGenreTags).map((t) => ({ label: t, value: t })),
  },
  {
    label: "Narrative",
    options: Object.values(NarrativeTags).map((t) => ({ label: t, value: t })),
  },
  {
    label: "Demographic",
    options: Object.values(DemographicTags).map((t) => ({ label: t, value: t })),
  },
  {
    label: "Content warnings",
    options: Object.values(ContentWarningTags).map((t) => ({ label: t, value: t })),
  },
];

function TagsSelect() {
  const { newEntryDraft, updateEntryDraft } = useNewEntryContext();
  const { tagIds } = newEntryDraft;

  return (
    <div className="flex flex-col gap-2">
      <label>{Strings.entry.tags}</label>
      <MultiSelectDropdown
        label={Strings.entry.tags}
        groups={TAG_GROUPS}
        selected={tagIds}
        onChange={(next) => updateEntryDraft({ tagIds: next as Tags[] })}
      />
    </div>
  );
}

export { TagsSelect, TAG_GROUPS };
