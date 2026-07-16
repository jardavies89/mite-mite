import type { ApolloContext } from "../auth";

export const meResolvers = {
  Query: {
    me: (_: unknown, __: unknown, ctx: ApolloContext) => ({ isAdmin: ctx.isAdmin }),
  },
};
