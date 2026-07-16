import { meResolvers } from "./me";

describe("me resolver", () => {
  test("returns isAdmin true when context is admin", () => {
    const result = meResolvers.Query.me(undefined, undefined, { isAdmin: true });
    expect(result).toEqual({ isAdmin: true });
  });

  test("returns isAdmin false when context is not admin", () => {
    const result = meResolvers.Query.me(undefined, undefined, { isAdmin: false });
    expect(result).toEqual({ isAdmin: false });
  });
});
