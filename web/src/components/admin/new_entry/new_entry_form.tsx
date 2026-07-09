import type { ChangeEvent } from "react";

import { FranchiseSelector } from "@/components/admin/new_entry";
import { TextInput } from "@/components/shared/form_fields/text_input";

import { useNewEntryContext } from "@/components/admin/context/new_entry_context";
import { Strings } from "@/constants/strings";

interface PropTypes {
  onResetClicked: () => void;
}

function NewEntryForm({ onResetClicked }: PropTypes) {
  const { newEntryDraft, updateEntryDraft } = useNewEntryContext();

  function onTextChanged(event: ChangeEvent<HTMLInputElement>) {
    updateEntryDraft({ primaryTitle: event.target.value });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-8">
        <img alt="banner-image" src={newEntryDraft.coverImageUrl} />

        <div className="flex flex-col gap-4 w-full">
          <TextInput
            currentValue={newEntryDraft.primaryTitle}
            id="primary-title-field"
            onChange={onTextChanged}
            label={Strings.entry.primaryTitle}
          />

          <FranchiseSelector />
        </div>
      </div>
    </div>
  );
}

export { NewEntryForm };
