import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0a0a14]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Answer Sync
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <a
              href="#install"
              className="text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity"
            >
              Install Extension
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            AI-Powered Chrome Extension
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Answer any question
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              on any webpage
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Answer Sync detects questions on any webpage — forms, quizzes,
            surveys — and fills answers instantly using advanced AI.
            Review first or auto-fill everything in one click.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#install"
              id="install"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              Add to Chrome — Free
            </a>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-all hover:-translate-y-0.5"
            >
              Sign In →
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Two powerful modes
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">
            Choose how you want Answer Sync to work for you.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Review Mode */}
            <div className="group p-8 rounded-2xl bg-gradient-to-b from-blue-500/5 to-transparent border border-white/5 hover:border-blue-500/20 transition-all">
              <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl mb-6">
                📋
              </div>
              <h3 className="text-xl font-bold mb-3">Review Mode</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Scans the page and opens a sidebar with all detected Q&A pairs.
                Review each answer, edit if needed, then selectively apply.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">✓</span> Preview before filling
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">✓</span> Edit answers inline
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">✓</span> Skip individual questions
                </li>
              </ul>
            </div>

            {/* Auto-Fill Mode */}
            <div className="group p-8 rounded-2xl bg-gradient-to-b from-purple-500/5 to-transparent border border-white/5 hover:border-purple-500/20 transition-all">
              <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center text-2xl mb-6">
                ⚡
              </div>
              <h3 className="text-xl font-bold mb-3">Auto-Fill Mode</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                One click fills every detected field instantly. No interruptions,
                no review — just answers, fast.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">✓</span> Instant fill
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">✓</span> All field types supported
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">✓</span> Works on any website
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Types */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Supports every input type</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "📝", label: "Text Inputs" },
              { icon: "🔘", label: "Radio Buttons" },
              { icon: "☑️", label: "Checkboxes" },
              { icon: "📋", label: "Dropdowns" },
              { icon: "📄", label: "Textareas" },
              { icon: "🔢", label: "Number Fields" },
              { icon: "📅", label: "Date Pickers" },
              { icon: "✏️", label: "Rich Text" },
            ].map((item) => (
              <div
                key={item.label}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-sm text-gray-400">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Simple pricing</h2>
          <p className="text-gray-400 text-center mb-12">
            Start free, upgrade when you need more.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free */}
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="text-sm font-medium text-blue-400 mb-2">Free</div>
              <div className="text-4xl font-bold mb-1">$0</div>
              <div className="text-sm text-gray-500 mb-6">per day</div>
              <ul className="space-y-3 text-sm text-gray-400 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Daily free credits
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> All input types
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Review & Auto-Fill
                </li>
              </ul>
              <Link
                href="/login"
                className="block text-center py-3 rounded-lg bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-purple-500/10 to-transparent border border-purple-500/20 relative">
              <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-purple-500 text-xs font-bold text-white">
                POPULAR
              </div>
              <div className="text-sm font-medium text-purple-400 mb-2">Pro</div>
              <div className="text-4xl font-bold mb-1">Unlimited</div>
              <div className="text-sm text-gray-500 mb-6">bring your own key</div>
              <ul className="space-y-3 text-sm text-gray-400 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Unlimited usage
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Your own Gemini API key
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Encrypted key storage
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Priority support
                </li>
              </ul>
              <Link
                href="/login"
                className="block text-center py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>✨</span>
            <span className="text-sm text-gray-500">
              Answer Sync © {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="mailto:adityapandey.dev.in@gmail.com" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
