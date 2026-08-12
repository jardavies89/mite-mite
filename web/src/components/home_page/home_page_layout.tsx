import classNames from "classnames";

import { PageLayout } from "@/components/shared/page_layout";
import { SeriesGrid } from "@/components/home_page/series_grid";
import useMediaQuery from "@/components/shared/hooks/use_media_query";

import { Strings } from "@/constants/strings";
import { useGetFranchises } from "@/api/mite_mite";
import { SearchLayout, SearchProvider, useSearchContext } from "@/components/home_page";

function HomePageContent() {
  const { isMobileBreakpoint } = useMediaQuery();
  const { query, genreFilters, tagFilters, statusFilter, mediumFilter } = useSearchContext();
  const { results: franchises, isLoading } = useGetFranchises(
    query,
    genreFilters,
    tagFilters,
    statusFilter,
    mediumFilter,
  );

  const wrapperClassNames = classNames(
    "flex flex-col w-full",
    "mx-auto py-8 shrink-0 height--mite-mite",
    {
      "px-3": isMobileBreakpoint,
      "px-8 max-width--70": !isMobileBreakpoint,
    },
  );

  return (
    <PageLayout>
      <div className={wrapperClassNames}>
        <SearchLayout />

        {!isLoading && franchises.length === 0 && (
          <p className="mt-8 text-muted text-sm">{Strings.home.emptyState}</p>
        )}

        {franchises.length > 0 && (
          <SeriesGrid franchises={franchises} mediumFilter={mediumFilter} />
        )}
      </div>
    </PageLayout>
  );
}

function HomePage() {
  return (
    <SearchProvider>
      <HomePageContent />
    </SearchProvider>
  );
}

export { HomePage };
