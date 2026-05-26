import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        tier: true,
        dailyCreditsUsed: true,
        totalQueriesAll: true,
        createdAt: true,
        encryptedApiKey: true, // just to check if they have a key
      },
      orderBy: { createdAt: "desc" },
    });

    const sanitizedUsers = users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      image: u.image,
      tier: u.tier,
      dailyCreditsUsed: u.dailyCreditsUsed,
      totalQueriesAll: u.totalQueriesAll,
      hasApiKey: !!u.encryptedApiKey,
      createdAt: u.createdAt,
    }));

    return NextResponse.json({
      users: sanitizedUsers,
      totalUsers: sanitizedUsers.length,
    });
  } catch (error: any) {
    console.error("Admin users GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
