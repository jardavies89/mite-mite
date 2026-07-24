import { useNewEntryContext } from "@/components/admin/context/new_entry_context";
import type { Tags } from "@/constants/types";
import { TAG_GROUPS } from "@/constants/types";
import { Strings } from "@/constants/strings";
import { MultiSelectDropdown } from "@/components/shared/multi_select_dropdown";

const TAG_GROUP_OPTIONS = TAG_GROUPS.map((g) => ({
  label: g.label,
  options: g.values.map((v) => ({ label: v, value: v })),
}));

function TagsSelect() {
  const { newEntryDraft, updateEntryDraft } = useNewEntryContext();
  const { tagIds } = newEntryDraft;

  return (
    <div className="flex flex-col gap-2">
      <label>{Strings.entry.tags}</label>
      <MultiSelectDropdown
        label={Strings.entry.tags}
        groups={TAG_GROUP_OPTIONS}
        selected={tagIds}
        onChange={(next) => updateEntryDraft({ tagIds: next as Tags[] })}
      />
    </div>
  );
}

export { TagsSelect };
