import { prisma } from "./db";

/**
 * Validates a session token from the Chrome extension's Authorization header.
 * Returns the user if valid, null otherwise.
 */
export async function validateExtensionToken(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) return null;

  try {
    const session = await prisma.session.findUnique({
      where: { sessionToken: token },
      include: { user: true },
    });

    if (!session || session.expires < new Date()) {
      return null;
    }

    return session.user;
  } catch {
    return null;
  }
}

/**
 * Check if the requesting user is an admin.
 */
export function isAdmin(email: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return false;
  return email.toLowerCase() === adminEmail.toLowerCase();
}

/**
 * Get admin settings (or create defaults if not exists).
 */
export async function getAdminSettings() {
  let settings = await prisma.adminSettings.findUnique({
    where: { id: "global" },
  });

  if (!settings) {
    settings = await prisma.adminSettings.create({
      data: {
        id: "global",
        dailyCreditLimit: 20,
        maxQuestionsPerBatch: 50,
      },
    });
  }

  return settings;
}

/**
 * Reset daily credits if the last reset was before today.
 */
export async function resetDailyCreditsIfNeeded(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  const now = new Date();
  const lastReset = new Date(user.lastCreditReset);
  const isNewDay =
    now.getUTCFullYear() !== lastReset.getUTCFullYear() ||
    now.getUTCMonth() !== lastReset.getUTCMonth() ||
    now.getUTCDate() !== lastReset.getUTCDate();

  if (isNewDay) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        dailyCreditsUsed: 0,
        lastCreditReset: now,
      },
    });
  }
}
