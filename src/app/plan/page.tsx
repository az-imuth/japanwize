"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PlanPage() {
  const router = useRouter();
  const [showOptional, setShowOptional] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    startDate: "",
    endDate: "",
    arrivalAirport: "",
    arrivalTime: "",
    departureAirport: "",
    departureTime: "",
    
    // Step 2: About You
    ageRange: "",
    travelerType: "",
    japanExperience: "",
    
    // Step 3: Destinations
    cities: [] as string[],
    mustVisit: "",
    
    // Step 4: Style
    accommodationStyle: "",
    foodStyle: "",
    pace: "",
    tripPurpose: "",
    
    // Step 5: Interests
    interests: [] as string[],
    
    // Step 6: Optional
    morningPerson: "",
    englishLevel: "",
    dietaryRestrictions: [] as string[],
    avoidances: [] as string[],
    additionalNotes: "",
  });

  const airportOptions = [
    { value: "NRT", label: "Tokyo Narita (NRT)" },
    { value: "HND", label: "Tokyo Haneda (HND)" },
    { value: "KIX", label: "Osaka Kansai (KIX)" },
    { value: "NGO", label: "Nagoya Centrair (NGO)" },
    { value: "FUK", label: "Fukuoka (FUK)" },
    { value: "CTS", label: "Sapporo New Chitose (CTS)" },
    { value: "OKA", label: "Okinawa Naha (OKA)" },
  ];

  const timeOptions = [
    { value: "morning", label: "Morning (6am - 12pm)" },
    { value: "afternoon", label: "Afternoon (12pm - 5pm)" },
    { value: "evening", label: "Evening (5pm - 9pm)" },
    { value: "night", label: "Night (9pm+)" },
  ];

  const ageOptions = [
    { value: "18-25", label: "18-25" },
    { value: "26-35", label: "26-35" },
    { value: "36-50", label: "36-50" },
    { value: "51-65", label: "51-65" },
    { value: "65+", label: "65+" },
  ];

  const travelerTypeOptions = [
    { value: "solo-female", label: "Solo female traveler", emoji: "👩" },
    { value: "solo-male", label: "Solo male traveler", emoji: "👨" },
    { value: "couple", label: "Couple", emoji: "👫" },
    { value: "friends", label: "Friends group", emoji: "👥" },
    { value: "family-young", label: "Family with young kids (0-6)", emoji: "👶" },
    { value: "family-kids", label: "Family with kids (7-12)", emoji: "👨‍👩‍👧" },
    { value: "family-teens", label: "Family with teens (13-17)", emoji: "👨‍👩‍👧‍👦" },
    { value: "multi-gen", label: "Multi-generational (with seniors)", emoji: "👴" },
  ];

  const japanExpOptions = [
    { value: "first", label: "First time in Japan", emoji: "🌸" },
    { value: "second", label: "Been once before", emoji: "🔄" },
    { value: "frequent", label: "3+ times (frequent visitor)", emoji: "🎌" },
  ];

  const cityOptions = [
    { value: "tokyo", label: "Tokyo", region: "Kanto" },
    { value: "kyoto", label: "Kyoto", region: "Kansai" },
    { value: "osaka", label: "Osaka", region: "Kansai" },
    { value: "nara", label: "Nara", region: "Kansai" },
    { value: "hiroshima", label: "Hiroshima", region: "West" },
    { value: "hakone", label: "Hakone", region: "Kanto" },
    { value: "nikko", label: "Nikko", region: "Kanto" },
    { value: "kanazawa", label: "Kanazawa", region: "Hokuriku" },
    { value: "takayama", label: "Takayama", region: "Chubu" },
    { value: "fukuoka", label: "Fukuoka", region: "Kyushu" },
    { value: "sapporo", label: "Sapporo", region: "Hokkaido" },
    { value: "okinawa", label: "Okinawa", region: "Okinawa" },
  ];

  const accommodationOptions = [
    { 
      value: "backpacker", 
      label: "Backpacker", 
      desc: "Hostels, capsule hotels",
      price: "~$40/night"
    },
    { 
      value: "comfortable", 
      label: "Comfortable", 
      desc: "Business hotels, good location",
      price: "$40-100/night"
    },
    { 
      value: "nice", 
      label: "Nice", 
      desc: "Quality hotels, some ryokan",
      price: "$100-200/night"
    },
    { 
      value: "premium", 
      label: "Premium", 
      desc: "Luxury hotels, traditional ryokan",
      price: "$200+/night"
    },
  ];

  const foodOptions = [
    { 
      value: "budget", 
      label: "Budget", 
      desc: "Convenience stores, ramen, casual",
      price: "$15-25/day"
    },
    { 
      value: "local", 
      label: "Local Eats", 
      desc: "Good local spots, izakaya",
      price: "$25-50/day"
    },
    { 
      value: "foodie", 
      label: "Foodie", 
      desc: "Popular restaurants, food experiences",
      price: "$50-100/day"
    },
    { 
      value: "gourmet", 
      label: "Gourmet", 
      desc: "High-end sushi, kaiseki, omakase",
      price: "$100+/day"
    },
  ];

  const paceOptions = [
    { value: "relaxed", label: "Relaxed", desc: "2-3 spots per day, plenty of rest", emoji: "🐢" },
    { value: "moderate", label: "Moderate", desc: "4-5 spots, good balance", emoji: "🚶" },
    { value: "intensive", label: "Intensive", desc: "Pack in as much as possible!", emoji: "⚡" },
  ];

  const purposeOptions = [
    { value: "general", label: "General sightseeing", emoji: "📸" },
    { value: "honeymoon", label: "Honeymoon / Anniversary", emoji: "💕" },
    { value: "birthday", label: "Birthday trip", emoji: "🎂" },
    { value: "cherry-blossom", label: "Cherry blossom viewing", emoji: "🌸" },
    { value: "autumn-leaves", label: "Autumn leaves viewing", emoji: "🍁" },
    { value: "anime", label: "Anime / Game pilgrimage", emoji: "🎮" },
    { value: "food-tour", label: "Food-focused tour", emoji: "🍣" },
    { value: "shopping", label: "Shopping-focused", emoji: "🛍️" },
    { value: "nature", label: "Nature / Hiking", emoji: "🏔️" },
    { value: "relaxation", label: "Onsen / Relaxation", emoji: "♨️" },
  ];

  const interestOptions = [
    { id: "temples", label: "Temples & Shrines", emoji: "⛩️" },
    { id: "food", label: "Food & Dining", emoji: "🍣" },
    { id: "nature", label: "Nature & Gardens", emoji: "🌸" },
    { id: "shopping", label: "Shopping", emoji: "🛍️" },
    { id: "nightlife", label: "Nightlife & Bars", emoji: "🍺" },
    { id: "art", label: "Art & Museums", emoji: "🎨" },
    { id: "history", label: "History & Culture", emoji: "🏯" },
    { id: "anime", label: "Anime & Pop Culture", emoji: "🎮" },
    { id: "onsen", label: "Onsen (Hot Springs)", emoji: "♨️" },
    { id: "hiking", label: "Hiking & Outdoors", emoji: "🥾" },
    { id: "photography", label: "Photography spots", emoji: "📷" },
    { id: "traditional", label: "Traditional experiences", emoji: "👘" },
  ];

  const morningOptions = [
    { value: "early", label: "Early bird - I can wake up at 6am", emoji: "🌅" },
    { value: "normal", label: "Normal - 8-9am start is fine", emoji: "🌤️" },
    { value: "late", label: "Night owl - Let me sleep in", emoji: "🌙" },
  ];

  const englishOptions = [
    { value: "essential", label: "Essential - I need English menus and staff" },
    { value: "preferred", label: "Preferred - English is nice but not required" },
    { value: "adventurous", label: "Adventurous - I'm okay with Japanese-only spots" },
  ];

  const dietaryOptions = [
    { value: "none", label: "No restrictions" },
    { value: "vegetarian", label: "Vegetarian" },
    { value: "vegan", label: "Vegan" },
    { value: "halal", label: "Halal" },
    { value: "gluten-free", label: "Gluten-free" },
    { value: "seafood", label: "No seafood" },
    { value: "pork", label: "No pork" },
  ];

  const avoidanceOptions = [
    { value: "crowds", label: "Crowded tourist spots", emoji: "👥" },
    { value: "walking", label: "Too much walking", emoji: "🦶" },
    { value: "stairs", label: "Lots of stairs", emoji: "🪜" },
    { value: "expensive", label: "Expensive places", emoji: "💸" },
    { value: "touristy", label: "Overly touristy areas", emoji: "🎯" },
  ];

  const toggleArray = (array: string[], item: string, setter: (arr: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter((i) => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("japanwise_form", JSON.stringify(formData));
    router.push("/result");
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <a href="/" className="text-red-600 hover:text-red-700">
            ← Back to Home
          </a>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Plan Your Japan Trip
        </h1>
        <p className="text-gray-600 mb-8">
          Tell us about your ideal trip. The more you share, the better your itinerary.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* ===== STEP 1: BASIC INFO ===== */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">📅 When are you traveling?</h2>
            
            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            {/* Arrival */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Arrival Airport *
                </label>
                <select
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.arrivalAirport}
                  onChange={(e) => setFormData({ ...formData, arrivalAirport: e.target.value })}
                >
                  <option value="">Select airport</option>
                  {airportOptions.map((apt) => (
                    <option key={apt.value} value={apt.value}>{apt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Arrival Time
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.arrivalTime}
                  onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                >
                  <option value="">Select time</option>
                  {timeOptions.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Departure */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departure Airport *
                </label>
                <select
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.departureAirport}
                  onChange={(e) => setFormData({ ...formData, departureAirport: e.target.value })}
                >
                  <option value="">Select airport</option>
                  <option value="same">Same as arrival</option>
                  {airportOptions.map((apt) => (
                    <option key={apt.value} value={apt.value}>{apt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departure Time
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.departureTime}
                  onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                >
                  <option value="">Select time</option>
                  {timeOptions.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ===== STEP 2: ABOUT YOU ===== */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">👤 About You</h2>
            
            {/* Age */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age Range *
              </label>
              <div className="flex flex-wrap gap-2">
                {ageOptions.map((age) => (
                  <button
                    key={age.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, ageRange: age.value })}
                    className={`px-4 py-2 rounded-full border transition ${
                      formData.ageRange === age.value
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-red-600"
                    }`}
                  >
                    {age.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Traveler Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Who's traveling? *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {travelerTypeOptions.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, travelerType: type.value })}
                    className={`p-3 rounded-lg border text-left transition ${
                      formData.travelerType === type.value
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-red-600"
                    }`}
                  >
                    <span className="mr-2">{type.emoji}</span>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Japan Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Japan Experience *
              </label>
              <div className="space-y-2">
                {japanExpOptions.map((exp) => (
                  <button
                    key={exp.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, japanExperience: exp.value })}
                    className={`w-full p-3 rounded-lg border text-left transition ${
                      formData.japanExperience === exp.value
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-red-600"
                    }`}
                  >
                    <span className="mr-2">{exp.emoji}</span>
                    {exp.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ===== STEP 3: DESTINATIONS ===== */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">🗾 Where do you want to go?</h2>
            <p className="text-sm text-gray-600 mb-4">Select one or more cities</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {cityOptions.map((city) => (
                <button
                  key={city.value}
                  type="button"
                  onClick={() => toggleArray(
                    formData.cities, 
                    city.value, 
                    (arr) => setFormData({ ...formData, cities: arr })
                  )}
                  className={`px-4 py-2 rounded-full border transition ${
                    formData.cities.includes(city.value)
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-red-600"
                  }`}
                >
                  {city.label}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Any must-visit places? (optional)
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="E.g., teamLab, Fushimi Inari, a specific restaurant..."
                value={formData.mustVisit}
                onChange={(e) => setFormData({ ...formData, mustVisit: e.target.value })}
              />
            </div>
          </div>

          {/* ===== STEP 4: STYLE ===== */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">✨ Your Travel Style</h2>
            
            {/* Accommodation */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accommodation Style *
              </label>
              <div className="space-y-2">
                {accommodationOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, accommodationStyle: opt.value })}
                    className={`w-full p-4 rounded-lg border text-left transition ${
                      formData.accommodationStyle === opt.value
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-red-600"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-semibold">{opt.label}</span>
                        <span className="text-sm ml-2 opacity-80">- {opt.desc}</span>
                      </div>
                      <span className={`text-sm ${formData.accommodationStyle === opt.value ? "text-white" : "text-gray-500"}`}>
                        {opt.price}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Food */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Food Style *
              </label>
              <div className="space-y-2">
                {foodOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, foodStyle: opt.value })}
                    className={`w-full p-4 rounded-lg border text-left transition ${
                      formData.foodStyle === opt.value
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-red-600"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-semibold">{opt.label}</span>
                        <span className="text-sm ml-2 opacity-80">- {opt.desc}</span>
                      </div>
                      <span className={`text-sm ${formData.foodStyle === opt.value ? "text-white" : "text-gray-500"}`}>
                        {opt.price}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pace */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Pace *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {paceOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, pace: opt.value })}
                    className={`p-4 rounded-lg border text-center transition ${
                      formData.pace === opt.value
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-red-600"
                    }`}
                  >
                    <div className="text-2xl mb-1">{opt.emoji}</div>
                    <div className="font-semibold">{opt.label}</div>
                    <div className={`text-xs mt-1 ${formData.pace === opt.value ? "text-red-100" : "text-gray-500"}`}>
                      {opt.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Trip Purpose */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trip Purpose (optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {purposeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData({ 
                      ...formData, 
                      tripPurpose: formData.tripPurpose === opt.value ? "" : opt.value 
                    })}
                    className={`px-3 py-2 rounded-full border transition text-sm ${
                      formData.tripPurpose === opt.value
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-red-600"
                    }`}
                  >
                    <span className="mr-1">{opt.emoji}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ===== STEP 5: INTERESTS ===== */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">❤️ What are you interested in?</h2>
            <p className="text-sm text-gray-600 mb-4">Select all that apply</p>
            <div className="grid grid-cols-2 gap-2">
              {interestOptions.map((interest) => (
                <button
                  key={interest.id}
                  type="button"
                  onClick={() => toggleArray(
                    formData.interests, 
                    interest.id, 
                    (arr) => setFormData({ ...formData, interests: arr })
                  )}
                  className={`p-3 rounded-lg border text-left transition ${
                    formData.interests.includes(interest.id)
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-red-600"
                  }`}
                >
                  <span className="mr-2">{interest.emoji}</span>
                  {interest.label}
                </button>
              ))}
            </div>
          </div>

          {/* ===== STEP 6: OPTIONAL (Collapsible) ===== */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setShowOptional(!showOptional)}
              className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50"
            >
              <h2 className="text-xl font-semibold">🎯 Tell us more (optional)</h2>
              <span className="text-2xl">{showOptional ? "−" : "+"}</span>
            </button>
            
            {showOptional && (
              <div className="p-6 pt-0 space-y-6">
                {/* Morning Person */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Are you a morning person?
                  </label>
                  <div className="space-y-2">
                    {morningOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, morningPerson: opt.value })}
                        className={`w-full p-3 rounded-lg border text-left transition ${
                          formData.morningPerson === opt.value
                            ? "bg-red-600 text-white border-red-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-red-600"
                        }`}
                      >
                        <span className="mr-2">{opt.emoji}</span>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* English Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How important is English support?
                  </label>
                  <div className="space-y-2">
                    {englishOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, englishLevel: opt.value })}
                        className={`w-full p-3 rounded-lg border text-left transition ${
                          formData.englishLevel === opt.value
                            ? "bg-red-600 text-white border-red-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-red-600"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dietary Restrictions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Any dietary restrictions?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {dietaryOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          if (opt.value === "none") {
                            setFormData({ ...formData, dietaryRestrictions: [] });
                          } else {
                            toggleArray(
                              formData.dietaryRestrictions,
                              opt.value,
                              (arr) => setFormData({ ...formData, dietaryRestrictions: arr })
                            );
                          }
                        }}
                        className={`px-3 py-2 rounded-full border transition text-sm ${
                          (opt.value === "none" && formData.dietaryRestrictions.length === 0) ||
                          formData.dietaryRestrictions.includes(opt.value)
                            ? "bg-red-600 text-white border-red-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-red-600"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Avoidances */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Anything you want to avoid?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {avoidanceOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => toggleArray(
                          formData.avoidances,
                          opt.value,
                          (arr) => setFormData({ ...formData, avoidances: arr })
                        )}
                        className={`px-3 py-2 rounded-full border transition text-sm ${
                          formData.avoidances.includes(opt.value)
                            ? "bg-red-600 text-white border-red-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-red-600"
                        }`}
                      >
                        <span className="mr-1">{opt.emoji}</span>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Anything else we should know?
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
                    placeholder="E.g., I'm celebrating my partner's birthday on Day 3, we love sake..."
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ===== SUBMIT ===== */}
          <button
            type="submit"
            className="w-full bg-red-600 text-white text-lg font-semibold px-8 py-4 rounded-lg hover:bg-red-700 transition"
          >
            Generate My Itinerary →
          </button>
        </form>
      </div>
    </main>
  );
}