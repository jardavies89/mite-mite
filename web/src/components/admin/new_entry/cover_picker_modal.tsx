import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";

import { getCovers, searchManga } from "@/api/mangadex";
import type { MangadexCover } from "@/api/mangadex";
import { useNewEntryContext } from "@/components/admin/context/new_entry_context";

interface PropTypes {
  title: string;
  onClose: () => void;
}

function CoverPickerModal({ title, onClose }: PropTypes) {
  const { updateEntryDraft } = useNewEntryContext();

  const [matchedTitle, setMatchedTitle] = useState<string | null>(null);
  const [covers, setCovers] = useState<MangadexCover[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllLocales, setShowAllLocales] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const result = await searchManga(title);
        if (!result) {
          setError("No matching title found on MangaDex.");
          return;
        }
        setMatchedTitle(result.title);
        const fetched = await getCovers(result.id);
        setCovers(fetched);
      } catch {
        setError("Couldn't load covers from MangaDex.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [title]);

  function onSelect(cover: MangadexCover) {
    updateEntryDraft({ coverImageUrl: cover.url });
    onClose();
  }

  const displayed = showAllLocales
    ? covers
    : covers.filter((c) => c.locale === "ja" || c.locale === null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-surface rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col mx-4">
        <div className="flex items-center justify-between px-4 py-3 border-b border-default flex-shrink-0">
          <div className="flex flex-col">
            <span className="font-medium">Choose cover image</span>
            {matchedTitle && (
              <span className="text-xs text-muted">Showing covers for: {matchedTitle}</span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showAllLocales}
                onChange={(e) => setShowAllLocales(e.target.checked)}
                className="h-4 w-4 rounded border accent-gray-900 dark:accent-white"
              />
              Show all regions
            </label>

            <button
              type="button"
              onClick={onClose}
              className="text-subtle hover:text-gray-900 dark:hover:text-white"
              aria-label="Close"
            >
              <MdClose size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-4 flex-1">
          {isLoading && (
            <p className="text-sm text-muted text-center py-8">Loading covers...</p>
          )}

          {error && (
            <p className="text-sm text-red-500 text-center py-8">{error}</p>
          )}

          {!isLoading && !error && displayed.length === 0 && (
            <p className="text-sm text-muted text-center py-8">
              No covers found{!showAllLocales ? " for Japanese region — try showing all regions" : ""}.
            </p>
          )}

          {!isLoading && !error && displayed.length > 0 && (
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
              {displayed.map((cover) => (
                <button
                  key={cover.id}
                  type="button"
                  onClick={() => onSelect(cover)}
                  className="flex flex-col gap-1 group"
                >
                  <img
                    src={cover.thumbUrl}
                    alt={cover.volume ? `Volume ${cover.volume}` : "Cover"}
                    className="w-full rounded border border-default group-hover:border-gray-500 dark:group-hover:border-gray-300 transition-colors object-cover"
                  />
                  {cover.volume && (
                    <span className="text-xs text-muted text-center w-full truncate">
                      Vol. {cover.volume}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { CoverPickerModal };
