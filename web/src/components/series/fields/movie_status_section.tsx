import { Strings } from "@/constants/strings";

interface PropTypes {
  metadata: MovieMetadata;
}

function MovieStatusSection({ metadata }: PropTypes) {
  const { studio, releaseDate, runtime } = metadata;

  return (
    <>
      <div className="flex gap-6">
        {studio && (
          <div>
            <p className="text-sm text-muted">{Strings.metadata.studio}</p>
            <p>{studio}</p>
          </div>
        )}

        {releaseDate && (
          <div>
            <p className="text-sm text-muted">{Strings.metadata.releaseDate}</p>
            <p>{releaseDate}</p>
          </div>
        )}

        {runtime != null && (
          <div>
            <p className="text-sm text-muted">{Strings.metadata.runtimeMinutes}</p>
            <p>{runtime}</p>
          </div>
        )}
      </div>
    </>
  );
}

export { MovieStatusSection };
