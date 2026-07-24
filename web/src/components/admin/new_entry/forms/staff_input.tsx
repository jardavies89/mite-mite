import { Button } from "@material-tailwind/react";

import { useNewEntryContext } from "@/components/admin/context/new_entry_context";
import { Strings } from "@/constants/strings";

function StaffInput() {
  const { newEntryDraft, updateEntryDraft } = useNewEntryContext();
  const { staff } = newEntryDraft;

  function add() {
    updateEntryDraft({ staff: [...staff, ""] });
  }

  function update(index: number, value: string) {
    const next = [...staff];
    next[index] = value;
    updateEntryDraft({ staff: next });
  }

  function remove(index: number) {
    updateEntryDraft({ staff: staff.filter((_, i) => i !== index) });
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="mb-2">{Strings.entry.staff}</label>

      {staff.map((name, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            className="w-full rounded-md border px-3 py-2"
            value={name}
            onChange={(e) => update(i, e.target.value)}
          />
          <Button
            variant="text"
            onClick={() => remove(i)}
            className="normal-case text-subtle hover:text-red-500 flex-shrink-0 text-lg leading-none p-1"
            aria-label={Strings.entry.removeStaffMember}
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
        + {Strings.entry.addStaffMember}
      </Button>
    </div>
  );
}

export { StaffInput };
