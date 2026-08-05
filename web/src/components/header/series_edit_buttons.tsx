import { Button } from "@material-tailwind/react";

import { Strings } from "@/constants/strings";
import { useGetFranchiseDetails } from "@/api/mite_mite";

function SeriesEditButtons({ franchiseId }: { franchiseId: string }) {
  const { franchise } = useGetFranchiseDetails(franchiseId);
  const entryId = franchise?.entries[0]?.id;

  if (!franchise) return null;

  return (
    <>
      <a href={`/series/${franchiseId}/edit`}>
        <Button variant="text" className="normal-case text-gray-900 dark:text-white">
          {Strings.editFranchise.editSeriesButton}
        </Button>
      </a>
      {entryId && (
        <a href={`/series/${franchiseId}/edit/${entryId}`}>
          <Button variant="text" className="normal-case text-gray-900 dark:text-white">
            {Strings.editFranchise.editEntryButton}
          </Button>
        </a>
      )}
    </>
  );
}

export { SeriesEditButtons };
