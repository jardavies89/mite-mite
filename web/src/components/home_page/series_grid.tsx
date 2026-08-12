import { CoverLink } from "@/components/shared/cover_link";

interface PropTypes {
  franchises: Franchise[];
  mediumFilter: string | null;
}

function SeriesGrid({ franchises, mediumFilter }: PropTypes) {
  function determineCoverDetails(franchise: Franchise) {
    const matchedEntry = mediumFilter
      ? franchise.entries.find((e) => e.medium === mediumFilter)
      : null;

    const href = matchedEntry
      ? `/series/${franchise.id}/entries/${matchedEntry.id}`
      : `/series/${franchise.id}`;

    const coverUrl = matchedEntry?.coverImageUrl ?? franchise.entries[0]?.coverImageUrl ?? null;

    return { href, coverUrl };
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {franchises.map((franchise) => {
        const { href, coverUrl } = determineCoverDetails(franchise);

        return (
          <CoverLink
            key={franchise.id}
            href={href}
            coverUrl={coverUrl}
            title={franchise.primaryTitle}
          />
        );
      })}
    </div>
  );
}

export { SeriesGrid };
