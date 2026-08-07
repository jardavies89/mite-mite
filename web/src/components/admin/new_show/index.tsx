import { Typography } from "@material-tailwind/react";
import classNames from "classnames";

import { PageLayout } from "@/components/shared/page_layout";
import { NewEntryProvider } from "@/components/admin/context/new_entry_context";
import { ShowImporter } from "@/components/admin/new_show/show_importer";
import { Strings } from "@/constants/strings";
import useMediaQuery from "@/components/shared/hooks/use_media_query";

function ShowEntryPage() {
  const { isMobileBreakpoint } = useMediaQuery();

  const wrapperClassNames = classNames("flex flex-col mx-auto py-8 w-full height--mite-mite", {
    "px-4": isMobileBreakpoint,
    "px-8 max-width--50": !isMobileBreakpoint,
  });

  return (
    <PageLayout>
      <div className={wrapperClassNames}>
        <Typography variant="h4" className="mb-6">
          {Strings.admin.addNewShow}
        </Typography>
        <NewEntryProvider>
          <ShowImporter />
        </NewEntryProvider>
      </div>
    </PageLayout>
  );
}

export default ShowEntryPage;
