import { Typography } from "@material-tailwind/react";
import classNames from "classnames";
import { useParams } from "react-router-dom";

import { PageLayout } from "@/components/shared/page_layout";
import NotFound from "@/components/shared/not_found_page";

import useMediaQuery from "@/components/shared/hooks/use_media_query";
import { useGetFranchiseDetails } from "@/api/mite_mite";

// import { Strings } from "@/constants/strings";

function SeriesDetailsPage() {
  const { franchiseId } = useParams();
  const { isMobileBreakpoint } = useMediaQuery();
  const { franchise, isLoading, error } = useGetFranchiseDetails(franchiseId || "");

  const wrapperClassNames = classNames("flex flex-col mx-auto w-full py-8 height--mite-mite", {
    "px-4": isMobileBreakpoint,
    "px-8 max-width--50": !isMobileBreakpoint,
  });

  if (isLoading) return null;

  if (!franchise || error) {
    return <NotFound />;
  }

  return (
    <PageLayout>
      <div className={wrapperClassNames}>
        <Typography variant="h1" className="mb-6">
          {franchise.primaryTitle}
        </Typography>

        <div className="flex flex-col gap-3">Body</div>
      </div>
    </PageLayout>
  );
}

export { SeriesDetailsPage };
