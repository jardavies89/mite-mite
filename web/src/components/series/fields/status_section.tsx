import { Strings } from "@/constants/strings";

interface PropTypes {
  entry: Entry;
  metadata: MangaMetadata;
}

function StatusSection({ entry, metadata }: PropTypes) {
  const { chapterCount, endDate, startDate, volumeCount } = metadata;

  return (
    <>
      <div className="flex gap-6">
        <div>
          <p className="text-sm text-muted">{Strings.entry.status}</p>
          <p>{entry.status}</p>
        </div>

        {startDate && (
          <div>
            <p className="text-sm text-muted">{Strings.metadata.startDate}</p>
            <p>{startDate}</p>
          </div>
        )}

        {endDate && (
          <div>
            <p className="text-sm text-muted">{Strings.metadata.endDate}</p>
            <p>{endDate}</p>
          </div>
        )}
      </div>

      {(volumeCount != null || chapterCount != null) && (
        <div className="flex gap-6">
          {volumeCount != null && (
            <div>
              <p className="text-sm text-muted">{Strings.metadata.volumeCount}</p>
              <p>{volumeCount}</p>
            </div>
          )}
          {chapterCount != null && (
            <div>
              <p className="text-sm text-muted">{Strings.metadata.chapterCount}</p>
              <p>{chapterCount}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export { StatusSection };
