import { gql, type TypedDocumentNode } from "@apollo/client/core";
import { useQuery } from "@apollo/client/react";

import getAvailableFilterOptionsQuery from "@/api/mite_mite/graphql/available_filter_options.graphql?raw";

type GetFilterOptionsData = {
  availableFilterOptions: { genres: string[]; tags: string[] };
};

const GET_AVAILABLE_FILTER_OPTIONS: TypedDocumentNode<
  GetFilterOptionsData,
  Record<string, never>
> = gql(getAvailableFilterOptionsQuery);

function useGetFilterOptions() {
  const { data } = useQuery(GET_AVAILABLE_FILTER_OPTIONS);
  return {
    availableGenres: data?.availableFilterOptions.genres ?? [],
    availableTags: data?.availableFilterOptions.tags ?? [],
  };
}

export { useGetFilterOptions };
