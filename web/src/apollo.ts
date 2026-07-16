import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client/core";

const client = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_API_URL + "/graphql",
    credentials: "include",
  }),
  cache: new InMemoryCache(),
});

export default client;
