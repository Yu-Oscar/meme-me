"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { clearSessionCookie } from "@/lib/auth-cookie";
import { invalidateSession } from "@/lib/session";
import { signInPath, HomePath } from "@/utils/path";
import { getAuth } from "../queries/get-auth";
import { setCookieByKey } from "@/actions/cookies";

export const signOut = async () => {
  const { session } = await getAuth();

  if (!session) {
    redirect(signInPath());
  }

  await invalidateSession(session.id);
  const cookieStore = await cookies();
  clearSessionCookie(cookieStore);

  setCookieByKey("toast", "Signed out successfully");
};
