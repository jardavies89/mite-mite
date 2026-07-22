import jwt from "jsonwebtoken";
import { buildContext } from "../auth";

const SECRET = "test-secret-that-is-long-enough-32chars";
const USERNAME = "testuser";

function makeReq(cookie?: string) {
  return {
    cookies: cookie ? { mite_session: cookie } : {},
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

function signToken(sub: string, opts?: jwt.SignOptions) {
  return jwt.sign({ sub }, SECRET, { expiresIn: "7d", ...opts });
}

beforeEach(() => {
  process.env.JWT_SECRET = SECRET;
  process.env.ADMIN_GITHUB_USERNAME = USERNAME;
});

afterEach(() => {
  delete process.env.JWT_SECRET;
  delete process.env.ADMIN_GITHUB_USERNAME;
});

describe("buildContext", () => {
  test("valid cookie with matching username → isAdmin true", async () => {
    const token = signToken(USERNAME);
    const ctx = await buildContext({ req: makeReq(token) });
    expect(ctx.isAdmin).toBe(true);
  });

  test("no cookie → isAdmin false", async () => {
    const ctx = await buildContext({ req: makeReq() });
    expect(ctx.isAdmin).toBe(false);
  });

  test("expired JWT → isAdmin false", async () => {
    const token = signToken(USERNAME, { expiresIn: -1 });
    const ctx = await buildContext({ req: makeReq(token) });
    expect(ctx.isAdmin).toBe(false);
  });

  test("invalid signature → isAdmin false", async () => {
    const token = jwt.sign({ sub: USERNAME }, "wrong-secret");
    const ctx = await buildContext({ req: makeReq(token) });
    expect(ctx.isAdmin).toBe(false);
  });

  test("valid JWT but username does not match allowlist → isAdmin false", async () => {
    const token = signToken("other-user");
    const ctx = await buildContext({ req: makeReq(token) });
    expect(ctx.isAdmin).toBe(false);
  });
});
