import type { Request } from "express";

export interface ApolloContext {
  isAdmin: boolean;
}

export function buildContext({ req }: { req: Request }): ApolloContext {
  const auth = req.headers.authorization ?? "";
  const secret = process.env.ADMIN_SECRET;
  const isAdmin = !!secret && auth === `Bearer ${secret}`;
  return { isAdmin };
}
