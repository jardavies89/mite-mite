import classNames from "classnames";

import { PageLayout } from "@/components/shared/page_layout";
import { SeriesGrid } from "@/components/home_page/series_grid";
import useMediaQuery from "@/components/shared/hooks/use_media_query";

import { Strings } from "@/constants/strings";
import { useGetFranchises } from "@/api/mite_mite";
import { SearchLayout, SearchProvider, useSearchContext } from "@/components/home_page";

function HomePageContent() {
  const { isMobileBreakpoint } = useMediaQuery();
  const { query, genreFilters, tagFilters, statusFilter } = useSearchContext();
  const { results: franchises, isLoading } = useGetFranchises(query);

  const filteredFranchises = franchises.filter((franchise) => {
    const primaryEntry = franchise.entries.find((e) => e.id === franchise.primaryEntryId);
    if (!primaryEntry) return false;
    if (genreFilters.length > 0 && !genreFilters.every((g) => primaryEntry.genres.includes(g)))
      return false;
    if (tagFilters.length > 0 && !tagFilters.every((t) => primaryEntry.tags.includes(t)))
      return false;
    if (statusFilter !== null && primaryEntry.status !== statusFilter) return false;
    return true;
  });

  const wrapperClassNames = classNames("flex flex-col w-full", "mx-auto py-8 height--mite-mite", {
    "px-3": isMobileBreakpoint,
    "px-8 max-width--70": !isMobileBreakpoint,
  });

  return (
    <PageLayout>
      <div className={wrapperClassNames}>
        <SearchLayout />

        {!isLoading && filteredFranchises.length === 0 && (
          <p className="mt-8 text-muted text-sm">{Strings.home.emptyState}</p>
        )}

        {filteredFranchises.length > 0 && <SeriesGrid franchises={filteredFranchises} />}
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
