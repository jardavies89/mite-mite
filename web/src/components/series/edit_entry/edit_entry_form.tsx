import type { ChangeEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AlternateTitles } from "@/components/admin/new_entry/alternate_titles";
import { GenreSelect } from "@/components/admin/new_entry/forms/genre_select";
import { StatusSelect } from "@/components/admin/new_entry/forms/status_select";
import { TagsSelect } from "@/components/admin/new_entry/forms/tags_select";
import { MetadataFields } from "@/components/admin/new_entry/forms/metadata_fields";
import { StaffInput } from "@/components/admin/new_entry/forms/staff_input";
import { TextInput } from "@/components/shared/form_fields/text_input";
import { TextareaInput } from "@/components/shared/form_fields/textarea_input";
import { CoverPickerModal } from "@/components/admin/new_entry/cover_picker_modal";
import { useNewEntryContext } from "@/components/admin/context/new_entry_context";
import { Strings } from "@/constants/strings";
import { Medium, Status } from "@/constants/types";
import { Button } from "@material-tailwind/react";
import { useUpdateEntry } from "@/api/mite_mite";

interface PropTypes {
  franchiseId: string;
  entryId: string;
}

function EditEntryForm({ franchiseId, entryId }: PropTypes) {
  const { newEntryDraft, updateEntryDraft } = useNewEntryContext();
  const [coverPickerOpen, setCoverPickerOpen] = useState(false);
  const { updateEntry } = useUpdateEntry();
  const navigate = useNavigate();

  async function onSaveClicked() {
    const {
      alternateTitles,
      comments,
      coverImageUrl,
      description,
      genres,
      medium,
      metadata,
      primaryTitle,
      referenceUrl,
      staff,
      status,
      tagIds,
    } = newEntryDraft;

    await updateEntry(entryId, {
      alternateTitles,
      comments,
      coverImageUrl,
      description,
      genres,
      //@ts-expect-error medium won't actually be nullable at this stage
      medium,
      metadata: metadata ?? undefined,
      primaryTitle,
      referenceUrl,
      staff,
      status: medium === Medium.Movie ? Status.Completed : status,
      tags: tagIds,
    });

    navigate(`/series/${franchiseId}`);
  }

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
      {newEntryDraft.referenceUrl && (
        <a
          href={newEntryDraft.referenceUrl}
          target="_blank"
          rel="noreferrer"
          className="self-start text-sm text-blue-600 dark:text-blue-400 underline hover:no-underline"
        >
          {Strings.entry.anilistSource}
        </a>
      )}

      <div className="flex flex-row gap-8">
        <div className="flex flex-col gap-2 flex-shrink-0">
          {newEntryDraft.coverImageUrl && (
            <>
              <img alt="cover" src={newEntryDraft.coverImageUrl} className="w-64 rounded" />
              <Button
                variant="text"
                color="blue"
                onClick={() => setCoverPickerOpen(true)}
                className="normal-case text-xs underline hover:no-underline text-center p-0"
              >
                {Strings.entry.chooseCover}
              </Button>
            </>
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
          <div className="flex-1 min-w-0">
            <GenreSelect />
          </div>
          <div className="flex-1 min-w-0">
            <TagsSelect />
          </div>
          {newEntryDraft.medium !== Medium.Movie && (
            <div className="flex-1 min-w-0">
              <StatusSelect />
            </div>
          )}
        </div>

        <MetadataFields />
      </div>

      <div className="flex flex-row gap-4 justify-end mt-4">
        <Button
          variant="text"
          className="normal-case text-gray-900 dark:text-white"
          onClick={() => navigate(`/series/${franchiseId}`)}
        >
          {Strings.editEntry.cancel}
        </Button>

        <Button color="blue" className="normal-case" onClick={onSaveClicked}>
          {Strings.editEntry.saveChanges}
        </Button>
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

export { EditEntryForm };
