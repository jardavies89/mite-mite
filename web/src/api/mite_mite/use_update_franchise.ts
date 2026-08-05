import { gql, type TypedDocumentNode } from "@apollo/client/core";
import { useMutation } from "@apollo/client/react";

import updateFranchiseMutation from "@/api/mite_mite/graphql/update_franchise.graphql?raw";

export interface UpdateFranchiseInput {
  primaryTitle: string;
}

type UpdateFranchiseData = {
  updateFranchise: {
    id: string;
    primaryTitle: string;
    entries: { id: string; primaryTitle: string }[];
  };
};

const UPDATE_FRANCHISE: TypedDocumentNode<
  UpdateFranchiseData,
  { id: string; input: UpdateFranchiseInput }
> = gql(updateFranchiseMutation);

export function useUpdateFranchise() {
  const [mutate, result] = useMutation(UPDATE_FRANCHISE);

  function updateFranchise(id: string, input: UpdateFranchiseInput) {
    return mutate({ variables: { id, input } });
  }

  return { updateFranchise, ...result };
}
