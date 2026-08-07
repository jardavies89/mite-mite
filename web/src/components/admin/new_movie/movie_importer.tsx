import { useEffect } from "react";

import { NewEntryForm } from "@/components/admin/new_entry";
import { MovieSearch } from "@/components/admin/new_movie/search/movie_search";
import { useTmdbMovieDetails } from "@/components/admin/hooks/use_tmdb_movie_details";
import { useNewEntryContext } from "@/components/admin/context/new_entry_context";
import { mapTmdbMovieToEntryDraft } from "@/api/imdb";

function MovieImporter() {
  const { data, getMovieDetails, isLoading } = useTmdbMovieDetails();
  const { updateEntryDraft } = useNewEntryContext();

  useEffect(() => {
    if (data) {
      updateEntryDraft(mapTmdbMovieToEntryDraft(data));
    }
  }, [data]);

  async function onMovieSelected(result: TmdbMovieSearchResult) {
    return getMovieDetails(result.id);
  }

  if (isLoading) {
    return null;
  }

  if (data) {
    return <NewEntryForm />;
  }

  return <MovieSearch onSelect={onMovieSelected} />;
}

export { MovieImporter };
