"use server";
import { z } from "zod";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { prisma } from "@/lib/prisma";
import { hash, verify } from "@node-rs/argon2";
import { HomePath } from "@/utils/path";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { setCookieByKey } from "@/actions/cookies";
import { createSession } from "@/lib/session";
import { setSessionCookie } from "@/lib/auth-cookie";

const signUpSchema = z
  .object({
    email: z.string().min(1, { message: "Is required" }).max(191).email(),
    password: z.string().min(6).max(191),
  })


export const signInAction = async (
  _actionState: ActionState,
  formData: FormData,
) => {
  try {
    const { email, password } = signUpSchema.parse({
      ...Object.fromEntries(formData),
    });

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return fromErrorToActionState(
        new Error("Invalid email or password"),
        formData,
      );
    }

    const isValid = await verify(user.passwordHash, password);
    if (!isValid) {
      return fromErrorToActionState(
        new Error("Invalid email or password"),
        formData,
      );
    }

    const session = await createSession(user.id);
    const cookieStore = await cookies();
    setSessionCookie(cookieStore, session.id, session.expiresAt);
  } catch (error) {
    return fromErrorToActionState(error as Error, formData);
  }

  redirect(HomePath());
};
