import jwt from "jsonwebtoken";

export interface ApolloContext {
  isAdmin: boolean;
}

interface RequestWithCookies {
  cookies: Record<string, string | undefined>;
}

export async function buildContext({ req }: { req: RequestWithCookies }): Promise<ApolloContext> {
  const token = req.cookies?.mite_session;
  if (!token) return { isAdmin: false };

  const secret = process.env.JWT_SECRET;
  const allowedUser = process.env.ADMIN_GITHUB_USERNAME;
  if (!secret || !allowedUser) return { isAdmin: false };

  try {
    const payload = jwt.verify(token, secret) as { sub?: string };
    const isAdmin =
      typeof payload.sub === "string" && payload.sub.toLowerCase() === allowedUser.toLowerCase();
    return { isAdmin };
  } catch {
    return { isAdmin: false };
  }
}
