import type { ChangeEvent } from "react";
import { useState } from "react";

import { FranchiseSelector } from "@/components/admin/new_entry";
import { AlternateTitles } from "@/components/admin/new_entry/alternate_titles";
import { GenreSelect } from "@/components/admin/new_entry/forms/genre_select";
import { StatusSelect } from "@/components/admin/new_entry/forms/status_select";
import { TagsSelect } from "@/components/admin/new_entry/forms/tags_select";
import { StaffInput } from "@/components/admin/new_entry/forms/staff_input";
import { TextInput } from "@/components/shared/form_fields/text_input";
import { TextareaInput } from "@/components/shared/form_fields/textarea_input";

import { CoverPickerModal } from "@/components/admin/new_entry/cover_picker_modal";
import { useNewEntryContext } from "@/components/admin/context/new_entry_context";
import { Strings } from "@/constants/strings";

interface PropTypes {
  onResetClicked: () => void;
}

function NewEntryForm({ onResetClicked }: PropTypes) {
  const { newEntryDraft, updateEntryDraft } = useNewEntryContext();
  const [coverPickerOpen, setCoverPickerOpen] = useState(false);

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
    <div className="flex flex-col gap-4 pb-8">
      {newEntryDraft.anilistUrl && (
        <a
          href={newEntryDraft.anilistUrl}
          target="_blank"
          rel="noreferrer"
          className="self-start text-sm text-blue-600 dark:text-blue-400 underline hover:no-underline"
        >
          {Strings.entry.anilistSource}
        </a>
      )}

      <div className="flex flex-row gap-8">
        <div className="flex flex-col gap-2 flex-shrink-0">
          <img alt="cover" src={newEntryDraft.coverImageUrl} className="w-64 rounded" />
          {newEntryDraft.coverImageUrl && (
            <button
              type="button"
              onClick={() => setCoverPickerOpen(true)}
              className="text-xs text-blue-600 dark:text-blue-400 underline hover:no-underline text-center"
            >
              {Strings.entry.chooseCover}
            </button>
          )}
        </div>

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

        <StaffInput />

        <div className="flex flex-row gap-4 w-full">
          <div className="flex-1">
            <GenreSelect />
          </div>
          <div className="flex-1">
            <TagsSelect />
          </div>
          <div className="flex-1">
            <StatusSelect />
          </div>
        </div>
      </div>

      {coverPickerOpen && (
        <CoverPickerModal
          title={newEntryDraft.primaryTitle}
          onClose={() => setCoverPickerOpen(false)}
        />
      )}
    </div>
  );
}

export { NewEntryForm };
