import { Button } from "@material-tailwind/react";

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
          <Button
            variant="text"
            onClick={() => remove(i)}
            className="normal-case text-subtle hover:text-red-500 flex-shrink-0 text-lg leading-none p-1"
            aria-label={Strings.entry.removeAlternateTitle}
          >
            −
          </Button>
        </div>
      ))}

      <Button
        variant="text"
        color="blue"
        onClick={add}
        className="normal-case self-start text-sm underline hover:no-underline p-0"
      >
        + {Strings.entry.addAlternateTitle}
      </Button>
    </div>
  );
}

export { AlternateTitles };
