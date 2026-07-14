import { Typography } from "@material-tailwind/react";
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

      <ul className="flex flex-wrap gap-1 list-none list--comma-separated">
        {entry.genres.map((genre) => (
          <li key={genre}>{genre}</li>
        ))}
      </ul>
    </div>
  );
}

export { GenresSection };
