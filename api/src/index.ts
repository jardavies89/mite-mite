import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "fs";
import { join } from "path";
import { buildContext, type ApolloContext } from "./auth";
import { entryResolvers } from "./resolvers/entry";
import { franchiseResolvers } from "./resolvers/franchise";

const typeDefs = readFileSync(join(__dirname, "schema.graphql"), "utf-8");

const resolvers = {
  Query: {
    ...entryResolvers.Query,
    ...franchiseResolvers.Query,
  },
  Mutation: {
    ...entryResolvers.Mutation,
    ...franchiseResolvers.Mutation,
  },
  Entry: entryResolvers.Entry,
  Franchise: franchiseResolvers.Franchise,
};

async function start() {
  const server = new ApolloServer<ApolloContext>({ typeDefs, resolvers });

  const { url } = await startStandaloneServer(server, {
    context: buildContext,
    listen: { port: Number(process.env.PORT ?? 4100) },
  });

  console.log(`API ready at ${url}`);
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
