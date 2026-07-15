import classNames from "classnames";

import { CoverLink } from "@/components/shared/cover_link";
import useMediaQuery from "@/components/shared/hooks/use_media_query";

interface PropTypes {
  franchises: Franchise[];
}

function SeriesGrid({ franchises }: PropTypes) {
  const { isMobileBreakpoint } = useMediaQuery();

  const gridClassNames = classNames("grid gap-3", {
    "grid-cols-2": isMobileBreakpoint,
    "[grid-template-columns:repeat(auto-fit,minmax(200px,300px))]": !isMobileBreakpoint,
  });

  return (
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
  );
}

export { SeriesGrid };
