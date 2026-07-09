import type { ChangeEvent } from "react";

import { FranchiseSelector } from "@/components/admin/new_entry";
import { AlternateTitles } from "@/components/admin/new_entry/alternate_titles";
import { TextInput } from "@/components/shared/form_fields/text_input";
import { TextareaInput } from "@/components/shared/form_fields/textarea_input";

import { useNewEntryContext } from "@/components/admin/context/new_entry_context";
import { Strings } from "@/constants/strings";

interface PropTypes {
  onResetClicked: () => void;
}

function NewEntryForm({ onResetClicked }: PropTypes) {
  const { newEntryDraft, updateEntryDraft } = useNewEntryContext();

  function onTitleChanged(event: ChangeEvent<HTMLInputElement>) {
    updateEntryDraft({ primaryTitle: event.target.value });
  }

  function onDescriptionChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    updateEntryDraft({ description: event.target.value });
  }

  function onCommentsChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    updateEntryDraft({ comments: event.target.value });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-8">
        <img alt="banner-image" src={newEntryDraft.coverImageUrl} />

        <div className="flex flex-col gap-4 w-full">
          <TextInput
            currentValue={newEntryDraft.primaryTitle}
            id="primary-title-field"
            onChange={onTitleChanged}
            label={Strings.entry.primaryTitle}
          />

          <AlternateTitles />

          <FranchiseSelector />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <TextareaInput
          currentValue={newEntryDraft.description}
          id="description-field"
          label={Strings.entry.description}
          onChange={onDescriptionChanged}
        />

        <TextareaInput
          currentValue={newEntryDraft.comments}
          id="comments-field"
          label={Strings.entry.comments}
          onChange={onCommentsChanged}
        />

        <div className="flex flex-col gap-4 w-full">
          {/* <StaffInput /> */}
          {/* <GenreInput /> */}
          {/* < TagsInput /> */}
        </div>
      </div>
    </div>
  );
}

export { NewEntryForm };
