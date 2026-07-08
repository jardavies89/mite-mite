import { useEffect, useRef, useState } from "react";
import { Input, Typography } from "@material-tailwind/react";
import classNames from "classnames";

import { Strings, translate } from "@/constants/strings";

export type FranchiseOption = {
  id: string;
  name: string;
};

const MOCK_FRANCHISES: FranchiseOption[] = [
  { id: "1", name: "One Piece" },
  { id: "2", name: "Naruto" },
  { id: "3", name: "Attack on Titan" },
  { id: "4", name: "Fullmetal Alchemist" },
  { id: "5", name: "Dungeon Meshi" },
  { id: "6", name: "Berserk" },
  { id: "7", name: "Gundam" },
  { id: "8", name: "Dragon Ball" },
];

type FranchisePickerProps = {
  value: FranchiseOption | null;
  onChange: (value: FranchiseOption | null) => void;
  franchises?: FranchiseOption[];
};

function FranchisePicker({
  value,
  onChange,
  franchises = MOCK_FRANCHISES,
}: FranchisePickerProps) {
  const [query, setQuery] = useState(value?.name ?? "");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value?.name ?? "");
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        if (!value) setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  const filtered = query.trim()
    ? franchises.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()))
    : franchises;

  const showCreateNew =
    query.trim().length > 0 &&
    !franchises.some((f) => f.name.toLowerCase() === query.trim().toLowerCase());

  function handleSelect(option: FranchiseOption) {
    onChange(option);
    setQuery(option.name);
    setOpen(false);
  }

  function handleCreateNew() {
    const newFranchise: FranchiseOption = { id: `new:${query.trim()}`, name: query.trim() };
    onChange(newFranchise);
    setOpen(false);
  }

  function handleClear() {
    onChange(null);
    setQuery("");
    setOpen(false);
  }

  const dropdownVisible = open && (filtered.length > 0 || showCreateNew);

  return (
    <div ref={containerRef} className="relative">
      <Input
        label={Strings.entry.franchise}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={Strings.entry.franchiseSearchPlaceholder}
      />

      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg leading-none"
          aria-label="Clear franchise"
        >
          ×
        </button>
      )}

      {dropdownVisible && (
        <ul className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg max-h-56 overflow-y-auto">
          {filtered.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(option);
                }}
                className={classNames(
                  "w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700",
                  "text-gray-900 dark:text-gray-100",
                  value?.id === option.id && "font-semibold bg-blue-50 dark:bg-blue-900/20",
                )}
              >
                {option.name}
              </button>
            </li>
          ))}

          {showCreateNew && (
            <li>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleCreateNew();
                }}
                className="w-full text-left px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
              >
                {translate(Strings.entry.franchiseCreateNew, { name: query.trim() })}
              </button>
            </li>
          )}
        </ul>
      )}

      {value?.id.startsWith("new:") && (
        <Typography variant="small" className="mt-1 text-blue-600 dark:text-blue-400 text-xs">
          {Strings.entry.franchiseWillBeCreated}
        </Typography>
      )}
    </div>
  );
}

export { FranchisePicker };
