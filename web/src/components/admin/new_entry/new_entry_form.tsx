import type { ChangeEvent } from "react";

import { useNewEntryContext } from "@/components/admin/context/new_entry_context";

import { TextInput } from "@/components/shared/form_fields/text_input";
import { Strings } from "@/constants/strings";

function NewEntryForm() {
  const { newEntryDraft, updateEntryDraft } = useNewEntryContext();

  function onTitleChanged(event: ChangeEvent<HTMLInputElement>) {
    updateEntryDraft({ primaryTitle: event.target.value });
  }

  return (
    <>
      <TextInput
        label={Strings.entry.primaryTitle}
        id="primary-title-input"
        onChange={onTitleChanged}
        placeholder={Strings.entry.searchPlaceholder}
        currentValue={newEntryDraft.primaryTitle}
      />
    </>
  );
}

export { NewEntryForm };
