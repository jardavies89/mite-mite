import { Typography } from "@material-tailwind/react";

import { Chip } from "@/components/shared/chip";
import { Strings } from "@/constants/strings";

interface PropTypes {
  entry: Entry;
}

function TagsSection({ entry }: PropTypes) {
  if (entry.tags.length === 0) return null;

  return (
    <div>
      <Typography variant="h2" className="text-lg m-0">
        {Strings.entry.tags}
      </Typography>

      <div className="flex flex-wrap gap-2 mt-2">
        {entry.tags.map((tag) => (
          <Chip key={tag} label={tag} />
        ))}
      </div>
    </div>
  );
}

export { TagsSection };
