import { redirect } from "next/navigation";
import { getAuth } from "@/features/auth/queries/get-auth";
import { signInPath } from "@/utils/path";

export async function getAuthOrRedirect() {
  const { user } = await getAuth();

  if (!user) {
    redirect(signInPath());
  }

  return user;
}