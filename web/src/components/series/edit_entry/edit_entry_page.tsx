import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import classNames from "classnames";

import { PageLayout } from "@/components/shared/page_layout";
import { Strings } from "@/constants/strings";
import useMediaQuery from "@/components/shared/hooks/use_media_query";
import NotFound from "@/components/shared/not_found_page";
import { NewEntryProvider, useNewEntryContext } from "@/components/admin/context/new_entry_context";
import { useGetFranchiseDetails } from "@/api/mite_mite";
import { Genres, Medium, Status } from "@/constants/types";
import type { Tags } from "@/constants/types";
import { EditEntryForm } from "./edit_entry_form";

export function EditEntryLoader({
  franchiseId,
  entryId,
}: {
  franchiseId: string;
  entryId: string;
}) {
  const { franchise, isLoading } = useGetFranchiseDetails(franchiseId);
  const { updateEntryDraft } = useNewEntryContext();

  const entry = franchise?.entries.find((e) => e.id === entryId);

  useEffect(() => {
    if (!entry) return;

    const validGenres = Object.values(Genres);
    const validTags = [...Object.values(Status)];
    void validTags;

    updateEntryDraft({
      primaryTitle: entry.primaryTitle,
      alternateTitles: entry.alternateTitles,
      coverImageUrl: entry.coverImageUrl ?? "",
      description: entry.description ?? "",
      comments: entry.comments ?? "",
      genres: entry.genres.filter((g): g is Genres => validGenres.includes(g as Genres)),
      tagIds: entry.tags as Tags[],
      staff: entry.staff,
      status: (entry.status as Status) ?? Status.Ongoing,
      referenceUrl: entry.referenceUrl ?? "",
      medium: entry.medium as Medium,
      metadata: (entry.metadata as MangaMetadata | ShowMetadata | MovieMetadata | null) ?? null,
      franchiseId: franchise?.id ?? "",
    });
  }, [entry?.id]);

  if (isLoading) return null;
  if (!franchise || !entry) return <NotFound />;

  return <EditEntryForm franchiseId={franchiseId} entryId={entryId} />;
}

function EditEntryPage() {
  const { franchiseId, entryId } = useParams();
  const { isMobileBreakpoint } = useMediaQuery();

  const wrapperClassNames = classNames("flex flex-col mx-auto py-8 w-full height--mite-mite", {
    "px-4": isMobileBreakpoint,
    "px-8 max-width--50": !isMobileBreakpoint,
  });

  if (!franchiseId || !entryId) return <NotFound />;

  return (
    <PageLayout>
      <div className={wrapperClassNames}>
        <Typography variant="h4" className="mb-6">
          {Strings.editEntry.pageTitle}
        </Typography>
        <NewEntryProvider>
          <EditEntryLoader franchiseId={franchiseId} entryId={entryId} />
        </NewEntryProvider>
      </div>
    </PageLayout>
  );
}

export default EditEntryPage;
