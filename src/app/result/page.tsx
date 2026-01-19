"use client";

import { useState, useEffect } from "react";

type DayPlan = {
  day: number;
  date: string;
  city: string;
  morning: Activity;
  lunch: Activity;
  afternoon: Activity;
  dinner: Activity;
  evening?: Activity;
};

type Activity = {
  name: string;
  description: string;
  tip?: string;
  duration?: string;
  budget?: string;
  englishSupport?: string;
  mapUrl?: string;
};

export default function ResultPage() {
  const [loading, setLoading] = useState(true);
  const [itinerary, setItinerary] = useState<DayPlan[]>([]);
  const [tripInfo, setTripInfo] = useState<{
    cities: string[];
    startDate: string;
    endDate: string;
    travelStyle: string;
  } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const generateItinerary = async () => {
      const savedForm = localStorage.getItem("japanwise_form");
      if (!savedForm) {
        setError("No trip data found. Please go back and fill out the form.");
        setLoading(false);
        return;
      }

      const formData = JSON.parse(savedForm);
      setTripInfo({
        cities: formData.cities,
        startDate: formData.startDate,
        endDate: formData.endDate,
        travelStyle: formData.travelStyle,
      });

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: savedForm,
        });

        if (!response.ok) {
          throw new Error("Failed to generate itinerary");
        }

        const data = await response.json();
        setItinerary(data.itinerary);
      } catch (err) {
        setError("Failed to generate itinerary. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    generateItinerary();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Creating your perfect itinerary...
          </h2>
          <p className="text-gray-600">
            Our AI is crafting a personalized Japan adventure for you.
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <a
            href="/plan"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <a href="/plan" className="text-red-600 hover:text-red-700">
            ← Modify Trip
          </a>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your Japan Itinerary
          </h1>
          {tripInfo && (
            <p className="text-gray-600">
              {tripInfo.cities.join(" → ")} • {tripInfo.startDate} to {tripInfo.endDate}
            </p>
          )}
        </div>

        {tripInfo && tripInfo.cities.length > 1 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🚄</div>
              <div>
                <h3 className="font-semibold text-green-800">JR Pass Recommended!</h3>
                <p className="text-green-700 text-sm">
                  You are visiting multiple cities. A 7-day JR Pass could save you money on shinkansen travel.
                </p>
                <a
                  href="https://www.klook.com/activity/1420-7-day-jr-pass-japan/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-sm text-green-800 underline hover:text-green-900"
                >
                  Get JR Pass on Klook →
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {itinerary.map((day) => (
            <div key={day.day} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-red-600 text-white px-6 py-4">
                <h2 className="text-xl font-bold">Day {day.day}: {day.city}</h2>
                <p className="text-red-100">{day.date}</p>
              </div>

              <div className="divide-y">
                <ActivityBlock time="Morning" emoji="🌅" activity={day.morning} />
                <ActivityBlock time="Lunch" emoji="🍱" activity={day.lunch} />
                <ActivityBlock time="Afternoon" emoji="☀️" activity={day.afternoon} />
                <ActivityBlock time="Dinner" emoji="🍽️" activity={day.dinner} />
                {day.evening && <ActivityBlock time="Evening" emoji="🌙" activity={day.evening} />}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-2">🏨 Book Your Hotels</h3>
          <p className="text-blue-700 mb-4">
            Get the best rates on hotels in {tripInfo?.cities.join(", ")}.
          </p>
          <a
            href={"https://www.booking.com/searchresults.html?ss=" + (tripInfo?.cities[0] || "Tokyo") + "&lang=en-us"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Search Hotels on Booking.com →
          </a>
        </div>

        <div className="mt-8 text-center text-gray-500">
          <p>
            Want to modify your itinerary? <a href="/plan" className="text-red-600 underline">Start over</a>
          </p>
        </div>
      </div>
    </main>
  );
}

function ActivityBlock({ time, emoji, activity }: { time: string; emoji: string; activity: Activity }) {
  return (
    <div className="px-6 py-4">
      <div className="flex items-start gap-4">
        <div className="text-2xl">{emoji}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-500">{time}</span>
            {activity.duration && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{activity.duration}</span>
            )}
            {activity.budget && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">{activity.budget}</span>
            )}
          </div>
          <h4 className="text-lg font-semibold text-gray-900">{activity.name}</h4>
          <p className="text-gray-600 mt-1">{activity.description}</p>
          {activity.tip && (
            <p className="text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded mt-2">💡 Tip: {activity.tip}</p>
          )}
          {activity.englishSupport && (
            <p className="text-sm text-gray-500 mt-2">🗣️ English: {activity.englishSupport}</p>
          )}
        </div>
      </div>
    </div>
  );
}
