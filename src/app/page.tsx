export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section with Japanese Background */}
      <section className="relative min-h-[90vh] flex items-center justify-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070')",
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-red-400 text-lg mb-4 tracking-widest uppercase">
            ようこそ • Welcome
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            JapanWise
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-4">
            Your journey to Japan begins here
          </p>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            AI-powered travel planning with the spirit of Omotenashi.<br />
            Personalized itineraries with local secrets, real restaurant names,<br />
            and tips only locals know.
          </p>
          <a
            href="/plan"
            className="inline-block bg-red-600 text-white text-lg font-semibold px-10 py-4 rounded-lg hover:bg-red-700 transition transform hover:scale-105"
          >
            Begin Your Journey →
          </a>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            The Art of Travel Planning
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            We don't just create itineraries. We craft experiences with the same care and attention that defines Japanese hospitality.
          </p>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Personalized</h3>
              <p className="text-gray-600">
                Every itinerary is crafted for your interests, pace, and travel style. No two journeys are the same.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">🏯</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Local Secrets</h3>
              <p className="text-gray-600">
                Real restaurant names. Hidden entrances. Best times to visit. Knowledge that only locals have.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Instant</h3>
              <p className="text-gray-600">
                Your complete day-by-day itinerary in under a minute. Detailed, actionable, ready to go.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Simple as 1, 2, 3
          </h2>
          <div className="space-y-12">
            <div className="flex items-start gap-6">
              <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl shrink-0">
                1
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-900">Tell us about your trip</h3>
                <p className="text-gray-600 text-lg">When you're traveling, what cities interest you, your travel style and preferences.</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl shrink-0">
                2
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-900">AI crafts your itinerary</h3>
                <p className="text-gray-600 text-lg">Our AI, trained on local knowledge, builds a personalized day-by-day plan with specific restaurants, spots, and insider tips.</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl shrink-0">
                3
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-900">Book and explore</h3>
                <p className="text-gray-600 text-lg">Book experiences directly from your itinerary and start your journey with confidence.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example Itinerary Preview */}
      <section className="py-20 bg-stone-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            See What You'll Get
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Detailed daily plans with specific times, places, and local tips
          </p>
          
          {/* Mock Itinerary Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                Day 1
              </span>
              <span className="text-gray-500">Tokyo</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Arrival & Shinjuku Discovery</h3>
            
            <div className="space-y-4">
              <div className="border-l-4 border-red-400 pl-4 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-500">15:00</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">¥500</span>
                </div>
                <h4 className="font-semibold text-gray-900">📍 Shinjuku Gyoen</h4>
                <p className="text-gray-600 text-sm">Beautiful garden perfect for recovering from jet lag</p>
                <p className="text-sm text-red-600 mt-1">💡 Enter from Okido Gate - less crowded than main entrance</p>
              </div>
              
              <div className="border-l-4 border-orange-400 pl-4 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-500">18:00</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">¥2,000-3,000</span>
                </div>
                <h4 className="font-semibold text-gray-900">🍽️ Omoide Yokocho - Torishige</h4>
                <p className="text-gray-600 text-sm">Tiny 8-seat yakitori joint run by the same family since 1950</p>
                <p className="text-sm text-red-600 mt-1">💡 Order the 'negima' and 'sunagimo'. Cash only.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=2070')",
          }}
        >
          <div className="absolute inset-0 bg-red-900/80"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to discover Japan?
          </h2>
          <p className="text-red-100 mb-10 text-lg">
            Free to use. No signup required.<br />
            Your perfect itinerary awaits.
          </p>
          <a
            href="/plan"
            className="inline-block bg-white text-red-600 text-lg font-semibold px-10 py-4 rounded-lg hover:bg-gray-100 transition transform hover:scale-105"
          >
            Start Planning →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-stone-900 text-center">
        <p className="text-stone-400 text-sm">
          © 2026 JapanWise. Crafted with 心 for travelers to Japan.
        </p>
      </footer>
    </main>
  );
}