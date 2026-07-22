import { CoverLink } from "@/components/shared/cover_link";

interface PropTypes {
  franchises: Franchise[];
}

function SeriesGrid({ franchises }: PropTypes) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
