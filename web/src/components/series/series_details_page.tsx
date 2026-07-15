import classNames from "classnames";
import { useParams } from "react-router-dom";

import { PageLayout } from "@/components/shared/page_layout";
import NotFound from "@/components/shared/not_found_page";
import { SeriesLayout } from "@/components/series/series_layout";

import useMediaQuery from "@/components/shared/hooks/use_media_query";
import { useGetFranchiseDetails } from "@/api/mite_mite";

function SeriesDetailsPage() {
  const { franchiseId } = useParams();
  const { isMobileBreakpoint } = useMediaQuery();
  const { franchise, isLoading, error } = useGetFranchiseDetails(franchiseId || "");
  const entry = franchise?.entries[0];

  const wrapperClassNames = classNames("flex flex-col mx-auto w-full py-8 height--mite-mite", {
    "px-4": isMobileBreakpoint,
    "px-8 max-width--50": !isMobileBreakpoint,
  });

  if (isLoading) return null;

  if (!franchise || !entry || error) {
    return <NotFound />;
  }

  return (
    <PageLayout>
      <div className={wrapperClassNames}>
        <SeriesLayout entry={entry} />
      </div>
    </PageLayout>
  );
}

export { SeriesDetailsPage };
