import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import * as cookie from "cookie";
import { getSessionCookieOptions } from "../lib/cookies";
import { Session } from "@contracts/constants";
import { Errors } from "@contracts/errors";

// 👇 Usuario admin simulado
const mockAdmin = {
  id: "1",
  unionId: "admin-001",
  name: "eleaner",
  avatar: "",
  role: "admin",
};

// ❌ Eliminado: OAuth, fetch, jose, env, kimiAuthUrl

// ✅ Simulación de intercambio de código (ya no hace nada real)
async function exchangeAuthCode(): Promise<any> {
  return {
    access_token: "fake-token",
  };
}

// ✅ Simulación de verificación de token
async function verifyAccessToken(): Promise<{ userId: string; clientId: string }> {
  return { userId: "admin-001", clientId: "local" };
}

// ✅ Autenticación siempre válida (admin)
export async function authenticateRequest(headers: Headers) {
  const cookies = cookie.parse(headers.get("cookie") || "");
  const token = cookies[Session.cookieName];

  if (!token) {
    console.warn("[auth] No session cookie found, usando admin simulado.");
    return mockAdmin;
  }

  // Siempre devuelve admin
  return mockAdmin;
}

// ✅ Handler de login simulado (sin Kimi)
export function createOAuthCallbackHandler() {
  return async (c: Context) => {
    try {
      const tokenResp = await exchangeAuthCode();
      const { userId } = await verifyAccessToken(tokenResp.access_token);

      const token = "fake-session-token";

      const cookieOpts = getSessionCookieOptions(c.req.raw.headers);
      setCookie(c, Session.cookieName, token, {
        ...cookieOpts,
        maxAge: Session.maxAgeMs / 1000,
      });

      return c.redirect("/", 302);
    } catch (error) {
      console.error("[Auth] Callback simulado falló", error);
      return c.json({ error: "Auth simulado falló" }, 500);
    }
  };
}

// 👇 exports para que no rompa otros archivos
export { exchangeAuthCode, verifyAccessToken };