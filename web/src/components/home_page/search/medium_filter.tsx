import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { Button } from "@material-tailwind/react";

import { Medium } from "@/constants/types";
import { Strings } from "@/constants/strings";
import { useSearchContext } from "@/components/home_page";

const MEDIUM_OPTIONS = [Medium.Manga, Medium.Show, Medium.Movie];

const MEDIUM_LABELS: Record<string, string> = {
  [Medium.Manga]: "Manga",
  [Medium.Show]: "Show",
  [Medium.Movie]: "Movie",
};

function MediumFilter() {
  const { mediumFilter, setMediumFilter } = useSearchContext();
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

  function select(value: Medium | null) {
    setMediumFilter(value);
    setOpen(false);
  }

  const summary = mediumFilter ? MEDIUM_LABELS[mediumFilter] : Strings.filters.mediumPlaceholder;

  return (
    <div className="relative" ref={containerRef}>
      <Button
        variant="text"
        onClick={() => setOpen((o) => !o)}
        aria-label={Strings.filters.mediumPlaceholder}
        className="normal-case flex items-center justify-between rounded-md border px-3 py-2 text-left bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      >
        <span className="truncate text-sm">{summary}</span>
        {open ? (
          <MdKeyboardArrowUp className="flex-shrink-0 ml-2" />
        ) : (
          <MdKeyboardArrowDown className="flex-shrink-0 ml-2" />
        )}
      </Button>

      {open && (
        <div className="absolute top-full left-0 z-10 w-full min-w-36 rounded-md border bg-surface shadow-sm">
          <Button
            variant="text"
            onClick={() => select(null)}
            className="normal-case w-full text-left px-3 py-2 text-sm text-muted hover-surface"
          >
            {Strings.filters.anyMedium}
          </Button>
          {MEDIUM_OPTIONS.map((medium) => (
            <Button
              key={medium}
              variant="text"
              onClick={() => select(medium)}
              className="normal-case w-full text-left px-3 py-2 text-sm text-gray-900 dark:text-white hover-surface"
            >
              {MEDIUM_LABELS[medium]}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

export { MediumFilter };
