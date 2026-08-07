import { gql, type TypedDocumentNode } from "@apollo/client/core";
import { useMutation } from "@apollo/client/react";

import updateEntryMutation from "@/api/mite_mite/graphql/update_entry.graphql?raw";
import type { Entry } from "./use_create_entry";
import type { Medium, Status } from "@/constants/types";

export interface UpdateEntryInput {
  alternateTitles?: string[];
  comments?: string;
  coverImageUrl?: string;
  description?: string;
  genres?: string[];
  medium?: Medium;
  metadata?: EntryMetadata;
  primaryTitle?: string;
  referenceUrl?: string;
  staff?: string[];
  status?: Status;
  tags?: string[];
}

const UPDATE_ENTRY: TypedDocumentNode<
  { updateEntry: Entry },
  { id: string; input: UpdateEntryInput }
> = gql(updateEntryMutation);

export function useUpdateEntry() {
  const [mutate, result] = useMutation(UPDATE_ENTRY);

  function updateEntry(id: string, input: UpdateEntryInput) {
    return mutate({ variables: { id, input } });
  }

  return { updateEntry, ...result };
}
