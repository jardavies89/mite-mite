import { useEffect } from "react";
import { MangaSearch, NewEntryForm } from "@/components/admin/new_entry";

import { useAnilistMediaDetails } from "@/components/admin/hooks/use_anilist_media_details";
import { useNewEntryContext } from "@/components/admin/context/new_entry_context";

function NewEntryImporter() {
  const { data, getMediaDetails, isLoading } = useAnilistMediaDetails();
  const { updateEntryDraft } = useNewEntryContext();

  useEffect(() => {
    if (data) {
      updateEntryDraft({
        coverImageUrl: data.coverImage.large || "",
        primaryTitle: data.title.english || "",
      });
    }
  }, [data]);

  function onReset() {
    // TODO: reset the form state and show the picker + search again.
  }

  async function onMangaSelected(result: MangaSearchResult) {
    return getMediaDetails(result.id);
  }

  if (isLoading) {
    return null;
  }

  if (data) {
    // TODO: Branching for different mediums, just manga for now
    console.log(data);
    return <NewEntryForm onResetClicked={onReset} />;
  }

  // TODO: Add a media type picker (manga, anime, books, ect)
  // and pair it with the appropriate search.
  return <MangaSearch onSelect={onMangaSelected} />;
}

export { NewEntryImporter };
