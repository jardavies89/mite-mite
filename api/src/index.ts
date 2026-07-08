import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "fs";
import { join } from "path";

const typeDefs = readFileSync(join(__dirname, "schema.graphql"), "utf-8");

const resolvers = {
  Query: {
    hello: () => "Hello from the mite-mite API!",
  },
};

async function start() {
  const server = new ApolloServer({ typeDefs, resolvers });

  const { url } = await startStandaloneServer(server, {
    listen: { port: Number(process.env.PORT ?? 4100) },
  });

  console.log(`API ready at ${url}`);
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
