import { Typography } from "@material-tailwind/react";

interface PropTypes {
  title: string;
  items: string[];
}

function TextList({ title, items }: PropTypes) {
  if (items.length === 0) return null;

  return (
    <div>
      <Typography variant="h2" className="text-lg m-0">
        {title}
      </Typography>

      <ul className="flex flex-wrap gap-1 list-none list--comma-separated">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export { TextList };
