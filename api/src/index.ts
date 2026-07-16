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
import { meResolvers } from "./resolvers/me";
import authRouter from "./routes/auth";

const typeDefs = readFileSync(join(__dirname, "schema.graphql"), "utf-8");

const resolvers = {
  Query: {
    ...entryResolvers.Query,
    ...franchiseResolvers.Query,
    ...meResolvers.Query,
  },
  Mutation: {
    ...entryResolvers.Mutation,
    ...franchiseResolvers.Mutation,
  },
  Entry: entryResolvers.Entry,
  Franchise: franchiseResolvers.Franchise,
};

function validateEnv() {
  const required = [
    "GITHUB_CLIENT_ID",
    "GITHUB_CLIENT_SECRET",
    "ADMIN_GITHUB_USERNAME",
    "JWT_SECRET",
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error(`Missing required env vars: ${missing.join(", ")}`);
    process.exit(1);
  }
}

async function start() {
  validateEnv();
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

  app.use("/auth", authRouter);

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
