import { useState } from "react";

import { Typography } from "@material-tailwind/react";
import Markdown from "react-markdown";

import { ChipList, TextList, StatusSection } from "@/components/series";
import { ShareModal } from "@/components/series/share/share_modal";
import { Strings } from "@/constants/strings";

interface PropTypes {
  entry: Entry;
}

function SeriesLayout({ entry }: PropTypes) {
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <>
      <div className="flex flex-row gap-8 mb-4">
        <img alt="cover" src={entry.coverImageUrl} className="w-64 rounded self-start" />

        <div className="flex flex-col gap-4 w-full">
          <Typography variant="h1" className="text-3xl m-0">
            {entry.primaryTitle}
          </Typography>

          <TextList title={Strings.entry.alternateTitles} items={entry.alternateTitles} />
          <TextList title={Strings.entry.staff} items={entry.staff} />
          <ChipList title={Strings.entry.genres} items={entry.genres} />
          <ChipList title={Strings.entry.tags} items={entry.tags} />
          <StatusSection entry={entry} />
        </div>
      </div>

      {entry.referenceUrl && (
        <button
          type="button"
          onClick={() => setIsShareOpen(true)}
          className="self-start text-sm text-blue-600 dark:text-blue-400 underline hover:no-underline mb-2"
        >
          {Strings.share.shareButton}
        </button>
      )}

      <Typography variant="paragraph" className="mb-2 leading-normal">
        {entry.description}
      </Typography>

      <div className="prose prose-sm dark:prose-invert italic mb-2 max-w-none [&>*]:my-0">
        <Markdown>{entry.comments}</Markdown>
      </div>

      {isShareOpen && entry.referenceUrl && (
        <ShareModal url={entry.referenceUrl} onClose={() => setIsShareOpen(false)} />
      )}
    </>
  );
}

export { SeriesLayout };
