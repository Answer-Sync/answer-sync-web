import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { encrypt } from "@/lib/encryption";
import { validateExtensionToken } from "@/lib/auth-helpers";

const GEMINI_TEST_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function PUT(request: NextRequest) {
  try {
    const user = await validateExtensionToken(
      request.headers.get("Authorization")
    );
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length < 10) {
      return NextResponse.json(
        { error: "Invalid API key format" },
        { status: 400 }
      );
    }

    // Validate the API key with a test call
    const isValid = await testGeminiKey(apiKey.trim());
    if (!isValid) {
      return NextResponse.json(
        {
          error:
            "Invalid API key. Could not connect to Gemini API. Please check and try again.",
        },
        { status: 400 }
      );
    }

    // Encrypt and store
    const encrypted = encrypt(apiKey.trim());

    await prisma.user.update({
      where: { id: user.id },
      data: {
        encryptedApiKey: encrypted.content,
        apiKeyIv: encrypted.iv,
        apiKeyTag: encrypted.tag,
        tier: "pro",
      },
    });

    return NextResponse.json({
      success: true,
      tier: "pro",
      message: "API key saved and validated. You now have unlimited access!",
    });
  } catch (error: any) {
    console.error("API key save error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await validateExtensionToken(
      request.headers.get("Authorization")
    );
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        encryptedApiKey: null,
        apiKeyIv: null,
        apiKeyTag: null,
        tier: "free",
      },
    });

    return NextResponse.json({
      success: true,
      tier: "free",
      message: "API key removed. You are now on the free tier.",
    });
  } catch (error: any) {
    console.error("API key delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function testGeminiKey(apiKey: string): Promise<boolean> {
  try {
    const res = await fetch(`${GEMINI_TEST_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Reply with only: OK" }] }],
        generationConfig: { maxOutputTokens: 5 },
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
