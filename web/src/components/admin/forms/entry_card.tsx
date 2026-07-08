import { Typography } from "@material-tailwind/react";
import classNames from "classnames";

import { Strings } from "@/constants/strings";

type Medium = "manga" | "book" | "movie_show";

type EntryCardProps = {
  primaryTitle: string;
  medium: Medium;
  coverImageUrl?: string;
  franchiseName?: string;
};

const MEDIUM_LABELS: Record<Medium, string> = {
  manga: "Manga",
  book: "Book",
  movie_show: "Movie / Show",
};

const MEDIUM_BADGE_COLORS: Record<Medium, string> = {
  manga: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  book: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  movie_show: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

function EntryCard({ primaryTitle, medium, coverImageUrl, franchiseName }: EntryCardProps) {
  return (
    <div className="flex gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <div
        className={classNames(
          "flex-shrink-0 w-14 h-20 rounded overflow-hidden bg-gray-100 dark:bg-gray-700",
        )}
      >
        {coverImageUrl ? (
          <img src={coverImageUrl} alt={primaryTitle} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600 text-xs text-center px-1">
            {Strings.entry.noCover}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 min-w-0">
        <Typography
          variant="small"
          className="font-semibold text-gray-900 dark:text-white leading-tight truncate"
        >
          {primaryTitle}
        </Typography>

        <span
          className={classNames(
            "inline-block self-start px-2 py-0.5 rounded text-xs font-medium",
            MEDIUM_BADGE_COLORS[medium],
          )}
        >
          {MEDIUM_LABELS[medium]}
        </span>

        {franchiseName && (
          <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs truncate">
            {franchiseName}
          </Typography>
        )}
      </div>
    </div>
  );
}

export { EntryCard };
export type { EntryCardProps, Medium };
