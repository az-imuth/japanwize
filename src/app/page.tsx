export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          JapanWise
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your AI-powered Japan travel planner.
          <br />
          Get a personalized itinerary in seconds.
        </p>
        <a
          href="/plan"
          className="inline-block bg-red-600 text-white text-lg font-semibold px-8 py-4 rounded-lg hover:bg-red-700 transition"
        >
          Plan Your Trip →
        </a>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why JapanWise?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Personalized</h3>
              <p className="text-gray-600">
                Tell us your interests, budget, and style. We'll create an itinerary just for you.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🏯</div>
              <h3 className="text-xl font-semibold mb-2">Local Insights</h3>
              <p className="text-gray-600">
                Discover hidden gems and local favorites, not just tourist traps.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Instant</h3>
              <p className="text-gray-600">
                Get your complete day-by-day itinerary in under a minute.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Tell us about your trip</h3>
                <p className="text-gray-600">Dates, cities, interests, and travel style.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">AI creates your itinerary</h3>
                <p className="text-gray-600">Our AI builds a personalized day-by-day plan with restaurants, spots, and tips.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Refine and book</h3>
                <p className="text-gray-600">Adjust anything you like, then book hotels and experiences directly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to explore Japan?
          </h2>
          <p className="text-red-100 mb-8">
            Free to use. No signup required.
          </p>
          <a
            href="/plan"
            className="inline-block bg-white text-red-600 text-lg font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition"
          >
            Start Planning →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm">
        <p>© 2026 JapanWise. Made with ❤️ for Japan travelers.</p>
      </footer>
    </main>
  );
}