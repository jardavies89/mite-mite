import classNames from "classnames";
import { Button } from "@material-tailwind/react";

interface SearchResultItemProps {
  primaryLabel: string;
  secondaryLabel?: string;
  badge?: string;
  tagline?: string;
  onSelect: () => void;
}

function SearchResultListItem({
  primaryLabel,
  secondaryLabel,
  badge,
  tagline,
  onSelect,
}: SearchResultItemProps) {
  const listItemClasses = classNames(
    "w-full text-left px-4 py-3",
    "hover-surface border-b border-default",
    "last:border-b-0 transition-colors",
  );

  return (
    <li>
      <Button
        variant="text"
        onClick={onSelect}
        className={`normal-case text-gray-900 dark:text-white ${listItemClasses}`}
      >
        <span className="block font-medium">{primaryLabel}</span>

        <span className="flex gap-3 mt-0.5 items-center text-sm text-muted">
          {secondaryLabel && <span>{secondaryLabel}</span>}

          {badge && <span className="uppercase tracking-wide text-xs font-semibold">{badge}</span>}

          {tagline && <span>{tagline}</span>}
        </span>
      </Button>
    </li>
  );
}

export { SearchResultListItem };
