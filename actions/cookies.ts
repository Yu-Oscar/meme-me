"use server";

import { cookies } from "next/headers";

export async function getCookieByKey(key: string) {
  const cookie = (await cookies()).get(key);

  if (!cookie) return null;

  return cookie.value;
}

export const setCookieByKey = async (key: string, value: string) => {
  (await cookies()).set(key, value);
};

export async function deleteCookieByKey(key: string) {
  (await cookies()).delete(key);
}

/** Read and delete cookie in one round-trip to avoid double-consumption (e.g. Strict Mode). */
export async function consumeCookieByKey(key: string) {
  const cookie = (await cookies()).get(key);
  if (cookie) {
    (await cookies()).delete(key);
    return cookie.value;
  }
  return null;
}
