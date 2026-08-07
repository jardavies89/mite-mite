import { useState } from "react";
import { Button } from "@material-tailwind/react";

import { CoverPickerModal } from "@/components/admin/new_entry/cover_picker_modal";
import { TmdbCoverPickerModal } from "@/components/admin/new_entry/tmdb_cover_picker_modal";
import { useNewEntryContext } from "@/components/admin/context/new_entry_context";
import { Medium } from "@/constants/types";
import { Strings } from "@/constants/strings";

function CoverPicker() {
  const { newEntryDraft } = useNewEntryContext();
  const [isOpen, setIsOpen] = useState(false);

  const { coverImageUrl, medium, primaryTitle } = newEntryDraft;

  if (!coverImageUrl) return null;

  const isTmdb = medium === Medium.Show || medium === Medium.Movie;

  return (
    <>
      <img alt="cover" src={coverImageUrl} className="w-64 rounded" />

      <Button
        variant="text"
        color="blue"
        onClick={() => setIsOpen(true)}
        className="normal-case text-xs underline hover:no-underline text-center p-0"
      >
        {Strings.entry.chooseCover}
      </Button>

      {isOpen && !isTmdb && (
        <CoverPickerModal title={primaryTitle} onClose={() => setIsOpen(false)} />
      )}
      {isOpen && isTmdb && <TmdbCoverPickerModal onClose={() => setIsOpen(false)} />}
    </>
  );
}

export { CoverPicker };
