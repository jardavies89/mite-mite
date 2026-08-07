import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { Button } from "@material-tailwind/react";

import { getTmdbImages } from "@/api/imdb";
import { useNewEntryContext } from "@/components/admin/context/new_entry_context";
import { CoverImage } from "@/components/shared/cover_image";
import { Medium } from "@/constants/types";
import { Strings } from "@/constants/strings";

const TMDB_THUMB = "https://image.tmdb.org/t/p/w300";
const TMDB_FULL = "https://image.tmdb.org/t/p/w500";

interface PropTypes {
  onClose: () => void;
}

function TmdbCoverPickerModal({ onClose }: PropTypes) {
  const { newEntryDraft, updateEntryDraft } = useNewEntryContext();
  const [posters, setPosters] = useState<TmdbPosterImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { tmdbId, medium } = newEntryDraft;
  const tmdbMedium = medium === Medium.Show ? "tv" : "movie";

  useEffect(() => {
    if (!tmdbId) {
      setError(Strings.coverPicker.error);
      setIsLoading(false);
      return;
    }

    async function load() {
      try {
        const results = await getTmdbImages(tmdbId!, tmdbMedium);
        setPosters(results);
      } catch {
        setError(Strings.coverPicker.error);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [tmdbId, tmdbMedium]);

  function onSelect(poster: TmdbPosterImage) {
    updateEntryDraft({ coverImageUrl: `${TMDB_FULL}${poster.file_path}` });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-surface rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-default flex-shrink-0">
          <span className="font-medium">{Strings.coverPicker.title}</span>

          <Button
            variant="text"
            onClick={onClose}
            className="normal-case text-subtle hover:text-gray-900 dark:hover:text-white p-1"
            aria-label="Close"
          >
            <MdClose size={20} />
          </Button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-4 flex-1">
          {isLoading && (
            <p className="text-sm text-muted text-center py-8">{Strings.coverPicker.loading}</p>
          )}

          {error && <p className="text-sm text-red-500 text-center py-8">{error}</p>}

          {!isLoading && !error && posters.length === 0 && (
            <p className="text-sm text-muted text-center py-8">{Strings.coverPicker.noResults}</p>
          )}

          {!isLoading && !error && posters.length > 0 && (
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
              {posters.map((poster) => (
                <Button
                  key={poster.file_path}
                  variant="text"
                  onClick={() => onSelect(poster)}
                  className="normal-case flex flex-col gap-1 group p-0"
                >
                  <CoverImage
                    coverUrl={`${TMDB_THUMB}${poster.file_path}`}
                    title={poster.iso_639_1 ?? "Poster"}
                  />
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { TmdbCoverPickerModal };
