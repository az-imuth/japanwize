"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Download, MapPin, Clock, Sparkles, Utensils, 
  Camera, Train, Hotel, ChevronLeft, ChevronRight, Lightbulb,
  ExternalLink, Calendar, Share2, Loader2
} from "lucide-react";

// Klook Affiliate ID
const KLOOK_AID = "109190";

const KLOOK_KEYWORDS = [
  { keywords: ["teamlab", "team lab"], searchTerm: "teamlab tokyo" },
  { keywords: ["skytree", "sky tree"], searchTerm: "tokyo skytree" },
  { keywords: ["tokyo tower"], searchTerm: "tokyo tower" },
  { keywords: ["disneysea", "disney sea"], searchTerm: "tokyo disneysea" },
  { keywords: ["disneyland"], searchTerm: "tokyo disneyland" },
  { keywords: ["universal studios", "usj"], searchTerm: "universal studios japan" },
  { keywords: ["aquarium", "kaiyukan"], searchTerm: "osaka aquarium" },
  { keywords: ["jr pass", "rail pass"], searchTerm: "jr pass" },
  { keywords: ["ghibli museum"], searchTerm: "ghibli museum" },
  { keywords: ["shibuya sky"], searchTerm: "shibuya sky" },
  { keywords: ["cup noodle museum", "cup noodles museum"], searchTerm: "cup noodle museum" },
  { keywords: ["kimono rental", "kimono experience"], searchTerm: "kimono rental kyoto" },
  { keywords: ["tea ceremony"], searchTerm: "tea ceremony kyoto" },
  { keywords: ["sumo"], searchTerm: "sumo tokyo" },
  { keywords: ["cooking class"], searchTerm: "cooking class japan" },
  { keywords: ["mount fuji", "mt fuji", "mt. fuji"], searchTerm: "mount fuji day trip" },
  { keywords: ["hakone"], searchTerm: "hakone day trip" },
  { keywords: ["nara park", "nara day trip"], searchTerm: "nara day trip" },
  { keywords: ["fushimi inari tour"], searchTerm: "fushimi inari tour" },
  { keywords: ["arashiyama"], searchTerm: "arashiyama tour" },
  { keywords: ["nintendo"], searchTerm: "nintendo kyoto" },
  { keywords: ["onsen", "hot spring"], searchTerm: "onsen japan" },
];

function getKlookLink(activityName: string): string | null {
  const nameLower = activityName.toLowerCase();
  for (const item of KLOOK_KEYWORDS) {
    for (const keyword of item.keywords) {
      if (nameLower.includes(keyword)) {
        return `https://www.klook.com/en-US/search/result/?query=${encodeURIComponent(item.searchTerm)}&aid=${KLOOK_AID}`;
      }
    }
  }
  return null;
}

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
  activities?: Activity[];
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

function getActivities(day: DayPlan): Activity[] {
  if (day.activities && Array.isArray(day.activities)) {
    return day.activities;
  }
  
  const activities: Activity[] = [];
  if (day.morning) activities.push({ ...day.morning, time: day.morning.time || "09:00", type: "activity" });
  if (day.lunch) activities.push({ ...day.lunch, time: day.lunch.time || "12:00", type: "food" });
  if (day.afternoon) activities.push({ ...day.afternoon, time: day.afternoon.time || "14:00", type: "activity" });
  if (day.dinner) activities.push({ ...day.dinner, time: day.dinner.time || "18:00", type: "food" });
  if (day.evening) activities.push({ ...day.evening, time: day.evening.time || "20:00", type: "activity" });
  
  return activities;
}

