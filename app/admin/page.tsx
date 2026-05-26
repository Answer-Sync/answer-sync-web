"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  tier: string;
  dailyCreditsUsed: number;
  totalQueriesAll: number;
  hasApiKey: boolean;
  createdAt: string;
}

interface Settings {
  dailyCreditLimit: number;
  maxQuestionsPerBatch: number;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [settings, setSettings] = useState<Settings>({
    dailyCreditLimit: 20,
    maxQuestionsPerBatch: 50,
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      loadAdminData();
    }
  }, [session]);

  async function loadAdminData() {
    setLoading(true);
    setError("");
    try {
      const [settingsRes, usersRes] = await Promise.all([
        fetch("/api/admin/settings"),
        fetch("/api/admin/users"),
      ]);

      if (settingsRes.status === 403 || usersRes.status === 403) {
        setError("Access denied. You are not an admin.");
        setLoading(false);
        return;
      }

      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setSettings(data);
      }

      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.users || []);
        setTotalUsers(data.totalUsers || 0);
      }
    } catch (e) {
      setError("Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveSettings() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setMessage("Settings saved!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to save settings.");
      }
    } catch {
      setMessage("Network error.");
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-5xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const proUsers = users.filter((u) => u.tier === "pro").length;
  const freeUsers = users.filter((u) => u.tier === "free").length;
  const totalQueries = users.reduce((sum, u) => sum + u.totalQueriesAll, 0);

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b border-white/5 bg-[#0a0a14]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">✨</span>
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Answer Sync
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-bold">
              ADMIN
            </span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm text-gray-500 hover:text-red-400 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-sm text-gray-500">Total Users</div>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </div>
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-sm text-gray-500">Free Users</div>
            <div className="text-2xl font-bold text-blue-400">{freeUsers}</div>
          </div>
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-sm text-gray-500">Pro Users</div>
            <div className="text-2xl font-bold text-purple-400">{proUsers}</div>
          </div>
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-sm text-gray-500">Total Queries</div>
            <div className="text-2xl font-bold">{totalQueries}</div>
          </div>
        </div>

        {/* Settings */}
        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 mb-10">
          <h2 className="text-xl font-bold mb-6">Settings</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Daily Credit Limit (free users)
              </label>
              <input
                type="number"
                min="0"
                max="1000"
                value={settings.dailyCreditLimit}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    dailyCreditLimit: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-purple-500/50 transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">
                Credits reset daily at midnight UTC
              </p>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Max Questions Per Batch
              </label>
              <input
                type="number"
                min="1"
                max="200"
                value={settings.maxQuestionsPerBatch}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    maxQuestionsPerBatch: parseInt(e.target.value) || 1,
                  }))
                }
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-purple-500/50 transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">
                Max questions in a single scan request
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
            {message && (
              <span className="text-sm text-green-400">{message}</span>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-xl font-bold">Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-left text-sm text-gray-500">
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Tier</th>
                  <th className="px-6 py-3 font-medium">Today</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">API Key</th>
                  <th className="px-6 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4 text-sm">
                      <div className="font-medium">{user.email}</div>
                      {user.name && (
                        <div className="text-xs text-gray-500">{user.name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          user.tier === "pro"
                            ? "bg-purple-500/10 text-purple-400"
                            : "bg-blue-500/10 text-blue-400"
                        }`}
                      >
                        {user.tier.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {user.dailyCreditsUsed}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {user.totalQueriesAll}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {user.hasApiKey ? (
                        <span className="text-green-400">✓</span>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
