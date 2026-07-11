import { useEffect, useRef, useState } from "react";
import { gql, type TypedDocumentNode } from "@apollo/client/core";
import { useQuery } from "@apollo/client/react";

import getFranchisesQuery from "@/api/mite_mite/graphql/franchises.graphql?raw";

interface Franchise {
  id: string;
  primaryTitle: string;
}

type GetFranchisesData = { franchises: Franchise[] };
type GetFranchisesVars = { search?: string };

const GET_FRANCHISES: TypedDocumentNode<GetFranchisesData, GetFranchisesVars> =
  gql(getFranchisesQuery);

type SearchState = {
  results: Franchise[];
  isLoading: boolean;
  error: string | null;
};

function useGetFranchises(query: string): SearchState {
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setDebouncedQuery("");
      return;
    }

    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const { data, loading, error } = useQuery(GET_FRANCHISES, {
    variables: { search: debouncedQuery },
    skip: debouncedQuery.length < 2,
  });

  return {
    results: data?.franchises ?? [],
    isLoading: loading,
    error: error ? "search_error" : null,
  };
}

export type { Franchise };
export { useGetFranchises };
