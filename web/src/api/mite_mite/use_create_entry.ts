import { gql, type TypedDocumentNode } from "@apollo/client/core";
import { useMutation } from "@apollo/client/react";

import createEntryMutation from "@/api/mite_mite/graphql/entries.graphql?raw";
import type { Medium, Status } from "@/constants/types";

export interface CreateEntryInput {
  alternateTitles?: string[];
  comments?: string;
  coverImageUrl?: string;
  description?: string;
  // The mutation needs either an existing franchiseId
  franchiseId?: string;
  genres?: string[];
  medium: Medium;
  // Or the new franchise title
  newFranchiseName?: string;
  primaryTitle: string;
  referenceUrl?: string;
  staff?: string[];
  status?: Status;
  tags?: string[];
}

export interface Entry {
  alternateTitles: string[];
  comments: string | null;
  coverImageUrl: string | null;
  createdAt: string;
  description: string | null;
  franchise: { id: string; primaryTitle: string } | null;
  genres: string[];
  id: string;
  medium: Medium;
  primaryTitle: string;
  referenceUrl: string | null;
  staff: string[];
  status: Status | null;
  tags: string[];
  updatedAt: string;
}

const CREATE_ENTRY: TypedDocumentNode<{ createEntry: Entry }, { input: CreateEntryInput }> =
  gql(createEntryMutation);

export function useCreateEntry() {
  const [mutate, result] = useMutation(CREATE_ENTRY);

  function createEntry(input: CreateEntryInput) {
    return mutate({ variables: { input } });
  }

  return { createEntry, ...result };
}
