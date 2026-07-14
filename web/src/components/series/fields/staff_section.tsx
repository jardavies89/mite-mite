import { Typography } from "@material-tailwind/react";
import { Strings } from "@/constants/strings";

interface PropTypes {
  entry: Entry;
}

function StaffSection({ entry }: PropTypes) {
  if (entry.staff.length === 0) return null;

  return (
    <div>
      <Typography variant="h2" className="text-lg m-0">
        {Strings.entry.staff}
      </Typography>

      <ul className="flex flex-wrap gap-1 list-none list--comma-separated">
        {entry.staff.map((staffMember) => (
          <li key={staffMember}>{staffMember}</li>
        ))}
      </ul>
    </div>
  );
}

export { StaffSection };
