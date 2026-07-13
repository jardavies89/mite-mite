import type { IncomingMessage } from "http";

export interface ApolloContext {
  isAdmin: boolean;
}

export async function buildContext({ req }: { req: IncomingMessage }): Promise<ApolloContext> {
  const auth = (req.headers.authorization as string | undefined) ?? "";
  const secret = process.env.ADMIN_SECRET;
const isAdmin = !!secret && auth === `Bearer ${secret}`;
  return { isAdmin };
}
