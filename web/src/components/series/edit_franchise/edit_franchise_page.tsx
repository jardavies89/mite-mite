import { useParams } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import classNames from "classnames";

import { PageLayout } from "@/components/shared/page_layout";
import { Strings } from "@/constants/strings";
import useMediaQuery from "@/components/shared/hooks/use_media_query";
import NotFound from "@/components/shared/not_found_page";
import { useGetFranchiseDetails } from "@/api/mite_mite";
import { EditFranchiseForm } from "./edit_franchise_form";

function EditFranchisePage() {
  const { franchiseId } = useParams();
  const { isMobileBreakpoint } = useMediaQuery();
  const { franchise, isLoading } = useGetFranchiseDetails(franchiseId ?? "");

  const wrapperClassNames = classNames("flex flex-col mx-auto py-8 w-full height--mite-mite", {
    "px-4": isMobileBreakpoint,
    "px-8 max-width--50": !isMobileBreakpoint,
  });

  if (!franchiseId) return <NotFound />;
  if (isLoading) return null;
  if (!franchise) return <NotFound />;

  return (
    <PageLayout>
      <div className={wrapperClassNames}>
        <Typography variant="h4" className="mb-6">
          {Strings.editFranchise.pageTitle}
        </Typography>
        <EditFranchiseForm franchiseId={franchiseId} initialTitle={franchise.primaryTitle} />
      </div>
    </PageLayout>
  );
}

export default EditFranchisePage;
