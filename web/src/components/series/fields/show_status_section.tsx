import { Strings } from "@/constants/strings";

interface PropTypes {
  entry: Entry;
  metadata: ShowMetadata;
}

function ShowStatusSection({ entry, metadata }: PropTypes) {
  const { studio, style, startDate, endDate } = metadata;
  const styleLabel =
    style === "ANIME" ? Strings.metadata.styleAnime : Strings.metadata.styleLiveAction;

  return (
    <>
      <div className="flex gap-6">
        <div>
          <p className="text-sm text-muted">{Strings.entry.status}</p>
          <p>{entry.status}</p>
        </div>

        <div>
          <p className="text-sm text-muted">{Strings.metadata.style}</p>
          <p>{styleLabel}</p>
        </div>

        {studio && (
          <div>
            <p className="text-sm text-muted">{Strings.metadata.studio}</p>
            <p>{studio}</p>
          </div>
        )}
      </div>

      {(startDate || endDate) && (
        <div className="flex gap-6">
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
      )}
    </>
  );
}

export { ShowStatusSection };
