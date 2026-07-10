import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client/core";
import { SetContextLink } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_API_URL + "/graphql",
});

const authLink = new SetContextLink(() => {
  const secret = import.meta.env.VITE_ADMIN_SECRET;
  if (!secret) return {};
  return { headers: { Authorization: `Bearer ${secret}` } };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
