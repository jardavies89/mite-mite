import { gql, type TypedDocumentNode } from "@apollo/client/core";
import { useQuery } from "@apollo/client/react";

import meQuery from "./graphql/me.graphql?raw";

type MeData = { me: { isAdmin: boolean } };

const ME_QUERY: TypedDocumentNode<MeData, Record<string, never>> = gql(meQuery);

function useAdminSession() {
  const { data, loading } = useQuery(ME_QUERY, { fetchPolicy: "network-only" });
  return {
    isAdmin: data?.me.isAdmin ?? false,
    loading,
  };
}

export { useAdminSession };
