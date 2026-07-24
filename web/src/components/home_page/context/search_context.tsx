import { createContext, useContext, useState } from "react";

import { Genres, Status } from "@/constants/types";
import type { Tags } from "@/constants/types";

interface SearchContextValue {
  query: string;
  setQuery: (query: string) => void;
  genreFilters: Genres[];
  setGenreFilters: (genres: Genres[]) => void;
  tagFilters: Tags[];
  setTagFilters: (tags: Tags[]) => void;
  statusFilter: Status | null;
  setStatusFilter: (status: Status | null) => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  const [genreFilters, setGenreFilters] = useState<Genres[]>([]);
  const [tagFilters, setTagFilters] = useState<Tags[]>([]);
  const [statusFilter, setStatusFilter] = useState<Status | null>(null);

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        genreFilters,
        setGenreFilters,
        tagFilters,
        setTagFilters,
        statusFilter,
        setStatusFilter,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

function useSearchContext(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearchContext must be used within SearchProvider");
  return ctx;
}

export { SearchProvider, useSearchContext };
