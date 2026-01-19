"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PlanPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    cities: [] as string[],
    travelStyle: "",
    interests: [] as string[],
    budget: "",
    englishLevel: "",
    additionalNotes: "",
  });

  const cityOptions = [
    "Tokyo",
    "Kyoto",
    "Osaka",
    "Hiroshima",
    "Nara",
    "Hakone",
    "Nikko",
    "Kanazawa",
    "Fukuoka",
    "Sapporo",
    "Okinawa",
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
  ];

  const toggleCity = (city: string) => {
    setFormData((prev) => ({
      ...prev,
      cities: prev.cities.includes(city)
        ? prev.cities.filter((c) => c !== city)
        : [...prev.cities, city],
    }));
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store form data and navigate to results
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
          {/* Dates */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">📅 When are you traveling?</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Cities */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">🗾 Where do you want to go?</h2>
            <p className="text-sm text-gray-600 mb-4">Select one or more cities</p>
            <div className="flex flex-wrap gap-2">
              {cityOptions.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => toggleCity(city)}
                  className={`px-4 py-2 rounded-full border transition ${
                    formData.cities.includes(city)
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-red-600"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Travel Style */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">🎒 What's your travel style?</h2>
            <div className="space-y-2">
              {[
                { value: "budget", label: "Budget - Hostels, cheap eats, saving money" },
                { value: "mid", label: "Mid-range - Comfortable hotels, good restaurants" },
                { value: "luxury", label: "Luxury - High-end ryokans, fine dining" },
              ].map((style) => (
                <label
                  key={style.value}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                    formData.travelStyle === style.value
                      ? "border-red-600 bg-red-50"
                      : "border-gray-300 hover:border-red-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="travelStyle"
                    value={style.value}
                    checked={formData.travelStyle === style.value}
                    onChange={(e) =>
                      setFormData({ ...formData, travelStyle: e.target.value })
                    }
                    className="sr-only"
                  />
                  <span>{style.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">❤️ What are you interested in?</h2>
            <p className="text-sm text-gray-600 mb-4">Select all that apply</p>
            <div className="grid grid-cols-2 gap-2">
              {interestOptions.map((interest) => (
                <button
                  key={interest.id}
                  type="button"
                  onClick={() => toggleInterest(interest.id)}
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

          {/* English Level Preference */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">🗣️ How important is English support?</h2>
            <div className="space-y-2">
              {[
                { value: "essential", label: "Essential - I need English menus and staff" },
                { value: "preferred", label: "Preferred - English is nice but not required" },
                { value: "adventurous", label: "Adventurous - I'm okay with Japanese-only spots" },
              ].map((level) => (
                <label
                  key={level.value}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                    formData.englishLevel === level.value
                      ? "border-red-600 bg-red-50"
                      : "border-gray-300 hover:border-red-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="englishLevel"
                    value={level.value}
                    checked={formData.englishLevel === level.value}
                    onChange={(e) =>
                      setFormData({ ...formData, englishLevel: e.target.value })
                    }
                    className="sr-only"
                  />
                  <span>{level.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">📝 Anything else we should know?</h2>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32"
              placeholder="E.g., I'm traveling with my partner for our honeymoon, we love trying local sake, and we want to avoid crowded tourist spots..."
              value={formData.additionalNotes}
              onChange={(e) =>
                setFormData({ ...formData, additionalNotes: e.target.value })
              }
            />
          </div>

          {/* Submit */}
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