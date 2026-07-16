import jwt from "jsonwebtoken";
import { isAllowedUser, createSessionToken } from "./auth";

const SECRET = "test-secret-that-is-long-enough-32chars";

describe("isAllowedUser", () => {
  test("matching username returns true", () => {
    expect(isAllowedUser("jardavies89", "jardavies89")).toBe(true);
  });

  test("case-insensitive match returns true", () => {
    expect(isAllowedUser("JarDavies89", "jardavies89")).toBe(true);
  });

  test("non-matching username returns false", () => {
    expect(isAllowedUser("other-user", "jardavies89")).toBe(false);
  });
});

describe("createSessionToken", () => {
  test("returns JWT with correct sub claim", () => {
    const token = createSessionToken("jardavies89", SECRET);
    const payload = jwt.decode(token) as { sub: string };
    expect(payload.sub).toBe("jardavies89");
  });

  test("token has 7-day lifetime", () => {
    const token = createSessionToken("jardavies89", SECRET);
    const payload = jwt.decode(token) as { iat: number; exp: number };
    expect(payload.exp - payload.iat).toBe(7 * 24 * 60 * 60);
  });
});
