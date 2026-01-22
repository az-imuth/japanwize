"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Calendar, Plane, Users, MapPin, Utensils, Gauge, Heart, 
  Settings, ChevronDown, ChevronUp, ArrowRight, ArrowLeft,
  Sun, Moon, Sunrise, Baby, User, UserPlus, Home as HomeIcon,
  Sparkles, Camera, ShoppingBag, Beer, Palette, Castle, Gamepad2,
  Flame, Mountain, TreePine, Check
} from "lucide-react";

export default function PlanPage() {
  const router = useRouter();
  const [showOptional, setShowOptional] = useState(false);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    arrivalAirport: "",
    arrivalTime: "",
    departureAirport: "",
    departureTime: "",
    ageRange: "",
    travelerType: "",
    japanExperience: "",
    cities: [] as string[],
    mustVisit: "",
    accommodationStyle: "",
    foodStyle: "",
    pace: "",
    tripPurpose: "",
    interests: [] as string[],
    morningPerson: "",
    englishLevel: "",
    dietaryRestrictions: [] as string[],
    avoidances: [] as string[],
    additionalNotes: "",
  });

  // Calculate progress
  const requiredFields = ['startDate', 'endDate', 'arrivalAirport', 'departureAirport', 'ageRange', 'travelerType', 'japanExperience', 'accommodationStyle', 'foodStyle', 'pace'];
  const filledRequired = requiredFields.filter(field => {
    const value = formData[field as keyof typeof formData];
    return value && (typeof value === 'string' ? value.length > 0 : true);
  }).length;
  const progress = Math.round((filledRequired / requiredFields.length) * 100);

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
    { value: "morning", label: "Morning (6am - 12pm)", icon: Sunrise },
    { value: "afternoon", label: "Afternoon (12pm - 5pm)", icon: Sun },
    { value: "evening", label: "Evening (5pm - 9pm)", icon: Sun },
    { value: "night", label: "Night (9pm+)", icon: Moon },
  ];

  const ageOptions = [
    { value: "18-25", label: "18-25" },
    { value: "26-35", label: "26-35" },
    { value: "36-50", label: "36-50" },
    { value: "51-65", label: "51-65" },
    { value: "65+", label: "65+" },
  ];

  const travelerTypeOptions = [
    { value: "solo-female", label: "Solo female", icon: User },
    { value: "solo-male", label: "Solo male", icon: User },
    { value: "couple", label: "Couple", icon: Users },
    { value: "friends", label: "Friends group", icon: UserPlus },
    { value: "family-young", label: "Family (kids 0-6)", icon: Baby },
    { value: "family-kids", label: "Family (kids 7-12)", icon: Users },
    { value: "family-teens", label: "Family (teens)", icon: Users },
    { value: "multi-gen", label: "Multi-generational", icon: HomeIcon },
  ];

  const japanExpOptions = [
    { value: "first", label: "First time in Japan", desc: "We'll include iconic spots with local secrets" },
    { value: "second", label: "Been once before", desc: "Mix of popular and hidden gems" },
    { value: "frequent", label: "3+ times visitor", desc: "Focus on unique experiences" },
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
    { value: "backpacker", label: "Backpacker", desc: "Hostels, capsule hotels", price: "~$40/night" },
    { value: "comfortable", label: "Comfortable", desc: "Business hotels, good location", price: "$40-100" },
    { value: "nice", label: "Nice", desc: "Quality hotels, some ryokan", price: "$100-200" },
    { value: "premium", label: "Premium", desc: "Luxury hotels, traditional ryokan", price: "$200+" },
  ];

  const foodOptions = [
    { value: "budget", label: "Budget", desc: "Convenience stores, ramen, casual", price: "$15-25/day" },
    { value: "local", label: "Local Eats", desc: "Good local spots, izakaya", price: "$25-50/day" },
    { value: "foodie", label: "Foodie", desc: "Popular restaurants, food experiences", price: "$50-100/day" },
    { value: "gourmet", label: "Gourmet", desc: "High-end sushi, kaiseki, omakase", price: "$100+/day" },
  ];

  const paceOptions = [
    { value: "relaxed", label: "Relaxed", desc: "2-3 spots per day" },
    { value: "moderate", label: "Moderate", desc: "4-5 spots per day" },
    { value: "intensive", label: "Intensive", desc: "Pack it all in!" },
  ];

  const purposeOptions = [
    { value: "general", label: "General sightseeing" },
    { value: "honeymoon", label: "Honeymoon / Anniversary" },
    { value: "birthday", label: "Birthday trip" },
    { value: "cherry-blossom", label: "Cherry blossom viewing" },
    { value: "autumn-leaves", label: "Autumn leaves viewing" },
    { value: "anime", label: "Anime / Game pilgrimage" },
    { value: "food-tour", label: "Food-focused tour" },
    { value: "shopping", label: "Shopping-focused" },
    { value: "nature", label: "Nature / Hiking" },
    { value: "relaxation", label: "Onsen / Relaxation" },
  ];

  const interestOptions = [
    { id: "temples", label: "Temples & Shrines", icon: Castle },
    { id: "food", label: "Food & Dining", icon: Utensils },
    { id: "nature", label: "Nature & Gardens", icon: TreePine },
    { id: "shopping", label: "Shopping", icon: ShoppingBag },
    { id: "nightlife", label: "Nightlife & Bars", icon: Beer },
    { id: "art", label: "Art & Museums", icon: Palette },
    { id: "history", label: "History & Culture", icon: Castle },
    { id: "anime", label: "Anime & Pop Culture", icon: Gamepad2 },
    { id: "onsen", label: "Onsen (Hot Springs)", icon: Flame },
    { id: "hiking", label: "Hiking & Outdoors", icon: Mountain },
    { id: "photography", label: "Photography spots", icon: Camera },
    { id: "traditional", label: "Traditional experiences", icon: Sparkles },
  ];

  const morningOptions = [
    { value: "early", label: "Early bird", desc: "I can wake up at 6am" },
    { value: "normal", label: "Normal", desc: "8-9am start is fine" },
    { value: "late", label: "Night owl", desc: "Let me sleep in" },
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
    { value: "crowds", label: "Crowded spots" },
    { value: "walking", label: "Too much walking" },
    { value: "stairs", label: "Lots of stairs" },
    { value: "expensive", label: "Expensive places" },
    { value: "touristy", label: "Overly touristy" },
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
    <main className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </a>
            <a href="/" className="text-xl font-semibold text-stone-900">
              JapanWise
            </a>
            <div className="w-16"></div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
              <span>Progress</span>
              <span>{progress}% complete</span>
            </div>
            <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-light text-stone-900 tracking-tight mb-2">
            Plan Your Japan Trip
          </h1>
          <p className="text-stone-600">
            Tell us about your ideal trip. The more you share, the better your itinerary.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* ===== WHEN ===== */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-medium text-stone-900">When are you traveling?</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Start Date <span className="text-amber-600">*</span>
                </label>
                <input
                  type="date"
                  required
                  className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  End Date <span className="text-amber-600">*</span>
                </label>
                <input
                  type="date"
                  required
                  className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center">
                <Plane className="w-5 h-5 text-stone-600" />
              </div>
              <h3 className="text-lg font-medium text-stone-900">Flights</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Arrival Airport <span className="text-amber-600">*</span>
                </label>
                <select
                  required
                  className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all bg-white"
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
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Arrival Time
                </label>
                <select
                  className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all bg-white"
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Departure Airport <span className="text-amber-600">*</span>
                </label>
                <select
                  required
                  className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all bg-white"
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
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Departure Time
                </label>
                <select
                  className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all bg-white"
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
          </section>

          {/* ===== WHO ===== */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-medium text-stone-900">About you</h2>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-stone-700 mb-3">
                Age Range <span className="text-amber-600">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {ageOptions.map((age) => (
                  <button
                    key={age.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, ageRange: age.value })}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                      formData.ageRange === age.value
                        ? "bg-stone-900 text-white border-stone-900"
                        : "bg-white text-stone-700 border-stone-300 hover:border-stone-400"
                    }`}
                  >
                    {age.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-stone-700 mb-3">
                Who's traveling? <span className="text-amber-600">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {travelerTypeOptions.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, travelerType: type.value })}
                      className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                        formData.travelerType === type.value
                          ? "bg-stone-900 text-white border-stone-900"
                          : "bg-white text-stone-700 border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-3">
                Japan Experience <span className="text-amber-600">*</span>
              </label>
              <div className="space-y-2">
                {japanExpOptions.map((exp) => (
                  <button
                    key={exp.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, japanExperience: exp.value })}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      formData.japanExperience === exp.value
                        ? "bg-stone-900 text-white border-stone-900"
                        : "bg-white text-stone-700 border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <span className="font-medium">{exp.label}</span>
                    <span className={`block text-sm mt-1 ${
                      formData.japanExperience === exp.value ? "text-stone-300" : "text-stone-500"
                    }`}>
                      {exp.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ===== WHERE ===== */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-medium text-stone-900">Where do you want to go?</h2>
            </div>
            
            <p className="text-sm text-stone-500 mb-4">Select one or more cities</p>
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
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                    formData.cities.includes(city.value)
                      ? "bg-stone-900 text-white border-stone-900"
                      : "bg-white text-stone-700 border-stone-300 hover:border-stone-400"
                  }`}
                >
                  {city.label}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Any must-visit places?
              </label>
              <input
                type="text"
                className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                placeholder="E.g., teamLab, Fushimi Inari, a specific restaurant..."
                value={formData.mustVisit}
                onChange={(e) => setFormData({ ...formData, mustVisit: e.target.value })}
              />
            </div>
          </section>

          {/* ===== STYLE ===== */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-medium text-stone-900">Your travel style</h2>
            </div>
            
            {/* Accommodation */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-stone-700 mb-3">
                Accommodation <span className="text-amber-600">*</span>
              </label>
              <div className="space-y-2">
                {accommodationOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, accommodationStyle: opt.value })}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      formData.accommodationStyle === opt.value
                        ? "bg-stone-900 text-white border-stone-900"
                        : "bg-white text-stone-700 border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{opt.label}</span>
                        <span className={`text-sm ml-2 ${
                          formData.accommodationStyle === opt.value ? "text-stone-300" : "text-stone-500"
                        }`}>
                          — {opt.desc}
                        </span>
                      </div>
                      <span className={`text-sm font-medium ${
                        formData.accommodationStyle === opt.value ? "text-amber-400" : "text-stone-400"
                      }`}>
                        {opt.price}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Food */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Utensils className="w-4 h-4 text-stone-500" />
                <label className="text-sm font-medium text-stone-700">
                  Food Style <span className="text-amber-600">*</span>
                </label>
              </div>
              <div className="space-y-2">
                {foodOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, foodStyle: opt.value })}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      formData.foodStyle === opt.value
                        ? "bg-stone-900 text-white border-stone-900"
                        : "bg-white text-stone-700 border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{opt.label}</span>
                        <span className={`text-sm ml-2 ${
                          formData.foodStyle === opt.value ? "text-stone-300" : "text-stone-500"
                        }`}>
                          — {opt.desc}
                        </span>
                      </div>
                      <span className={`text-sm font-medium ${
                        formData.foodStyle === opt.value ? "text-amber-400" : "text-stone-400"
                      }`}>
                        {opt.price}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pace */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Gauge className="w-4 h-4 text-stone-500" />
                <label className="text-sm font-medium text-stone-700">
                  Daily Pace <span className="text-amber-600">*</span>
                </label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {paceOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, pace: opt.value })}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      formData.pace === opt.value
                        ? "bg-stone-900 text-white border-stone-900"
                        : "bg-white text-stone-700 border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <span className="font-medium block">{opt.label}</span>
                    <span className={`text-xs mt-1 block ${
                      formData.pace === opt.value ? "text-stone-300" : "text-stone-500"
                    }`}>
                      {opt.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trip Purpose */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-3">
                Trip Purpose
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
                    className={`px-3 py-2 rounded-full border text-sm transition-all ${
                      formData.tripPurpose === opt.value
                        ? "bg-stone-900 text-white border-stone-900"
                        : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ===== INTERESTS ===== */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Heart className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-medium text-stone-900">What interests you?</h2>
            </div>
            
            <p className="text-sm text-stone-500 mb-4">Select all that apply</p>
            <div className="grid grid-cols-2 gap-2">
              {interestOptions.map((interest) => {
                const Icon = interest.icon;
                return (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => toggleArray(
                      formData.interests, 
                      interest.id, 
                      (arr) => setFormData({ ...formData, interests: arr })
                    )}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                      formData.interests.includes(interest.id)
                        ? "bg-stone-900 text-white border-stone-900"
                        : "bg-white text-stone-700 border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{interest.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ===== OPTIONAL (Collapsible) ===== */}
          <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setShowOptional(!showOptional)}
              className="w-full p-6 text-left flex items-center justify-between hover:bg-stone-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-stone-600" />
                </div>
                <div>
                  <h2 className="text-xl font-medium text-stone-900">More preferences</h2>
                  <p className="text-sm text-stone-500">Optional but helps us personalize</p>
                </div>
              </div>
              {showOptional ? (
                <ChevronUp className="w-5 h-5 text-stone-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-stone-400" />
              )}
            </button>
            
            {showOptional && (
              <div className="p-6 pt-0 space-y-6 border-t border-stone-100">
                {/* Morning Person */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-3">
                    Are you a morning person?
                  </label>
                  <div className="space-y-2">
                    {morningOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, morningPerson: opt.value })}
                        className={`w-full p-3 rounded-xl border text-left transition-all ${
                          formData.morningPerson === opt.value
                            ? "bg-stone-900 text-white border-stone-900"
                            : "bg-white text-stone-700 border-stone-200 hover:border-stone-300"
                        }`}
                      >
                        <span className="font-medium">{opt.label}</span>
                        <span className={`text-sm ml-2 ${
                          formData.morningPerson === opt.value ? "text-stone-300" : "text-stone-500"
                        }`}>
                          — {opt.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dietary Restrictions */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-3">
                    Dietary restrictions
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
                        className={`px-3 py-2 rounded-full border text-sm transition-all ${
                          (opt.value === "none" && formData.dietaryRestrictions.length === 0) ||
                          formData.dietaryRestrictions.includes(opt.value)
                            ? "bg-stone-900 text-white border-stone-900"
                            : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Avoidances */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-3">
                    Anything to avoid?
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
                        className={`px-3 py-2 rounded-full border text-sm transition-all ${
                          formData.avoidances.includes(opt.value)
                            ? "bg-stone-900 text-white border-stone-900"
                            : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Anything else?
                  </label>
                  <textarea
                    className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"
                    rows={3}
                    placeholder="E.g., celebrating a birthday on Day 3, love sake, want to see sumo..."
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                  />
                </div>
              </div>
            )}
          </section>

          {/* ===== SUBMIT ===== */}
          <button
            type="submit"
            className="group w-full bg-stone-900 text-white text-lg font-medium px-8 py-4 rounded-full hover:bg-stone-800 transition-all flex items-center justify-center gap-2"
          >
            Generate My Itinerary
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-center text-sm text-stone-500">
            Free • No signup • Takes about 30 seconds
          </p>
        </form>
      </div>
    </main>
  );
}