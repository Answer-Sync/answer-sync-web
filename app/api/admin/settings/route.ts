import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { isAdmin, getAdminSettings } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const settings = await getAdminSettings();
    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("Admin settings GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { dailyCreditLimit, maxQuestionsPerBatch } = body;

    const updateData: any = {};
    if (typeof dailyCreditLimit === "number" && dailyCreditLimit >= 0) {
      updateData.dailyCreditLimit = dailyCreditLimit;
    }
    if (typeof maxQuestionsPerBatch === "number" && maxQuestionsPerBatch > 0) {
      updateData.maxQuestionsPerBatch = maxQuestionsPerBatch;
    }

    const settings = await prisma.adminSettings.upsert({
      where: { id: "global" },
      update: updateData,
      create: {
        id: "global",
        dailyCreditLimit: dailyCreditLimit || 20,
        maxQuestionsPerBatch: maxQuestionsPerBatch || 50,
      },
    });

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("Admin settings PUT error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
