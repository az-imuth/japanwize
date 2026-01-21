'use client';

import { MapPin, Clock, Sparkles, ChevronDown, Utensils, Train, Camera, Star, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=2070')",
          }}
        >
          {/* Gradient Overlay - more sophisticated than solid black */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div className="text-left">
              <p className="text-amber-400 text-sm font-medium tracking-[0.3em] uppercase mb-6">
                Your Gateway to Japan
              </p>
              <h1 className="text-4xl md:text-6xl font-light text-white mb-6 leading-tight tracking-tight">
                Discover the<br />
                <span className="font-semibold">real</span> Japan
              </h1>
              <p className="text-lg text-stone-300 mb-8 leading-relaxed max-w-lg">
                AI-crafted itineraries with local secrets, real restaurant names, 
                and tips only insiders know. Your journey to Japanese culture starts here.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <a
                  href="/plan"
                  className="group inline-flex items-center justify-center gap-2 bg-white text-stone-900 text-base font-medium px-8 py-4 rounded-full hover:bg-amber-400 transition-all duration-300"
                >
                  Create Free Itinerary
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
              
              <div className="flex items-center gap-6 text-stone-400 text-sm">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Free
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  No signup
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  60 seconds
                </span>
              </div>
            </div>
            
            {/* Right: Sample Itinerary Card */}
            <div className="hidden lg:block">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-stone-900 text-white px-3 py-1 rounded-full text-xs font-medium tracking-wide">
                    Day 1
                  </span>
                  <span className="text-stone-500 text-sm">Tokyo</span>
                </div>
                <h3 className="text-lg font-semibold text-stone-900 mb-5">Arrival & Shinjuku Discovery</h3>
                
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <Camera className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="w-px h-full bg-stone-200 mt-2"></div>
                    </div>
                    <div className="pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-stone-500">15:00</span>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">¥500</span>
                      </div>
                      <h4 className="font-medium text-stone-900 text-sm">Shinjuku Gyoen</h4>
                      <p className="text-stone-600 text-xs mt-1">Beautiful garden perfect for jet lag recovery</p>
                      <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Enter from Okido Gate — less crowded
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                        <Utensils className="w-5 h-5 text-rose-600" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-stone-500">18:00</span>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">¥2,500</span>
                      </div>
                      <h4 className="font-medium text-stone-900 text-sm">Omoide Yokocho — Torishige</h4>
                      <p className="text-stone-600 text-xs mt-1">8-seat yakitori joint, same family since 1950</p>
                      <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Order negima & sunagimo. Cash only.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <ChevronDown className="w-6 h-6 text-white/60 animate-bounce" />
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-amber-600 text-sm font-medium tracking-[0.2em] uppercase mb-4">
              Not just any AI planner
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-stone-900 tracking-tight">
              Japan-obsessed
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-stone-50 hover:bg-stone-900 transition-all duration-500">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:bg-amber-400 transition-colors">
                <MapPin className="w-6 h-6 text-stone-700 group-hover:text-stone-900" />
              </div>
              <h3 className="text-lg font-medium mb-3 text-stone-900 group-hover:text-white transition-colors">
                Real Places
              </h3>
              <p className="text-stone-600 group-hover:text-stone-400 transition-colors leading-relaxed">
                Actual restaurant names, not "a sushi place nearby." We give you Torishige in Omoide Yokocho, row 3, second stall on the left.
              </p>
            </div>
            
            <div className="group p-8 rounded-2xl bg-stone-50 hover:bg-stone-900 transition-all duration-500">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:bg-amber-400 transition-colors">
                <Sparkles className="w-6 h-6 text-stone-700 group-hover:text-stone-900" />
              </div>
              <h3 className="text-lg font-medium mb-3 text-stone-900 group-hover:text-white transition-colors">
                Local Secrets
              </h3>
              <p className="text-stone-600 group-hover:text-stone-400 transition-colors leading-relaxed">
                Skip the main entrance. Which gate is less crowded. Where to stand for the best view. Tips only locals know.
              </p>
            </div>
            
            <div className="group p-8 rounded-2xl bg-stone-50 hover:bg-stone-900 transition-all duration-500">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:bg-amber-400 transition-colors">
                <Clock className="w-6 h-6 text-stone-700 group-hover:text-stone-900" />
              </div>
              <h3 className="text-lg font-medium mb-3 text-stone-900 group-hover:text-white transition-colors">
                Instant & Free
              </h3>
              <p className="text-stone-600 group-hover:text-stone-400 transition-colors leading-relaxed">
                Your complete day-by-day itinerary in under a minute. Detailed, actionable, ready to explore.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-stone-900 tracking-tight">
              Three steps to your perfect trip
            </h2>
          </div>
          
          <div className="space-y-8">
            <div className="flex items-start gap-6 p-6 bg-white rounded-2xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-stone-900 text-white flex items-center justify-center font-medium text-lg shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-stone-900">Tell us about your trip</h3>
                <p className="text-stone-600">When you're traveling, which cities interest you, your pace, and what kind of experiences you're looking for.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-6 p-6 bg-white rounded-2xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-stone-900 text-white flex items-center justify-center font-medium text-lg shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-stone-900">AI crafts your itinerary</h3>
                <p className="text-stone-600">Our AI builds a personalized day-by-day plan with specific restaurants, hidden spots, and insider tips for each location.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-6 p-6 bg-white rounded-2xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-stone-900 text-white flex items-center justify-center font-medium text-lg shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-stone-900">Explore with confidence</h3>
                <p className="text-stone-600">Book experiences, save your itinerary, and start your journey knowing you have a plan built by someone who truly knows Japan.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-stone-900 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-amber-400 text-sm font-medium tracking-[0.2em] uppercase mb-6">
            Our Philosophy
          </p>
          <h2 className="text-2xl md:text-3xl font-light leading-relaxed mb-8">
            "Japan isn't just a destination. It's a culture, a way of seeing the world. 
            JapanWise is your first step into that world — whether you're planning 
            your first trip or falling deeper in love with a place you've visited before."
          </h2>
          <div className="w-16 h-px bg-amber-400 mx-auto"></div>
        </div>
      </section>

      {/* Mobile Sample Card (shown only on mobile) */}
      <section className="py-16 bg-white lg:hidden">
        <div className="max-w-md mx-auto px-6">
          <p className="text-center text-sm text-stone-500 mb-6">What you'll get</p>
          <div className="bg-stone-50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-stone-900 text-white px-3 py-1 rounded-full text-xs font-medium">
                Day 1
              </span>
              <span className="text-stone-500 text-sm">Tokyo</span>
            </div>
            <h3 className="text-lg font-semibold text-stone-900 mb-5">Arrival & Shinjuku Discovery</h3>
            
            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <Camera className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="w-px h-full bg-stone-200 mt-2"></div>
                </div>
                <div className="pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-stone-500">15:00</span>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">¥500</span>
                  </div>
                  <h4 className="font-medium text-stone-900 text-sm">Shinjuku Gyoen</h4>
                  <p className="text-stone-600 text-xs mt-1">Beautiful garden perfect for recovering from jet lag</p>
                  <p className="text-xs text-amber-600 mt-2 flex items-start gap-1">
                    <Sparkles className="w-3 h-3 mt-0.5 shrink-0" />
                    Enter from Okido Gate — less crowded than main entrance
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                  <Utensils className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-stone-500">18:00</span>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">¥2,000-3,000</span>
                  </div>
                  <h4 className="font-medium text-stone-900 text-sm">Omoide Yokocho — Torishige</h4>
                  <p className="text-stone-600 text-xs mt-1">Tiny 8-seat yakitori joint run by the same family since 1950</p>
                  <p className="text-xs text-amber-600 mt-2 flex items-start gap-1">
                    <Sparkles className="w-3 h-3 mt-0.5 shrink-0" />
                    Order the 'negima' and 'sunagimo'. Cash only.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=2070')",
          }}
        >
          <div className="absolute inset-0 bg-stone-900/90"></div>
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-6 tracking-tight">
            Ready to discover Japan?
          </h2>
          <p className="text-stone-400 mb-10 text-lg">
            Free to use. No signup required. Your journey starts now.
          </p>
          <a
            href="/plan"
            className="group inline-flex items-center justify-center gap-2 bg-white text-stone-900 text-base font-medium px-10 py-4 rounded-full hover:bg-amber-400 transition-all duration-300"
          >
            Create Your Itinerary
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-stone-900 border-t border-stone-800">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-stone-500 text-sm">
            © 2026 JapanWise
          </p>
          <p className="text-stone-600 text-sm">
            Crafted with 心 for travelers to Japan
          </p>
        </div>
      </footer>
    </main>
  );
}