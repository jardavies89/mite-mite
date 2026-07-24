import type { ChangeEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
import { Button } from "@material-tailwind/react";
import { useCreateEntry } from "@/api/mite_mite";

function NewEntryForm() {
  const { newEntryDraft, updateEntryDraft } = useNewEntryContext();
  const [coverPickerOpen, setCoverPickerOpen] = useState(false);
  const [showRequiredError, setShowRequiredError] = useState(false);
  const { createEntry } = useCreateEntry();
  const navigate = useNavigate();

  async function onSubmitClicked() {
    const {
      alternateTitles,
      comments,
      coverImageUrl,
      description,
      franchiseId,
      genres,
      medium,
      newFranchiseName,
      primaryTitle,
      referenceUrl,
      staff,
      status,
      tagIds,
    } = newEntryDraft;
    const hasFranchiseInfo = franchiseId.length > 0 || newFranchiseName.length > 0;

    if (!hasFranchiseInfo) {
      setShowRequiredError(true);
      return;
    }

    setShowRequiredError(false);

    const result = await createEntry({
      alternateTitles,
      comments,
      coverImageUrl,
      description,
      franchiseId: franchiseId || undefined,
      newFranchiseName: newFranchiseName || undefined,
      genres,
      //@ts-expect-error medium won't actually be nullable at this stage.
      medium,
      primaryTitle,
      referenceUrl,
      staff,
      status,
      tags: tagIds,
    });

    const createdFranchiseId = result.data?.createEntry.franchise?.id;
    if (createdFranchiseId) navigate(`/series/${createdFranchiseId}`);
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
          <img alt="cover" src={newEntryDraft.coverImageUrl} className="w-64 rounded" />
          {newEntryDraft.coverImageUrl && (
            <Button
              variant="text"
              color="blue"
              onClick={() => setCoverPickerOpen(true)}
              className="normal-case text-xs underline hover:no-underline text-center p-0"
            >
              {Strings.entry.chooseCover}
            </Button>
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

      <div className="flex flex-row gap-4 justify-end mt-4">
        <Button
          variant="text"
          color="white"
          className="normal-case"
          onClick={() => window.location.reload()}
        >
          {Strings.newEntry.resetForm}
        </Button>

        <Button color="blue" className="normal-case" onClick={onSubmitClicked}>
          {Strings.newEntry.createEntry}
        </Button>
      </div>

      {showRequiredError && (
        <p className="text-center text-red-600">{Strings.newEntry.franchiseError}</p>
      )}

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
