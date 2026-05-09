"use server";

import { cookies } from "next/headers";
import { cache } from "react";
import {
  AUTH_SESSION_COOKIE_NAME,
  clearSessionCookie,
  setSessionCookie,
} from "@/lib/auth-cookie";
import { prisma } from "@/lib/prisma";
import { isSessionFresh, type Session, validateSession } from "@/lib/session";

export type AuthUser = {
  id: number;
  username: string;
  email: string;
};

export const getAuth = cache(
  async (): Promise<{
    user: AuthUser | null;
    session: Session | null;
  }> => {
    const sessionId = (await cookies()).get(AUTH_SESSION_COOKIE_NAME)?.value;

    if (!sessionId) {
      return { user: null, session: null };
    }

    const session = await validateSession(sessionId);

    try {
      if (session && isSessionFresh(session)) {
        const cookieStore = await cookies();
        setSessionCookie(cookieStore, session.id, session.expiresAt);
      }
      if (!session) {
        const cookieStore = await cookies();
        clearSessionCookie(cookieStore);
      }
    } catch {
      // ignore cookie write failures
    }

    if (!session) {
      return { user: null, session: null };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, username: true, email: true },
    });

    if (!user) {
      return { user: null, session: null };
    }

    return { user, session };
  },
);
