import { createContext, useContext, useState } from "react";

import type { FranchiseOption } from "@/components/admin/forms/franchise_picker";
import { Genres, Medium } from "@/constants/types";

export type ReferenceLink = {
  category: "read" | "buy" | "watch";
  label: string;
  url: string;
};

export type NewEntryFormState = {
  anilistUrl: string | null;
  alternateTitles: string[];
  comments: string;
  coverImageUrl: string;
  description: string;
  franchise: FranchiseOption | null;
  genres: Genres[];
  medium: Medium | null;
  primaryTitle: string;
  referenceLinks: ReferenceLink[];
  staff: string[];
  status: string;
  tagIds: string[];
  tags: string[];
};

const INITIAL_STATE: NewEntryFormState = {
  anilistUrl: null,
  alternateTitles: [],
  comments: "",
  coverImageUrl: "",
  description: "",
  franchise: null,
  genres: [],
  medium: null,
  primaryTitle: "",
  referenceLinks: [],
  staff: [],
  status: "",
  tagIds: [],
  tags: [],
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
