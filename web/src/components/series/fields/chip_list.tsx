import { Typography } from "@material-tailwind/react";

import { Chip } from "@/components/shared/chip";

interface PropTypes {
  title: string;
  items: string[];
}

function ChipList({ title, items }: PropTypes) {
  if (items.length === 0) return null;

  return (
    <div>
      <Typography variant="h2" className="text-lg m-0">
        {title}
      </Typography>

      <div className="flex flex-wrap gap-2 mt-2">
        {items.map((item) => (
          <Chip key={item} label={item} />
        ))}
      </div>
    </div>
  );
}

export { ChipList };
