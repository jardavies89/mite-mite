import { useEffect, useRef, useState } from "react";
import { gql, type TypedDocumentNode } from "@apollo/client/core";
import { useQuery } from "@apollo/client/react";

import getFranchisesQuery from "@/api/mite_mite/graphql/franchises.graphql?raw";

type GetFranchisesData = { franchises: Franchise[] };
type GetFranchisesVars = { search?: string };

const GET_FRANCHISES: TypedDocumentNode<GetFranchisesData, GetFranchisesVars> =
  gql(getFranchisesQuery);

type FranchisesState = {
  results: Franchise[];
  isLoading: boolean;
  error: string | null;
};

function useGetFranchises(query: string = ""): FranchisesState {
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const { data, loading, error } = useQuery(GET_FRANCHISES, {
    variables: debouncedQuery ? { search: debouncedQuery } : {},
  });

  return {
    results: data?.franchises ?? [],
    isLoading: loading,
    error: error ? "search_error" : null,
  };
}

export { useGetFranchises };
