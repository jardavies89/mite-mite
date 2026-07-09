import { useNewEntryContext } from "@/components/admin/context/new_entry_context";
import { Strings } from "@/constants/strings";

function AlternateTitles() {
  const { newEntryDraft, updateEntryDraft } = useNewEntryContext();
  const { alternateTitles } = newEntryDraft;

  function add() {
    updateEntryDraft({ alternateTitles: [...alternateTitles, ""] });
  }

  function update(index: number, value: string) {
    const next = [...alternateTitles];
    next[index] = value;
    updateEntryDraft({ alternateTitles: next });
  }

  function remove(index: number) {
    updateEntryDraft({ alternateTitles: alternateTitles.filter((_, i) => i !== index) });
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="mb-2">{Strings.entry.alternateTitles}</label>

      {alternateTitles.map((title, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            className="w-full rounded-md border px-3 py-2"
            value={title}
            onChange={(e) => update(i, e.target.value)}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="text-subtle hover:text-red-500 flex-shrink-0 text-lg leading-none"
            aria-label={Strings.entry.removeAlternateTitle}
          >
            −
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="self-start text-sm text-blue-600 dark:text-blue-400 underline hover:no-underline"
      >
        + {Strings.entry.addAlternateTitle}
      </button>
    </div>
  );
}

export { AlternateTitles };
