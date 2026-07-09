import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

import { useNewEntryContext } from "@/components/admin/context/new_entry_context";
import { Strings } from "@/constants/strings";

function TagsSelect() {
  const { newEntryDraft, updateEntryDraft } = useNewEntryContext();
  const { tags } = newEntryDraft;

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(() => new Set(tags));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelected(new Set(tags));
  }, [tags]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function toggle(tag: string) {
    const next = new Set(selected);
    next.has(tag) ? next.delete(tag) : next.add(tag);
    setSelected(next);
    updateEntryDraft({ tagIds: [...next] });
  }

  const summary = selected.size === 0 ? "None selected" : `${selected.size} selected`;

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-col gap-2" ref={containerRef}>
      <label>{Strings.entry.tags}</label>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between rounded-md border px-3 py-2 text-left"
      >
        <span className="truncate text-sm">{summary}</span>
        {open ? <MdKeyboardArrowUp className="flex-shrink-0" /> : <MdKeyboardArrowDown className="flex-shrink-0" />}
      </button>

      {open && (
        <div className="rounded-md border bg-surface shadow-sm max-h-64 overflow-y-auto">
          {tags.map((tag) => (
            <label
              key={tag}
              className="flex items-center gap-3 px-3 py-2 cursor-pointer hover-surface"
            >
              <input
                type="checkbox"
                checked={selected.has(tag)}
                onChange={() => toggle(tag)}
                className="h-4 w-4 rounded border accent-gray-900 dark:accent-white"
              />
              <span className="text-sm">{tag}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export { TagsSelect };
