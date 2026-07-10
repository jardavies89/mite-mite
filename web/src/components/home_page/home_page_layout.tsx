import { Typography } from "@material-tailwind/react";
import classNames from "classnames";
import { Link } from "react-router-dom";

import { PageLayout } from "@/components/shared/page_layout";
import { Strings } from "@/constants/strings";
import useMediaQuery from "../shared/hooks/use_media_query";

const isAdmin = Boolean(import.meta.env.VITE_ADMIN_SECRET);

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

          {isAdmin && (
            <Link
              to="/admin"
              className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              {Strings.home.addEntry}
            </Link>
          )}
        </div>

        <p className="mt-8 text-muted text-sm">{Strings.home.emptyState}</p>
      </div>
    </PageLayout>
  );
}

export { HomePage };
