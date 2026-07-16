import { Router } from "express";
import jwt from "jsonwebtoken";

const SESSION_COOKIE = "mite_session";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export function isAllowedUser(login: string, allowedUser: string): boolean {
  return login.toLowerCase() === allowedUser.toLowerCase();
}

export function createSessionToken(login: string, secret: string): string {
  return jwt.sign({ sub: login }, secret, { expiresIn: SESSION_MAX_AGE });
}

const router = Router();

// Redirect browser to GitHub OAuth authorize page
router.get("/github", (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const protocol = (req.get("x-forwarded-proto") ?? req.protocol).split(",")[0].trim();
  const callbackUrl = `${protocol}://${req.get("host")}/auth/github/callback`;

  const params = new URLSearchParams({
    client_id: clientId ?? "",
    redirect_uri: callbackUrl,
    scope: "read:user",
  });

  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
});

// Exchange OAuth code for session cookie, then redirect back to /admin
router.get("/github/callback", async (req, res) => {
  const webUrl = (process.env.WEB_URL ?? "http://localhost:4000").replace(/\/$/, "");
  const adminUrl = `${webUrl}/admin`;
  const { code, error } = req.query as { code?: string; error?: string };

  if (error || !code) {
    res.redirect(`${adminUrl}?error=unauthorized`);
    return;
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    const tokenData = (await tokenRes.json()) as { access_token?: string; error?: string };

    if (!tokenData.access_token) {
      res.redirect(`${adminUrl}?error=server_error`);
      return;
    }

    // Fetch GitHub user profile
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/vnd.github+json",
      },
    });
    const userData = (await userRes.json()) as { login?: string };

    if (!userData.login) {
      res.redirect(`${adminUrl}?error=server_error`);
      return;
    }

    const allowedUser = process.env.ADMIN_GITHUB_USERNAME ?? "";
    if (!isAllowedUser(userData.login, allowedUser)) {
      res.redirect(`${adminUrl}?error=unauthorized`);
      return;
    }

    // Issue signed session cookie and return to admin page
    const secret = process.env.JWT_SECRET ?? "";
    const token = createSessionToken(userData.login, secret);

    const isProd = process.env.NODE_ENV === "production";
    res.cookie(SESSION_COOKIE, token, {
      httpOnly: true,
      // SameSite=None required in prod: the web and API are on different onrender.com
      // subdomains (cross-site), so Lax cookies are stripped from XHR POST requests.
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
      maxAge: SESSION_MAX_AGE * 1000, // ms
    });

    res.redirect(adminUrl);
  } catch {
    res.redirect(`${adminUrl}?error=server_error`);
  }
});

export default router;
