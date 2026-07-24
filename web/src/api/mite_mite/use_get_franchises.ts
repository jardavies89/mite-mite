import { useEffect, useRef, useState } from "react";
import { gql, type TypedDocumentNode } from "@apollo/client/core";
import { useQuery } from "@apollo/client/react";

import getFranchisesQuery from "@/api/mite_mite/graphql/franchises.graphql?raw";

type GetFranchisesData = { franchises: Franchise[] };
type GetFranchisesVars = {
  search?: string;
  genres?: string[];
  tags?: string[];
  status?: string;
};

const GET_FRANCHISES: TypedDocumentNode<GetFranchisesData, GetFranchisesVars> =
  gql(getFranchisesQuery);

type FranchisesState = {
  results: Franchise[];
  isLoading: boolean;
  error: string | null;
};

function useGetFranchises(
  query: string = "",
  genres: string[] = [],
  tags: string[] = [],
  status: string | null = null,
): FranchisesState {
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

  const variables: GetFranchisesVars = {};
  if (debouncedQuery) variables.search = debouncedQuery;
  if (genres.length > 0) variables.genres = genres;
  if (tags.length > 0) variables.tags = tags;
  if (status) variables.status = status;

  const { data, loading, error } = useQuery(GET_FRANCHISES, { variables });

  return {
    results: data?.franchises ?? [],
    isLoading: loading,
    error: error ? "search_error" : null,
  };
}

export { useGetFranchises };
