import "dotenv/config";
import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
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
  const webUrl = process.env.WEB_URL ?? "http://localhost:4000";
  const port = Number(process.env.PORT ?? 4100);

  const app = express();

  app.use(
    cors({
      origin: webUrl,
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(express.json());

  // Auth router will be mounted here (T013)
  // app.use("/auth", authRouter);

  const server = new ApolloServer<ApolloContext>({ typeDefs, resolvers });
  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: ({ req }) => buildContext({ req }),
    }),
  );

  const httpServer = http.createServer(app);
  httpServer.listen(port, () => {
    console.log(`API ready at http://localhost:${port}/graphql`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
