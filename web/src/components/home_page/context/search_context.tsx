import { createContext, useContext, useState } from "react";

import { Status } from "@/constants/types";

interface SearchContextValue {
  query: string;
  setQuery: (query: string) => void;
  genreFilters: string[];
  setGenreFilters: (genres: string[]) => void;
  tagFilters: string[];
  setTagFilters: (tags: string[]) => void;
  statusFilter: Status | null;
  setStatusFilter: (status: Status | null) => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  const [genreFilters, setGenreFilters] = useState<string[]>([]);
  const [tagFilters, setTagFilters] = useState<string[]>([]);
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
