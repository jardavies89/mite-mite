import { useNewEntryContext } from "@/components/admin/context/new_entry_context";
import { Genres } from "@/constants/types";
import { Strings } from "@/constants/strings";
import { MultiSelectDropdown } from "@/components/shared/multi_select_dropdown";

const ALL_GENRES = Object.values(Genres).map((g) => ({ label: g, value: g }));

function GenreSelect() {
  const { newEntryDraft, updateEntryDraft } = useNewEntryContext();
  const { genres } = newEntryDraft;

  return (
    <div className="flex flex-col gap-2">
      <label>{Strings.entry.genres}</label>
      <MultiSelectDropdown
        label={Strings.entry.genres}
        options={ALL_GENRES}
        selected={genres}
        onChange={(next) => updateEntryDraft({ genres: next as Genres[] })}
      />
    </div>
  );
}

export { GenreSelect };
