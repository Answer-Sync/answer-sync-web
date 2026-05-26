import { NextRequest, NextResponse } from "next/server";
import {
  validateExtensionToken,
  getAdminSettings,
  resetDailyCreditsIfNeeded,
} from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const user = await validateExtensionToken(
      request.headers.get("Authorization")
    );
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Reset credits if needed
    await resetDailyCreditsIfNeeded(user.id);

    const settings = await getAdminSettings();

    return NextResponse.json({
      email: user.email,
      name: user.name,
      image: user.image,
      tier: user.tier,
      hasApiKey: !!(user.encryptedApiKey && user.apiKeyIv && user.apiKeyTag),
      dailyCreditsUsed: user.dailyCreditsUsed,
      dailyCreditLimit: settings.dailyCreditLimit,
      totalQueriesAll: user.totalQueriesAll,
    });
  } catch (error: any) {
    console.error("User API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
