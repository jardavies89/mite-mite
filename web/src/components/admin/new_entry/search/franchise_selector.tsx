import { useState } from "react";

import { TextInput } from "@/components/shared/form_fields/text_input";
import { Strings } from "@/constants/strings";

function FranchiseSelector() {
  const [query, setQuery] = useState("");
  const [createNew, setCreateNew] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <TextInput
        id="franchise-selector-input"
        label={Strings.entry.franchise}
        currentValue={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={Strings.newEntry.franchisePlaceholder}
      />

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={createNew}
          onChange={(e) => setCreateNew(e.target.checked)}
          className="rounded"
        />
        {Strings.newEntry.franchiseCreateNew}
      </label>
    </div>
  );
}

export { FranchiseSelector };
