import { useEffect } from "react";
import { MangaSearch, NewEntryForm } from "@/components/admin/new_entry";
import { Genres, Medium, Status } from "@/constants/types";

import { useAnilistMediaDetails } from "@/components/admin/hooks/use_anilist_media_details";
import { useNewEntryContext } from "@/components/admin/context/new_entry_context";

function mapAnilistStatus(status: string | null): Status {
  switch (status) {
    case "FINISHED":
      return Status.Finished;
    case "HIATUS":
      return Status.Paused;
    case "RELEASING":
    default:
      return Status.Ongoing;
  }
}

function NewEntryImporter() {
  const { data, getMediaDetails, isLoading } = useAnilistMediaDetails();
  const { updateEntryDraft } = useNewEntryContext();

  useEffect(() => {
    if (data) {
      // TODO: Move this to a cleaner spot.
      const primaryTitle = data.title.english ?? data.title.romaji;
      const alternateTitles: string[] = [...Object.values(data.title)].filter(
        (title): title is string => !!title && title !== primaryTitle,
      );

      const validGenres = Object.values(Genres);
      const genres = data.genres
        .map((g) => validGenres.find((v) => v.toLowerCase() === g.toLowerCase()))
        .filter((g): g is Genres => g !== undefined);

      updateEntryDraft({
        alternateTitles,
        coverImageUrl: data.coverImage.large || "",
        description: data.description || "",
        genres,
        medium: Medium.Manga,
        primaryTitle: primaryTitle || "",
        referenceUrl: data.siteUrl || "",
        staff: data.staff.edges.slice(0, 5).map((e) => `${e.node.name.full} (${e.role})`),
        status: mapAnilistStatus(data.status),
        tags: data.tags.map((t) => t.name),
      });
    }
  }, [data]);

  async function onMangaSelected(result: MangaSearchResult) {
    return getMediaDetails(result.id);
  }

  if (isLoading) {
    return null;
  }

  if (data) {
    // TODO: Branching for different mediums, just manga for now
    return <NewEntryForm />;
  }

  // TODO: Add a media type picker (manga, anime, books, ect)
  // and pair it with the appropriate search.
  return <MangaSearch onSelect={onMangaSelected} />;
}

export { NewEntryImporter };
