import { gql, type TypedDocumentNode } from "@apollo/client/core";
import { useQuery } from "@apollo/client/react";

import getFranchiseDetailsQuery from "@/api/mite_mite/graphql/franchise_details.graphql?raw";

type GetFranchiseDetailsData = { franchise: Franchise | null };
type GetFranchiseDetailsVars = { id: string };

const GET_FRANCHISE_DETAILS: TypedDocumentNode<GetFranchiseDetailsData, GetFranchiseDetailsVars> =
  gql(getFranchiseDetailsQuery);

type FranchiseDetailsState = {
  franchise: Franchise | null;
  isLoading: boolean;
  error: string | null;
};

function useGetFranchiseDetails(franchiseId: string): FranchiseDetailsState {
  const { data, loading, error } = useQuery(GET_FRANCHISE_DETAILS, {
    variables: { id: franchiseId },
    skip: !franchiseId,
  });

  return {
    franchise: data?.franchise ?? null,
    isLoading: loading,
    error: error ? "fetch_error" : null,
  };
}

export { useGetFranchiseDetails };
