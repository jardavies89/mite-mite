import { Typography } from "@material-tailwind/react";

import { Strings } from "@/constants/strings";

import { AdaptationRow } from "./adaptation_row";

interface PropTypes {
  franchiseId: string;
  entries: Entry[];
}

function AdaptationsSection({ franchiseId, entries }: PropTypes) {
  if (entries.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 mt-4">
      <Typography variant="h2" className="text-xl">
        {Strings.adaptations.heading}
      </Typography>
      <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700">
        {entries.map((entry) => (
          <AdaptationRow key={entry.id} franchiseId={franchiseId} entry={entry} />
        ))}
      </div>
    </div>
  );
}

export { AdaptationsSection };
