import type { ChangeEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";

import { TextInput } from "@/components/shared/form_fields/text_input";
import { Strings } from "@/constants/strings";
import { useUpdateFranchise } from "@/api/mite_mite";

interface PropTypes {
  franchiseId: string;
  initialTitle: string;
}

function EditFranchiseForm({ franchiseId, initialTitle }: PropTypes) {
  const [title, setTitle] = useState(initialTitle);
  const [showEmptyError, setShowEmptyError] = useState(false);
  const { updateFranchise } = useUpdateFranchise();
  const navigate = useNavigate();

  async function onSaveClicked() {
    if (!title.trim()) {
      setShowEmptyError(true);
      return;
    }

    setShowEmptyError(false);
    await updateFranchise(franchiseId, { primaryTitle: title.trim() });
    navigate(`/series/${franchiseId}`);
  }

  function onTitleChanged(event: ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
    if (showEmptyError) setShowEmptyError(false);
  }

  return (
    <div className="flex flex-col gap-4 pb-8">
      <TextInput
        currentValue={title}
        id="franchise-title-field"
        onChange={onTitleChanged}
        label={Strings.entry.primaryTitle}
      />

      {showEmptyError && (
        <p className="text-center text-red-600">{Strings.editFranchise.emptyTitleError}</p>
      )}

      <div className="flex flex-row gap-4 justify-end mt-4">
        <Button
          variant="text"
          className="normal-case text-gray-900 dark:text-white"
          onClick={() => navigate(`/series/${franchiseId}`)}
        >
          {Strings.editFranchise.cancel}
        </Button>

        <Button color="blue" className="normal-case" onClick={onSaveClicked}>
          {Strings.editFranchise.saveChanges}
        </Button>
      </div>
    </div>
  );
}

export { EditFranchiseForm };
