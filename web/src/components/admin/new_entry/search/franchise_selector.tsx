import { useState, type ChangeEvent } from "react";

import { FranchiseSearch } from "@/components/admin/new_entry";
import { useNewEntryContext } from "@/components/admin/context/new_entry_context";

import { TextInput } from "@/components/shared/form_fields/text_input";
import { Strings } from "@/constants/strings";

function FranchiseSelector() {
  const { newEntryDraft, updateEntryDraft } = useNewEntryContext();
  const [createNew, setCreateNew] = useState(false);
  const { franchiseId, newFranchiseName } = newEntryDraft;

  const currentValue = createNew ? newFranchiseName : franchiseId;

  function onNameChanged(event: ChangeEvent<HTMLInputElement>) {
    updateEntryDraft({ newFranchiseName: event.target.value });
  }

  function onFranchiseSelected(franchiseId: string) {
    updateEntryDraft({ franchiseId });
  }

  function onCheckboxChanged() {
    setCreateNew(!createNew);
    updateEntryDraft({ franchiseId: "", newFranchiseName: "" });
  }

  function renderInput() {
    if (createNew) {
      return (
        <TextInput
          id="franchise-selector-input"
          label={Strings.entry.franchise}
          currentValue={currentValue}
          onChange={onNameChanged}
          placeholder={Strings.newEntry.franchisePlaceholder}
        />
      );
    }

    return <FranchiseSearch onSelect={onFranchiseSelected} />;
  }

  return (
    <div className="flex flex-col gap-2">
      {renderInput()}

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={createNew}
          onChange={onCheckboxChanged}
          className="rounded"
        />
        {Strings.newEntry.franchiseCreateNew}
      </label>
    </div>
  );
}

export { FranchiseSelector };
