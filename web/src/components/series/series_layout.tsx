import { Typography } from "@material-tailwind/react";
import Markdown from "react-markdown";

import {
  AlternateTitles,
  GenresSection,
  StaffSection,
  StatusSection,
  TagsSection,
} from "@/components/series";
import { Strings } from "@/constants/strings";

interface PropTypes {
  entry: Entry;
}

function SeriesLayout({ entry }: PropTypes) {
  return (
    <>
      <div className="flex flex-row gap-8 mb-4">
        <img alt="cover" src={entry.coverImageUrl} className="w-64 rounded" />

        <div className="flex flex-col gap-4 w-full">
          <Typography variant="h1" className="text-3xl m-0">
            {entry.primaryTitle}
          </Typography>

          <AlternateTitles entry={entry} />
          <StaffSection entry={entry} />
          <GenresSection entry={entry} />
          <TagsSection entry={entry} />
          <StatusSection entry={entry} />
        </div>
      </div>

      <Typography variant="paragraph" className="mb-2 leading-normal">
        {entry.description}
      </Typography>

      <div className="prose prose-sm dark:prose-invert italic mb-2 max-w-none [&>*]:my-0">
        <Markdown>{entry.comments}</Markdown>
      </div>

      {entry.referenceUrl && (
        <a
          href={entry.referenceUrl}
          target="_blank"
          rel="noreferrer"
          className="self-start text-sm text-blue-600 dark:text-blue-400 underline hover:no-underline mt-2"
        >
          {Strings.entry.anilistSource}
        </a>
      )}
    </>
  );
}

export { SeriesLayout };
