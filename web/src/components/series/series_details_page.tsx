import classNames from "classnames";
import { useParams } from "react-router-dom";

import { PageLayout } from "@/components/shared/page_layout";
import NotFound from "@/components/shared/not_found_page";
import { SeriesLayout } from "@/components/series/series_layout";
import { AdaptationsSection } from "@/components/series/adaptations";

import useMediaQuery from "@/components/shared/hooks/use_media_query";
import { useGetFranchiseDetails } from "@/api/mite_mite";

function SeriesDetailsPage() {
  const { franchiseId } = useParams();
  const { isMobileBreakpoint } = useMediaQuery();
  const { franchise, isLoading, error } = useGetFranchiseDetails(franchiseId || "");

  const wrapperClassNames = classNames(
    "flex flex-col mx-auto w-full py-8 shrink-0 height--mite-mite",
    {
      "px-4": isMobileBreakpoint,
      "px-8 max-width--50": !isMobileBreakpoint,
    },
  );

  if (isLoading) return null;

  if (!franchise || error) {
    return <NotFound />;
  }

  const primaryEntry = franchise.primaryEntryId
    ? (franchise.entries.find((e) => e.id === franchise.primaryEntryId) ?? franchise.entries[0])
    : franchise.entries[0];

  if (!primaryEntry) {
    return <NotFound />;
  }

  const secondaryEntries = franchise.entries.filter((e) => e.id !== primaryEntry.id);

  return (
    <PageLayout>
      <div className={wrapperClassNames}>
        <SeriesLayout entry={primaryEntry} />
        <AdaptationsSection franchiseId={franchise.id} entries={secondaryEntries} />
      </div>
    </PageLayout>
  );
}

export { SeriesDetailsPage };
