import { SelectInput } from "@/components/shared/form_fields/select_input";
import { useNewEntryContext } from "@/components/admin/context/new_entry_context";
import { Status } from "@/constants/types";
import { Strings } from "@/constants/strings";

const STATUS_OPTIONS = Object.values(Status).map((s) => ({ label: s, value: s }));

function StatusSelect() {
  const { newEntryDraft, updateEntryDraft } = useNewEntryContext();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    updateEntryDraft({ status: value === "" ? null : (value as Status) });
  }

  return (
    <div className="flex flex-col gap-2">
      <SelectInput
        currentValue={newEntryDraft.status}
        id="status-field"
        label={Strings.entry.status}
        onChange={onChange}
        options={STATUS_OPTIONS}
        placeholder={Strings.entry.statusPlaceholder}
      />
    </div>
  );
}

export { StatusSelect };
