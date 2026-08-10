import { Typography } from "@material-tailwind/react";
import Markdown from "react-markdown";

import { ChipList, TextList, StatusSection } from "@/components/series";
import { ShowStatusSection } from "@/components/series/fields/show_status_section";
import { MovieStatusSection } from "@/components/series/fields/movie_status_section";
import { Strings } from "@/constants/strings";
import { Medium } from "@/constants/types";

interface PropTypes {
  entry: Entry;
}

function EntryMetadata({ entry }: PropTypes) {
  const isManga = entry.medium === Medium.Manga;
  const isShow = entry.medium === Medium.Show;
  const isMovie = entry.medium === Medium.Movie;

  function renderPublisherInfo() {
    if (isManga) {
      const publishers = ((entry.metadata as MangaMetadata) || {}).publishers || [];
      if (publishers.length > 0) {
        return <TextList title={Strings.metadata.publishers} items={publishers} />;
      }
    }
  }

  return (
    <>
      <div className="flex flex-row gap-8 mb-4">
        {entry.coverImageUrl && (
          <img alt="cover" src={entry.coverImageUrl} className="w-64 rounded self-start" />
        )}

        <div className="flex flex-col gap-4 w-full">
          <Typography variant="h1" className="text-3xl m-0">
            {entry.primaryTitle}
          </Typography>

          <TextList title={Strings.entry.alternateTitles} items={entry.alternateTitles} />
          <TextList title={Strings.entry.staff} items={entry.staff} />

          {isManga && <StatusSection entry={entry} metadata={entry.metadata as MangaMetadata} />}
          {isShow && <ShowStatusSection entry={entry} metadata={entry.metadata as ShowMetadata} />}
          {isMovie && <MovieStatusSection metadata={entry.metadata as MovieMetadata} />}
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-4">
        <ChipList title={Strings.entry.genres} items={entry.genres} />
        <ChipList title={Strings.entry.tags} items={entry.tags} />
        {renderPublisherInfo()}
      </div>

      {entry.description && (
        <Typography variant="paragraph" className="mb-2 leading-normal">
          {entry.description}
        </Typography>
      )}

      {entry.comments && (
        <div className="prose prose-sm dark:prose-invert italic mb-2 max-w-none [&>*]:my-0">
          <Markdown>{entry.comments}</Markdown>
        </div>
      )}
    </>
  );
}

export { EntryMetadata };
