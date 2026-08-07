import { useState } from "react";

import { Button, Typography } from "@material-tailwind/react";
import { FaShareAlt } from "react-icons/fa";
import Markdown from "react-markdown";

import { ChipList, TextList, StatusSection } from "@/components/series";
import { ShareModal } from "@/components/series/share/share_modal";
import { Strings } from "@/constants/strings";
import { Medium } from "@/constants/types";

interface PropTypes {
  entry: Entry;
}

function SeriesLayout({ entry }: PropTypes) {
  const [isShareOpen, setIsShareOpen] = useState(false);

  const isManga = entry.medium === Medium.Manga;
  const metadata = isManga ? (entry.metadata as MangaMetadata) : (entry.metadata as ShowMetadata);

  function maybeRenderShareButton() {
    if (entry.referenceUrl) {
      return (
        <Button
          variant="text"
          size="sm"
          onClick={() => setIsShareOpen(true)}
          className="normal-case text-subtle hover:text-gray-900 dark:hover:text-white p-1"
          aria-label={Strings.share.shareButton}
        >
          <FaShareAlt size={16} />
        </Button>
      );
    }
  }

  function renderPublisherInfo() {
    if (isManga) {
      const publishers = (metadata as MangaMetadata).publishers || [];

      if (publishers.length > 0) {
        return <TextList title={Strings.metadata.publishers} items={publishers} />;
      }
    }
  }

  return (
    <>
      <div className="flex flex-row gap-8 mb-4">
        <img alt="cover" src={entry.coverImageUrl} className="w-64 rounded self-start" />

        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-row justify-between">
            <Typography variant="h1" className="text-3xl m-0">
              {entry.primaryTitle}
            </Typography>

            {maybeRenderShareButton()}
          </div>

          <TextList title={Strings.entry.alternateTitles} items={entry.alternateTitles} />
          <TextList title={Strings.entry.staff} items={entry.staff} />

          <StatusSection entry={entry} metadata={isManga ? metadata : {}} />
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-4">
        <ChipList title={Strings.entry.genres} items={entry.genres} />
        <ChipList title={Strings.entry.tags} items={entry.tags} />

        {renderPublisherInfo()}
      </div>

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