export default function ResultPage() {
  const router = useRouter();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to generate itinerary");
        }

        const data = await response.json();
        setItinerary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    generateItinerary();
  }, [router]);

  const handleDownloadPdf = async () => {
    if (!itinerary) return;
    
    setGeneratingPdf(true);
    
    try {
      // Dynamic import to avoid SSR issues
      const { default: jsPDF } = await import("jspdf");
      
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let yPosition = margin;

      // Helper function to add new page if needed
      const checkNewPage = (requiredSpace: number) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };

      // Title
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("Your Japan Itinerary", margin, yPosition);
      yPosition += 12;

      // Subtitle
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text(`${itinerary.summary.totalDays} days • ${itinerary.summary.cities.join(" → ")}`, margin, yPosition);
      yPosition += 8;

      // Highlights
      if (itinerary.summary.highlights && itinerary.summary.highlights.length > 0) {
        doc.setFontSize(10);
        doc.setTextColor(150);
        const highlightsText = `Highlights: ${itinerary.summary.highlights.join(", ")}`;
        const splitHighlights = doc.splitTextToSize(highlightsText, contentWidth);
        doc.text(splitHighlights, margin, yPosition);
        yPosition += splitHighlights.length * 5 + 10;
      }

      // Line separator
      doc.setDrawColor(200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;

      // Each day
      for (const day of itinerary.itinerary) {
        checkNewPage(40);

        // Day header
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0);
        doc.text(`Day ${day.day} — ${day.city}`, margin, yPosition);
        yPosition += 6;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100);
        doc.text(`${day.date} • ${day.theme}`, margin, yPosition);
        yPosition += 8;

        // Activities
        const activities = getActivities(day);
        for (const activity of activities) {
          checkNewPage(25);

          const isFood = activity.type === "food" || !!activity.cuisine;
          
          // Time and name
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(0);
          const timeStr = activity.time ? `${activity.time} ` : "";
          const typeIcon = isFood ? "[Food] " : "";
          doc.text(`${timeStr}${typeIcon}${activity.name}`, margin + 5, yPosition);
          yPosition += 5;

          // Description
          if (activity.description) {
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(80);
            const splitDesc = doc.splitTextToSize(activity.description, contentWidth - 10);
            doc.text(splitDesc, margin + 5, yPosition);
            yPosition += splitDesc.length * 4 + 2;
          }

          // Tip
          const tip = activity.tip || activity.localTip;
          if (tip) {
            doc.setFontSize(9);
            doc.setFont("helvetica", "italic");
            doc.setTextColor(180, 120, 0); // amber color
            const splitTip = doc.splitTextToSize(`💡 ${tip}`, contentWidth - 10);
            doc.text(splitTip, margin + 5, yPosition);
            yPosition += splitTip.length * 4 + 4;
          }

          yPosition += 3;
        }

        // Stay area
        if (day.stayArea) {
          checkNewPage(10);
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(100);
          doc.text(`🏨 Stay: ${day.stayArea} area`, margin + 5, yPosition);
          yPosition += 8;
        }

        yPosition += 5;
      }

      // Tips section
      if (itinerary.tips && itinerary.tips.length > 0) {
        checkNewPage(30);
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0);
        doc.text("Pro Tips", margin, yPosition);
        yPosition += 8;

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80);
        
        for (const tip of itinerary.tips) {
          checkNewPage(15);
          const splitTip = doc.splitTextToSize(`• ${tip}`, contentWidth);
          doc.text(splitTip, margin, yPosition);
          yPosition += splitTip.length * 4 + 3;
        }
      }

      // Footer on last page
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text("Generated by JapanWise — japanwise.app", margin, pageHeight - 10);

      // Save
      doc.save(`japan-itinerary-${itinerary.summary.totalDays}days.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setGeneratingPdf(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-stone-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
          </div>
          <h2 className="text-xl font-medium text-stone-900 mb-2">Creating your itinerary...</h2>
          <p className="text-stone-500">Finding the best local spots and hidden gems for your trip.</p>
          <p className="text-stone-400 text-sm mt-4">This may take up to 30 seconds</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">😕</span>
          </div>
          <h2 className="text-xl font-medium text-stone-900 mb-2">Something went wrong</h2>
          <p className="text-stone-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/plan")}
            className="bg-stone-900 text-white px-6 py-3 rounded-full font-medium hover:bg-stone-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!itinerary || !itinerary.itinerary || itinerary.itinerary.length === 0) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-stone-900 mb-4">No itinerary data</h2>
          <button
            onClick={() => router.push("/plan")}
            className="bg-stone-900 text-white px-6 py-3 rounded-full font-medium hover:bg-stone-800 transition-colors"
          >
            Start Over
          </button>
        </div>
      </main>
    );
  }

  const currentDay = itinerary.itinerary.find((d) => d.day === selectedDay) || itinerary.itinerary[0];
  const currentActivities = getActivities(currentDay);
  const totalDays = itinerary.itinerary.length;

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/plan")}
              className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Edit Trip</span>
            </button>
            
            <a href="/" className="text-xl font-semibold text-stone-900">
              JapanWise
            </a>
            
            <button
              onClick={handleDownloadPdf}
              disabled={generatingPdf}
              className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
            >
              {generatingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">{generatingPdf ? "Generating..." : "Download PDF"}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8" ref={contentRef}>
        {/* Summary Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-light text-stone-900 tracking-tight">
                Your {itinerary.summary?.totalDays || totalDays}-Day Japan Adventure
              </h1>
              <div className="flex items-center gap-2 mt-2 text-stone-500">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {itinerary.itinerary[0]?.date} — {itinerary.itinerary[totalDays - 1]?.date}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {(itinerary.summary?.cities || []).map((city, index) => (
              <span key={city} className="flex items-center gap-1">
                <span className="bg-stone-100 text-stone-700 px-3 py-1 rounded-full text-sm font-medium">
                  {city}
                </span>
                {index < (itinerary.summary?.cities || []).length - 1 && (
                  <span className="text-stone-300">→</span>
                )}
              </span>
            ))}
          </div>
          
          {itinerary.summary?.highlights && itinerary.summary.highlights.length > 0 && (
            <p className="text-stone-600 text-sm">
              <span className="font-medium">Highlights:</span> {itinerary.summary.highlights.join(" • ")}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Day Navigator */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-4 sticky top-24">
              <h3 className="font-medium text-stone-700 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Your Days
              </h3>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {itinerary.itinerary.map((day) => (
                  <button
                    key={day.day}
                    onClick={() => setSelectedDay(day.day)}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      selectedDay === day.day
                        ? "bg-stone-900 text-white"
                        : "bg-stone-50 hover:bg-stone-100 text-stone-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Day {day.day}</span>
                      <span className={`text-xs ${
                        selectedDay === day.day ? "text-stone-400" : "text-stone-400"
                      }`}>
                        {day.date?.split("-").slice(1).join("/")}
                      </span>
                    </div>
                    <div className={`text-sm mt-1 ${
                      selectedDay === day.day ? "text-stone-300" : "text-stone-500"
                    }`}>
                      {day.city}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Day Content */}
          <div className="lg:col-span-3">
            {/* Day Header */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="bg-stone-900 text-white px-4 py-1.5 rounded-full text-sm font-medium">
                    Day {currentDay.day}
                  </span>
                  <span className="text-stone-500">{currentDay.date}</span>
                </div>
                
                {/* Day navigation arrows */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedDay(Math.max(1, selectedDay - 1))}
                    disabled={selectedDay === 1}
                    className="p-2 rounded-full hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-stone-600" />
                  </button>
                  <button
                    onClick={() => setSelectedDay(Math.min(totalDays, selectedDay + 1))}
                    disabled={selectedDay === totalDays}
                    className="p-2 rounded-full hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-stone-600" />
                  </button>
                </div>
              </div>
              
              <h2 className="text-2xl font-light text-stone-900 tracking-tight flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-500" />
                {currentDay.city}
              </h2>
              <p className="text-stone-600 mt-1">{currentDay.theme}</p>
            </div>

            {/* Activities */}
            <div className="space-y-4">
              {currentActivities.length > 0 ? (
                currentActivities.map((activity, index) => (
                  <ActivityCard key={index} activity={activity} />
                ))
              ) : (
                <div className="bg-white rounded-2xl shadow-sm p-6 text-center text-stone-500">
                  No activities for this day
                </div>
              )}
            </div>

            {/* Stay Area */}
            {currentDay.stayArea && (
              <div className="bg-white rounded-2xl shadow-sm p-4 mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Hotel className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <span className="text-sm text-stone-500">Stay tonight</span>
                  <p className="font-medium text-stone-900">{currentDay.stayArea} area</p>
                </div>
              </div>
            )}

            {/* Tips Section */}
            {itinerary.tips && itinerary.tips.length > 0 && selectedDay === 1 && (
              <div className="bg-amber-50 rounded-2xl p-6 mt-6">
                <h3 className="font-medium text-amber-800 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Pro Tips for Your Trip
                </h3>
                <ul className="space-y-3">
                  {itinerary.tips.map((tip, index) => (
                    <li key={index} className="text-amber-900 text-sm flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
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
  if (!activity || !activity.name) return null;
  
  const isFood = activity.type === "food" || !!activity.cuisine;
  const tip = activity.tip || activity.localTip;
  const price = activity.price || activity.priceRange || activity.cost;
  const klookLink = !isFood ? getKlookLink(activity.name) : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
          isFood ? "bg-rose-100" : "bg-amber-100"
        }`}>
          {isFood ? (
            <Utensils className="w-6 h-6 text-rose-600" />
          ) : (
            <Camera className="w-6 h-6 text-amber-600" />
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {activity.time && (
              <span className="text-sm font-medium text-stone-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {activity.time}
              </span>
            )}
            {activity.duration && (
              <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                {activity.duration}
              </span>
            )}
            {price && (
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                {price}
              </span>
            )}
          </div>
          
          <h4 className="font-medium text-stone-900 mb-1">
            {activity.name}
            {activity.cuisine && (
              <span className="text-stone-500 font-normal ml-2">({activity.cuisine})</span>
            )}
          </h4>
          
          {activity.description && (
            <p className="text-stone-600 text-sm mb-2">{activity.description}</p>
          )}
          
          {tip && (
            <p className="text-sm text-amber-600 flex items-start gap-1.5 mt-2">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{tip}</span>
            </p>
          )}
          
          {klookLink && (
            <a
              href={klookLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-full transition-colors"
            >
              Book on Klook
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}