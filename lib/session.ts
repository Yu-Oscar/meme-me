import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";
import { prisma } from "./prisma";

export interface Session {
  id: string;
  userId: number;
  expiresAt: Date;
}

function generateSessionId(): string {
  const bytes = new Uint8Array(25);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

const sessionExpiresInSeconds = 60 * 60 * 24 * 30; // 30 days

export async function createSession(userId: number): Promise<Session> {
  const now = new Date();
  const sessionId = generateSessionId();
  const session = await prisma.session.create({
    data: {
      id: sessionId,
      userId: userId,
      expiresAt: new Date(now.getTime() + 1000 * sessionExpiresInSeconds),
    },
  });
  return session;
}

export async function validateSession(sessionId: string): Promise<Session | null> {
  const now = new Date();

  // This may be vulnerable to a timing attack where an attacker can measure the response times
  // to guess a valid session ID.
  // A more common pattern is a string comparison against a secret using the === operator.
  // The === operator is not constant time and the same can be said about SQL = operators.
  // Some remote timing attacks has been proven to be possible but there hasn't been a successful
  // recorded attack on real-world applications targeting similar vulnerabilities.
  const result = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
  });
  if (!result) {
    return null;
  }
  if (now.getTime() >= result.expiresAt.getTime()) {
    await prisma.session.delete({
      where: {
        id: sessionId,
      },
    });
    return null;
  }
  if (
    now.getTime() >=
    result.expiresAt.getTime() - (1000 * sessionExpiresInSeconds) / 2
  ) {
    result.expiresAt = new Date(Date.now() + 1000 * sessionExpiresInSeconds);
    await prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        expiresAt: result.expiresAt,
      },
    });
  }
  return result;
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await prisma.session.delete({
    where: {
      id: sessionId,
    },
  });
}

export function isSessionFresh(session: Session): boolean {
  return session.expiresAt > new Date();
}
