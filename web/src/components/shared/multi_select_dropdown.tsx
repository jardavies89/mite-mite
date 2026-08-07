import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { Button } from "@material-tailwind/react";

import { Strings } from "@/constants/strings";

interface Option {
  label: string;
  value: string;
}

interface OptionGroup {
  label: string;
  options: Option[];
}

interface MultiSelectDropdownProps {
  label: string;
  options?: Option[];
  groups?: OptionGroup[];
  selected: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}

function MultiSelectDropdown({
  label,
  options,
  groups,
  selected,
  onChange,
  placeholder,
}: MultiSelectDropdownProps) {
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

  function toggle(value: string) {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    onChange(next);
  }

  const displayPlaceholder = placeholder ?? Strings.filters.noneSelected;
  const summary = selected.length === 0 ? displayPlaceholder : selected.join(", ");

  function renderOption(option: Option) {
    return (
      <label
        key={option.value}
        className="flex items-center gap-3 px-3 py-2 cursor-pointer hover-surface"
      >
        <input
          type="checkbox"
          checked={selected.includes(option.value)}
          onChange={() => toggle(option.value)}
          className="h-4 w-4 rounded border accent-gray-900 dark:accent-white"
        />
        <span className="text-sm">{option.label}</span>
      </label>
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      <div className="w-full overflow-hidden">
        <Button
          variant="text"
          onClick={() => setOpen((o) => !o)}
          aria-label={label}
          className="normal-case w-full flex items-center justify-between rounded-md border px-3 py-2 text-left bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <span className="truncate min-w-0 text-sm">{summary}</span>
          {open ? (
            <MdKeyboardArrowUp className="flex-shrink-0 ml-2" />
          ) : (
            <MdKeyboardArrowDown className="flex-shrink-0 ml-2" />
          )}
        </Button>
      </div>

      {open && (
        <div className="absolute top-full left-0 z-10 w-full min-w-48 rounded-md border bg-surface shadow-sm max-h-64 overflow-y-auto">
          {groups
            ? groups.map(({ label: groupLabel, options: groupOptions }) => (
                <div key={groupLabel}>
                  <div className="px-3 py-1 text-xs font-semibold text-muted uppercase tracking-wide bg-surface sticky top-0">
                    {groupLabel}
                  </div>
                  {groupOptions.map(renderOption)}
                </div>
              ))
            : (options ?? []).map(renderOption)}
        </div>
      )}
    </div>
  );
}

export { MultiSelectDropdown };
