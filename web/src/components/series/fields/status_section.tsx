import { Typography } from "@material-tailwind/react";
import { Strings } from "@/constants/strings";

interface PropTypes {
  entry: Entry;
}

function StatusSection({ entry }: PropTypes) {
  return (
    <div>
      <Typography variant="h2" className="text-lg m-0">
        {Strings.entry.status}
      </Typography>

      <p>{entry.status}</p>
    </div>
  );
}

export { StatusSection };
