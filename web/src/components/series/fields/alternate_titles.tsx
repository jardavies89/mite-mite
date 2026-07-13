import { Typography } from "@material-tailwind/react";
import { Strings } from "@/constants/strings";

interface PropTypes {
  entry: Entry;
}

function AlternateTitles({ entry }: PropTypes) {
  console.log(entry);

  if (entry.alternateTitles.length === 0) return null;

  return (
    <>
      <Typography variant="h2" className="mb-6">
        {Strings.entry.alternateTitles}
      </Typography>

      <ul className="list-none">
        {entry.alternateTitles.map((altTitle) => (
          <li>{altTitle}</li>
        ))}
      </ul>
    </>
  );
}

export { AlternateTitles };
