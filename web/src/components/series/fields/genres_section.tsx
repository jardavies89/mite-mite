import { Typography } from "@material-tailwind/react";

import { Chip } from "@/components/shared/chip";
import { Strings } from "@/constants/strings";

interface PropTypes {
  entry: Entry;
}

function GenresSection({ entry }: PropTypes) {
  if (entry.genres.length === 0) return null;

  return (
    <div>
      <Typography variant="h2" className="text-lg m-0">
        {Strings.entry.genres}
      </Typography>

      <div className="flex flex-wrap gap-2 mt-2">
        {entry.genres.map((genre) => (
          <Chip key={genre} label={genre} />
        ))}
      </div>
    </div>
  );
}

export { GenresSection };
