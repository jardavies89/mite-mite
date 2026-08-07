import { useEffect } from "react";

import { NewEntryForm } from "@/components/admin/new_entry";
import { ShowSearch } from "@/components/admin/new_show/search/show_search";
import { useTmdbShowDetails } from "@/components/admin/hooks/use_tmdb_show_details";
import { useNewEntryContext } from "@/components/admin/context/new_entry_context";
import { mapTmdbShowToEntryDraft } from "@/api/imdb";

function ShowImporter() {
  const { data, getShowDetails, isLoading } = useTmdbShowDetails();
  const { updateEntryDraft } = useNewEntryContext();

  useEffect(() => {
    if (data) {
      updateEntryDraft(mapTmdbShowToEntryDraft(data));
    }
  }, [data]);

  async function onShowSelected(result: TmdbTvSearchResult) {
    return getShowDetails(result.id);
  }

  if (isLoading) {
    return null;
  }

  if (data) {
    return <NewEntryForm />;
  }

  return <ShowSearch onSelect={onShowSelected} />;
}

export { ShowImporter };
