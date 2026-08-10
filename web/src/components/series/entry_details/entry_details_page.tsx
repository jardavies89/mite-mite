import classNames from "classnames";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import { FaArrowLeft } from "react-icons/fa";

import { PageLayout } from "@/components/shared/page_layout";
import NotFound from "@/components/shared/not_found_page";
import useMediaQuery from "@/components/shared/hooks/use_media_query";
import { useGetFranchiseDetails } from "@/api/mite_mite";
import { Strings } from "@/constants/strings";

import { EntryMetadata } from "./entry_metadata";

function EntryDetailsPage() {
  const { franchiseId, entryId } = useParams();
  const navigate = useNavigate();
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

  const entry = franchise.entries.find((e) => e.id === entryId);

  if (!entry) {
    return <NotFound />;
  }

  return (
    <PageLayout>
      <div className={wrapperClassNames}>
        <div className="mb-4">
          <Button
            variant="text"
            className="normal-case text-subtle hover:text-gray-900 dark:hover:text-white p-1 flex items-center gap-2"
            onClick={() => navigate(`/series/${franchiseId}`)}
          >
            <FaArrowLeft size={14} />
            {Strings.entryDetails.backButton}
          </Button>
        </div>
        <EntryMetadata entry={entry} />
      </div>
    </PageLayout>
  );
}

export { EntryDetailsPage };
