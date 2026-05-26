"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserData {
  email: string;
  name: string;
  tier: string;
  hasApiKey: boolean;
  dailyCreditsUsed: number;
  dailyCreditLimit: number;
  totalQueriesAll: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchUserData();
    }
  }, [session]);

  async function fetchUserData() {
    try {
      // Get session token from cookies
      const token = getSessionToken();
      if (!token) return;

      const res = await fetch("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      }
    } catch (e) {
      console.error("Failed to fetch user data:", e);
    }
  }

  function getSessionToken(): string {
    const cookies = document.cookie.split(";").map((c) => c.trim());
    const sessionCookie = cookies.find(
      (c) =>
        c.startsWith("next-auth.session-token=") ||
        c.startsWith("__Secure-next-auth.session-token=")
    );
    if (sessionCookie) {
      return sessionCookie.split("=").slice(1).join("=");
    }
    return "";
  }

  async function handleSaveApiKey() {
    if (!apiKeyInput.trim()) return;
    setSaving(true);
    setMessage(null);

    try {
      const token = getSessionToken();
      const res = await fetch("/api/user/api-key", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ apiKey: apiKeyInput.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ text: data.message, type: "success" });
        setApiKeyInput("");
        fetchUserData();
      } else {
        setMessage({ text: data.error, type: "error" });
      }
    } catch (e) {
      setMessage({ text: "Network error. Try again.", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteApiKey() {
    if (!confirm("Remove your API key? You'll be downgraded to the free tier."))
      return;
    try {
      const token = getSessionToken();
      const res = await fetch("/api/user/api-key", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMessage({
          text: "API key removed. Switched to free tier.",
          type: "success",
        });
        fetchUserData();
      }
    } catch {
      setMessage({ text: "Failed to remove key.", type: "error" });
    }
  }

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const creditsRemaining = userData
    ? Math.max(0, userData.dailyCreditLimit - userData.dailyCreditsUsed)
    : 0;
  const creditsPercent = userData
    ? Math.round(
        ((userData.dailyCreditLimit - userData.dailyCreditsUsed) /
          userData.dailyCreditLimit) *
          100
      )
    : 100;

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b border-white/5 bg-[#0a0a14]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Answer Sync
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{session.user?.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-gray-500 hover:text-red-400 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {/* Tier */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="text-sm text-gray-500 mb-1">Plan</div>
            <div className="flex items-center gap-2">
              <span
                className={`text-2xl font-bold ${
                  userData?.tier === "pro" ? "text-purple-400" : "text-blue-400"
                }`}
              >
                {userData?.tier === "pro" ? "Pro" : "Free"}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  userData?.tier === "pro"
                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                    : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                }`}
              >
                {userData?.tier === "pro" ? "BYOK" : "CREDITS"}
              </span>
            </div>
          </div>

          {/* Daily Credits */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="text-sm text-gray-500 mb-1">Daily Credits</div>
            <div className="text-2xl font-bold">
              {userData?.tier === "pro" ? (
                <span className="text-green-400">Unlimited</span>
              ) : (
                <span>
                  {creditsRemaining}
                  <span className="text-gray-500 text-lg">
                    /{userData?.dailyCreditLimit || 20}
                  </span>
                </span>
              )}
            </div>
            {userData?.tier !== "pro" && (
              <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                  style={{ width: `${Math.max(creditsPercent, 2)}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Total Queries */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="text-sm text-gray-500 mb-1">Total Queries</div>
            <div className="text-2xl font-bold">
              {userData?.totalQueriesAll || 0}
            </div>
          </div>
        </div>

        {/* API Key Management */}
        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 mb-6">
          <h2 className="text-xl font-bold mb-2">API Key</h2>
          <p className="text-sm text-gray-400 mb-6">
            Add your own Gemini API key for unlimited access. Your key is
            encrypted with AES-256-GCM before storage.
          </p>

          {userData?.hasApiKey ? (
            <div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/5 border border-green-500/10 mb-4">
                <span className="text-green-400 text-lg">🔑</span>
                <div>
                  <div className="text-sm font-medium text-green-400">
                    API Key Active
                  </div>
                  <div className="text-xs text-gray-500">
                    Your encrypted key is securely stored
                  </div>
                </div>
              </div>
              <button
                onClick={handleDeleteApiKey}
                className="text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                Remove API Key
              </button>
            </div>
          ) : (
            <div>
              <div className="flex gap-3">
                <input
                  type="password"
                  placeholder="Paste your Gemini API key..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-purple-500/50 transition-colors"
                />
                <button
                  onClick={handleSaveApiKey}
                  disabled={saving || !apiKeyInput.trim()}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Validating..." : "Save Key"}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Get a free API key from{" "}
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-400 hover:underline"
                >
                  Google AI Studio ↗
                </a>
              </p>
            </div>
          )}

          {message && (
            <div
              className={`mt-4 p-3 rounded-lg text-sm ${
                message.type === "success"
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
