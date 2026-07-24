import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { Button } from "@material-tailwind/react";

import { useNewEntryContext } from "@/components/admin/context/new_entry_context";
import { Genres } from "@/constants/types";
import { Strings } from "@/constants/strings";

const ALL_GENRES = Object.values(Genres);

function GenreSelect() {
  const { newEntryDraft, updateEntryDraft } = useNewEntryContext();
  const { genres } = newEntryDraft;

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function toggle(genre: Genres) {
    const next = genres.includes(genre) ? genres.filter((g) => g !== genre) : [...genres, genre];
    updateEntryDraft({ genres: next });
  }

  const summary = genres.length === 0 ? "None selected" : genres.join(", ");

  return (
    <div className="flex flex-col gap-2" ref={containerRef}>
      <label>{Strings.entry.genres}</label>

      <Button
        variant="text"
        onClick={() => setOpen((o) => !o)}
        className="normal-case w-full flex items-center justify-between rounded-md border px-3 py-2 text-left bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      >
        <span className="truncate text-sm">{summary}</span>
        {open ? (
          <MdKeyboardArrowUp className="flex-shrink-0" />
        ) : (
          <MdKeyboardArrowDown className="flex-shrink-0" />
        )}
      </Button>

      {open && (
        <div className="rounded-md border bg-surface shadow-sm max-h-64 overflow-y-auto">
          {ALL_GENRES.map((genre) => (
            <label
              key={genre}
              className="flex items-center gap-3 px-3 py-2 cursor-pointer hover-surface"
            >
              <input
                type="checkbox"
                checked={genres.includes(genre)}
                onChange={() => toggle(genre)}
                className="h-4 w-4 rounded border accent-gray-900 dark:accent-white"
              />
              <span className="text-sm">{genre}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export { GenreSelect };
