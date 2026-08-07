import { createContext, useContext, useState } from "react";

import type { MangaMetadata, MovieMetadata, ShowMetadata } from "@/constants/metadata_types";
import { Genres, Medium, Status } from "@/constants/types";
import type { Tags } from "@/constants/types";

export type FranchiseOption = {
  id: string;
  name: string;
};

export type ReferenceLink = {
  category: "read" | "buy" | "watch";
  label: string;
  url: string;
};

export type NewEntryFormState = {
  alternateTitles: string[];
  comments: string;
  coverImageUrl: string;
  description: string;
  franchiseId: string;
  genres: Genres[];
  medium: Medium | null;
  metadata: MangaMetadata | ShowMetadata | MovieMetadata | null;
  newFranchiseName: string;
  primaryTitle: string;
  referenceLinks: ReferenceLink[];
  referenceUrl: string;
  staff: string[];
  status: Status;
  tagIds: Tags[];
  tags: string[];
};

const INITIAL_STATE: NewEntryFormState = {
  alternateTitles: [],
  comments: "",
  coverImageUrl: "",
  description: "",
  franchiseId: "",
  genres: [],
  medium: null,
  metadata: null,
  newFranchiseName: "",
  primaryTitle: "",
  referenceLinks: [],
  referenceUrl: "",
  staff: [],
  status: Status.Ongoing,
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
    setForm((prev) => {
      const mediumChanged = "medium" in update && update.medium !== prev.medium;
      const shouldClearMetadata = mediumChanged && !("metadata" in update);
      return { ...prev, ...update, ...(shouldClearMetadata ? { metadata: null } : {}) };
    });
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
