import { Typography } from "@material-tailwind/react";
import classNames from "classnames";

import { PageLayout } from "@/components/shared/page_layout";
import { Strings } from "@/constants/strings";
import useMediaQuery from "../shared/hooks/use_media_query";

function HomePage() {
  const { isMobileBreakpoint } = useMediaQuery();

  const wrapperClassNames = classNames("flex flex-col", "mx-auto py-8 height--mite-mite", {
    "px-4": isMobileBreakpoint,
    "px-8 max-width--50": !isMobileBreakpoint,
  });

  return (
    <PageLayout>
      <div className={wrapperClassNames}>
        <div className="flex items-center justify-between mb-2">
          <Typography variant="h2">{Strings.home.title}</Typography>
        </div>

        <p className="mt-8 text-muted text-sm">{Strings.home.emptyState}</p>
      </div>
    </PageLayout>
  );
}

export { HomePage };
