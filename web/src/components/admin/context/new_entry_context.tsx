import { createContext, useContext, useState } from "react";

import type { FranchiseOption } from "@/components/admin/forms/franchise_picker";
import type { Medium } from "@/components/admin/forms/entry_card";

export type ReferenceLink = {
  category: "read" | "buy" | "watch";
  url: string;
  label: string;
};

export type NewEntryFormState = {
  medium: Medium | null;
  manualMode: boolean;
  primaryTitle: string;
  alternateTitles: string[];
  coverImageUrl: string;
  genres: string[];
  tagIds: string[];
  franchise: FranchiseOption | null;
  referenceLinks: ReferenceLink[];
};

const INITIAL_STATE: NewEntryFormState = {
  medium: null,
  manualMode: false,
  primaryTitle: "",
  alternateTitles: [],
  coverImageUrl: "",
  genres: [],
  tagIds: [],
  franchise: null,
  referenceLinks: [],
};

type NewEntryContextValue = {
  newEntryDraft: NewEntryFormState;
  updateEntryDraft: (update: Partial<NewEntryFormState>) => void;
};

const NewEntryContext = createContext<NewEntryContextValue | null>(null);

function NewEntryProvider({ children }: { children: React.ReactNode }) {
  const [form, setForm] = useState<NewEntryFormState>(INITIAL_STATE);

  function patch(update: Partial<NewEntryFormState>) {
    setForm((prev) => ({ ...prev, ...update }));
  }

  return (
    <NewEntryContext.Provider value={{ newEntryDraft: form, updateEntryDraft: patch }}>
      {children}
    </NewEntryContext.Provider>
  );
}

function useNewEntryContext(): NewEntryContextValue {
  const ctx = useContext(NewEntryContext);
  if (!ctx) throw new Error("useNewEntry must be used within a NewEntryProvider");
  return ctx;
}

export { NewEntryContext, NewEntryProvider, useNewEntryContext };
export type { NewEntryContextValue };
