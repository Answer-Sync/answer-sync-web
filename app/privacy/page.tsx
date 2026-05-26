export default function PrivacyPage() {
  return (
    <div className="min-h-screen px-6 py-16">
      <div className="max-w-3xl mx-auto prose prose-invert">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-gray-400 mb-4">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2 className="text-xl font-bold mt-8 mb-4">1. What We Collect</h2>
        <p className="text-gray-300 mb-4">
          Answer Sync collects the following information when you sign in:
        </p>
        <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
          <li>Your Google account email address and name (via Google OAuth)</li>
          <li>Usage statistics (number of queries made)</li>
          <li>
            Your Gemini API key (if provided) — stored encrypted with
            AES-256-GCM
          </li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-4">
          2. What We Do NOT Collect
        </h2>
        <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
          <li>We do not read, store, or log the content of web pages you visit</li>
          <li>
            We do not store the questions or answers processed by the extension
          </li>
          <li>We do not track your browsing history</li>
          <li>We do not sell any data to third parties</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-4">3. How We Use Your Data</h2>
        <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
          <li>To authenticate your account via Google OAuth</li>
          <li>To track daily credit usage for free tier users</li>
          <li>
            To securely store and retrieve your encrypted API key for Pro tier
          </li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-4">4. Data Security</h2>
        <p className="text-gray-300 mb-4">
          API keys are encrypted using AES-256-GCM with a server-side master
          key. Session tokens are managed by NextAuth.js with secure, httpOnly
          cookies. All data is stored in encrypted PostgreSQL databases.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-4">5. Extension Permissions</h2>
        <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
          <li>
            <strong>activeTab:</strong> To scan the currently active tab for
            questions when you click the extension
          </li>
          <li>
            <strong>storage:</strong> To store your authentication token locally
          </li>
          <li>
            <strong>scripting:</strong> To inject the question detection and
            answer filling scripts into web pages
          </li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-4">6. Contact</h2>
        <p className="text-gray-300">
          For questions about this privacy policy, contact:{" "}
          <a
            href="mailto:adityapandey.dev.in@gmail.com"
            className="text-purple-400 hover:underline"
          >
            adityapandey.dev.in@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
