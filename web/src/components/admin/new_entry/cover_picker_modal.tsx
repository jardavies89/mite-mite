import { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";

import { getCovers, searchMangaCandidates } from "@/api/mangadex";
import type { MangadexCover, MangadexSearchResult } from "@/api/mangadex";
import { useNewEntryContext } from "@/components/admin/context/new_entry_context";
import { CoverImage } from "@/components/shared/cover_image";
import { Strings, translate } from "@/constants/strings";

interface PropTypes {
  title: string;
  onClose: () => void;
}

function CoverPickerModal({ title, onClose }: PropTypes) {
  const { updateEntryDraft } = useNewEntryContext();

  const [candidates, setCandidates] = useState<MangadexSearchResult[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [matchedTitle, setMatchedTitle] = useState<string | null>(null);
  const [covers, setCovers] = useState<MangadexCover[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllLocales, setShowAllLocales] = useState(false);
  const [showCandidates, setShowCandidates] = useState(false);
  const [showManualSearch, setShowManualSearch] = useState(false);
  const [manualQuery, setManualQuery] = useState("");

  const candidatesPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const results = await searchMangaCandidates(title, 5);
        setCandidates(results);
        if (results.length === 0) {
          setShowManualSearch(true);
          setIsLoading(false);
          return;
        }
        const first = results[0];
        setSelectedId(first.id);
        setMatchedTitle(first.title);
        const fetched = await getCovers(first.id);
        setCovers(fetched);
      } catch {
        setError(Strings.coverPicker.error);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [title]);

  useEffect(() => {
    if (!showCandidates) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setShowCandidates(false);
    }
    function handleClickOutside(e: MouseEvent) {
      if (candidatesPanelRef.current && !candidatesPanelRef.current.contains(e.target as Node)) {
        setShowCandidates(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCandidates]);

  async function selectCandidate(candidate: MangadexSearchResult) {
    setShowCandidates(false);
    setSelectedId(candidate.id);
    setMatchedTitle(candidate.title);
    setCovers([]);
    setIsLoading(true);
    setError(null);
    try {
      const fetched = await getCovers(candidate.id);
      setCovers(fetched);
    } catch {
      setError(Strings.coverPicker.error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleManualSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!manualQuery.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const results = await searchMangaCandidates(manualQuery, 5);
      setCandidates(results);
      setShowCandidates(true);
      setShowManualSearch(false);
    } catch {
      setError(Strings.coverPicker.error);
    } finally {
      setIsLoading(false);
    }
  }

  function openSearchInstead() {
    setManualQuery(title);
    setShowCandidates(false);
    setShowManualSearch(true);
  }

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
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-default flex-shrink-0">
          <div className="flex flex-col">
            <span className="font-medium">{Strings.coverPicker.title}</span>
            {matchedTitle && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">
                  {translate(Strings.coverPicker.matchedTitle, { title: matchedTitle })}
                </span>
                {candidates.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setShowCandidates((v) => !v)}
                    className="text-xs text-blue-500 hover:underline"
                  >
                    {Strings.search.wrongTitle}
                  </button>
                )}
              </div>
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
              {Strings.coverPicker.showAllRegions}
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

        {/* Candidate list panel */}
        {showCandidates && (
          <div
            ref={candidatesPanelRef}
            className="absolute top-[60px] left-4 z-10 bg-surface border border-default rounded-lg shadow-lg w-72 py-2"
          >
            <p className="px-3 pb-1 text-xs font-medium text-muted">{Strings.search.changeManga}</p>
            <ul>
              {candidates.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => selectCandidate(c)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-default truncate"
                  >
                    {c.title}
                  </button>
                </li>
              ))}
            </ul>
            <div className="border-t border-default mt-1 pt-1">
              <button
                type="button"
                onClick={openSearchInstead}
                className="w-full text-left px-3 py-2 text-xs text-blue-500 hover:underline"
              >
                {Strings.search.searchInstead}
              </button>
            </div>
          </div>
        )}

        {/* Body */}
        <div className="overflow-y-auto p-4 flex-1">
          {isLoading && (
            <p className="text-sm text-muted text-center py-8">{Strings.coverPicker.loading}</p>
          )}

          {error && <p className="text-sm text-red-500 text-center py-8">{error}</p>}

          {!isLoading && !error && showManualSearch && (
            <form
              onSubmit={handleManualSearch}
              className="flex flex-col gap-3 py-4 max-w-sm mx-auto"
            >
              <label className="text-sm font-medium">{Strings.search.searchLabel}</label>
              <input
                type="text"
                value={manualQuery}
                onChange={(e) => setManualQuery(e.target.value)}
                placeholder={Strings.search.searchPlaceholder}
                className="border border-default rounded px-3 py-2 text-sm bg-surface"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded"
              >
                {Strings.search.searchSubmit}
              </button>
            </form>
          )}

          {!isLoading && !error && !showManualSearch && displayed.length === 0 && selectedId && (
            <p className="text-sm text-muted text-center py-8">
              {showAllLocales
                ? Strings.coverPicker.noResults
                : Strings.coverPicker.noResultsJapanese}
            </p>
          )}

          {!isLoading && !error && !showManualSearch && displayed.length > 0 && (
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
              {displayed.map((cover) => (
                <button
                  key={cover.id}
                  type="button"
                  onClick={() => onSelect(cover)}
                  className="flex flex-col gap-1 group"
                >
                  <CoverImage
                    coverUrl={cover.thumbUrl}
                    title={cover.volume ? `Volume ${cover.volume}` : "Cover"}
                  />
                  {cover.volume && (
                    <span className="text-xs text-muted text-center w-full truncate">
                      {translate(Strings.coverPicker.volumeLabel, { n: cover.volume })}
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
