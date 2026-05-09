"use server";
import { z } from "zod";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { prisma } from "@/lib/prisma";
import { hash } from "@node-rs/argon2";
import { HomePath } from "@/utils/path";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSession } from "@/lib/session";
import { setSessionCookie } from "@/lib/auth-cookie";

const signUpSchema = z
  .object({
    username: z
      .string()
      .min(1)
      .max(191)
      .refine((value) => value.trim() === value, {
        message: "Username cannot contain spaces",
      }),
    email: z.string().min(1, { message: "Is required" }).max(191).email(),
    password: z.string().min(6).max(191),
    confirmPassword: z.string().min(6).max(191),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export const signUpAction = async (
  _actionState: ActionState,
  formData: FormData,
) => {
  try {
    const { username, email, password } = signUpSchema.parse({
      ...Object.fromEntries(formData),
    });

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser || existingEmail) {
      return toActionState("ERROR", "User already exists");
    }

    const passwordHash = await hash(password);
    const user = await prisma.user.create({
      data: { username, email, passwordHash },
    });

    const session = await createSession(user.id);
    const cookieStore = await cookies();
    setSessionCookie(cookieStore, session.id, session.expiresAt);

  } catch (error) {
    return fromErrorToActionState(error as Error, formData);
  }

  redirect(HomePath());
};
