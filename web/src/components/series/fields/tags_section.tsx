import { Typography } from "@material-tailwind/react";
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

      <ul className="flex flex-wrap gap-1 list-none list--comma-separated">
        {entry.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </div>
  );
}

export { TagsSection };
