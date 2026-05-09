import { cookies } from "next/headers";

export const AUTH_SESSION_COOKIE_NAME = "auth-session";

export function setSessionCookie(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  sessionId: string,
  expiresAt: Date,
) {
  cookieStore.set(AUTH_SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export function clearSessionCookie(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
) {
  cookieStore.set(AUTH_SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0, // delete now
  });
}
