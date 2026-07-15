import { Typography } from "@material-tailwind/react";
import classNames from "classnames";

import { PageLayout } from "@/components/shared/page_layout";
import { CoverLink } from "@/components/shared/cover_link";
import { Strings } from "@/constants/strings";
import { useGetFranchises } from "@/api/mite_mite";
import useMediaQuery from "../shared/hooks/use_media_query";

function HomePage() {
  const { isMobileBreakpoint } = useMediaQuery();
  const { results: franchises, isLoading } = useGetFranchises();

  const wrapperClassNames = classNames("flex flex-col w-full", "mx-auto py-8 height--mite-mite", {
    "px-3": isMobileBreakpoint,
    "px-8 max-width--70": !isMobileBreakpoint,
  });

  const gridClassNames = classNames("grid gap-3", {
    "grid-cols-2": isMobileBreakpoint,
    "[grid-template-columns:repeat(auto-fit,minmax(200px,300px))]": !isMobileBreakpoint,
  });

  return (
    <PageLayout>
      <div className={wrapperClassNames}>
        <div className="flex items-center justify-between mb-6">
          <Typography variant="h2">{Strings.home.title}</Typography>
        </div>

        {!isLoading && franchises.length === 0 && (
          <p className="mt-8 text-muted text-sm">{Strings.home.emptyState}</p>
        )}

        {!isLoading && franchises.length > 0 && (
          <div className={gridClassNames}>
            {franchises.map((franchise) => (
              <CoverLink
                key={franchise.id}
                href={`/series/${franchise.id}`}
                coverUrl={franchise.entries[0]?.coverImageUrl ?? null}
                title={franchise.primaryTitle}
              />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

export { HomePage };
