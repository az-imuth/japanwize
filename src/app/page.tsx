"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Activity {
  time?: string;
  type?: "activity" | "food";
  name: string;
  description?: string;
  tip?: string;
  localTip?: string;
  duration?: string;
  cost?: string;
  cuisine?: string;
  price?: string;
  priceRange?: string;
}

interface DayPlan {
  day: number;
  date: string;
  city: string;
  theme: string;
  // New format
  activities?: Activity[];
  // Old format
  morning?: Activity;
  lunch?: Activity;
  afternoon?: Activity;
  dinner?: Activity;
  evening?: Activity;
  stayArea?: string;
}

interface Itinerary {
  summary: {
    totalDays: number;
    cities: string[];
    highlights: string[];
  };
  itinerary: DayPlan[];
  tips?: string[];
}

// Helper function to convert old format to activities array
function getActivities(day: DayPlan): Activity[] {
  // If activities array exists, use it
  if (day.activities && Array.isArray(day.activities)) {
    return day.activities;
  }
  
  // Otherwise, convert old format to activities array
  const activities: Activity[] = [];
  
  if (day.morning) {
    activities.push({ ...day.morning, time: day.morning.time || "09:00", type: "activity" });
  }
  if (day.lunch) {
    activities.push({ ...day.lunch, time: day.lunch.time || "12:00", type: "food" });
  }
  if (day.afternoon) {
    activities.push({ ...day.afternoon, time: day.afternoon.time || "14:00", type: "activity" });
  }
  if (day.dinner) {
    activities.push({ ...day.dinner, time: day.dinner.time || "18:00", type: "food" });
  }
  if (day.evening) {
    activities.push({ ...day.evening, time: day.evening.time || "20:00", type: "activity" });
  }
  
  return activities;
}

export default function ResultPage() {
  const router = useRouter();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(1);

  useEffect(() => {
    const generateItinerary = async () => {
      try {
        const savedForm = localStorage.getItem("japanwise_form");
        if (!savedForm) {
          router.push("/plan");
          return;
        }

        const formData = JSON.parse(savedForm);
        
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to generate itinerary");
        }

        const data = await response.json();
        console.log("Received itinerary data:", data); // Debug log
        setItinerary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    generateItinerary();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Creating your perfect itinerary...</h2>
          <p className="text-gray-500 mt-2">This may take up to 30 seconds</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/plan")}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!itinerary || !itinerary.itinerary || itinerary.itinerary.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">No itinerary data</h2>
          <button
            onClick={() => router.push("/plan")}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  const currentDay = itinerary.itinerary.find((d) => d.day === selectedDay) || itinerary.itinerary[0];
  const currentActivities = getActivities(currentDay);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="text-2xl font-bold text-red-600">
              JapanWise
            </a>
            <button
              onClick={() => router.push("/plan")}
              className="text-gray-600 hover:text-red-600"
            >
              ← Edit Trip
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your {itinerary.summary?.totalDays || itinerary.itinerary.length}-Day Japan Adventure
          </h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {(itinerary.summary?.cities || []).map((city) => (
              <span
                key={city}
                className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                {city}
              </span>
            ))}
          </div>
          {itinerary.summary?.highlights && (
            <div className="text-gray-600">
              <strong>Highlights:</strong> {itinerary.summary.highlights.join(" • ")}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Day Selector */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
              <h3 className="font-semibold text-gray-700 mb-3">Select Day</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {itinerary.itinerary.map((day) => (
                  <button
                    key={day.day}
                    onClick={() => setSelectedDay(day.day)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedDay === day.day
                        ? "bg-red-600 text-white"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="font-semibold">Day {day.day}</div>
                    <div className={`text-sm ${selectedDay === day.day ? "text-red-100" : "text-gray-500"}`}>
                      {day.city}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Day Details */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Day {currentDay.day}
                  </span>
                  <span className="text-gray-500">{currentDay.date}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{currentDay.city}</h2>
                <p className="text-gray-600">{currentDay.theme}</p>
              </div>

              {/* Activities Timeline */}
              <div className="space-y-6">
                {currentActivities.length > 0 ? (
                  currentActivities.map((activity, index) => (
                    <ActivityCard key={index} activity={activity} />
                  ))
                ) : (
                  <p className="text-gray-500">No activities for this day</p>
                )}
              </div>

              {/* Stay Area */}
              {currentDay.stayArea && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-xl">🏨</span>
                    <span>
                      <strong>Stay tonight:</strong> {currentDay.stayArea} area
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Tips Section */}
            {itinerary.tips && itinerary.tips.length > 0 && (
              <div className="bg-yellow-50 rounded-lg p-6 mt-6">
                <h3 className="font-semibold text-yellow-800 mb-3">💡 Pro Tips</h3>
                <ul className="space-y-2">
                  {itinerary.tips.map((tip, index) => (
                    <li key={index} className="text-yellow-700 flex items-start gap-2">
                      <span>•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function ActivityCard({ activity }: { activity: Activity }) {
  if (!activity || !activity.name) {
    return null;
  }
  
  const isFood = activity.type === "food" || !!activity.cuisine;
  const tip = activity.tip || activity.localTip;
  const price = activity.price || activity.priceRange || activity.cost;

  return (
    <div className={`border-l-4 ${isFood ? "border-orange-400" : "border-red-400"} pl-4 py-2`}>
      <div className="flex items-center gap-2 mb-1">
        {activity.time && (
          <span className="text-sm font-medium text-gray-500">{activity.time}</span>
        )}
        {activity.duration && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
            {activity.duration}
          </span>
        )}
        {price && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
            {price}
          </span>
        )}
      </div>
      
      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
        {isFood ? "🍽️" : "📍"} {activity.name}
        {activity.cuisine && (
          <span className="text-sm font-normal text-gray-500">({activity.cuisine})</span>
        )}
      </h4>
      
      {activity.description && (
        <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
      )}
      
      {tip && (
        <p className="text-sm text-red-600 mt-2 flex items-start gap-1">
          <span>💡</span>
          <span>{tip}</span>
        </p>
      )}
    </div>
  );
}