"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Calendar, 
  Users, 
  MapPin, 
  Sparkles,
  ChevronRight,
  Loader2,
  Clock,
  Utensils,
  Camera,
  Hotel,
  FileDown,
  Menu,
  X,
  Train,
  AlertCircle
} from "lucide-react";
import { jsPDF } from "jspdf";

// ============================================
// TYPES
// ============================================
type MessageRole = "assistant" | "user";
type InputType = "text" | "calendar" | "buttons" | "multi-select";

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  inputType?: InputType;
  options?: string[];
}

interface TripInfo {
  dates?: { start: string; end: string };
  travelers?: string;
  cities?: string[];
  mustDo?: string[];
}

interface DayPlan {
  day: number;
  date: string;
  city: string;
  theme?: string;
  activities: Activity[];
  stayArea?: string;
}

interface Activity {
  time: string;
  type: "activity" | "food" | "transport" | "stay";
  name: string;
  description?: string;
  tip?: string;
  duration?: string;
  cost?: string;
  price?: string;
  cuisine?: string;
  reservation?: string;
  transport?: string;
}

interface Itinerary {
  summary?: {
    totalDays: number;
    cities: string[];
    highlights: string[];
  };
  itinerary: DayPlan[];
  tips?: string[];
}

// ============================================
// PHASES - What we need to ask
// ============================================
const PHASES = [
  { 
    id: 1, 
    name: "Dates", 
    question: "When are you visiting Japan?", 
    inputType: "calendar" as InputType 
  },
  { 
    id: 2, 
    name: "Travelers", 
    question: "Who's joining you? Tell me about your group!\n\n(e.g., \"Me and my girlfriend, both late 20s\" or \"Family with 2 kids, ages 8 and 12\")", 
    inputType: "text" as InputType 
  },
  { 
    id: 3, 
    name: "Cities", 
    question: "Which areas do you want to visit?", 
    inputType: "multi-select" as InputType, 
    options: ["Tokyo", "Kyoto", "Osaka", "Hiroshima", "Hakone", "Nara", "Kanazawa", "Fukuoka", "Sapporo", "Okinawa"] 
  },
  { 
    id: 4, 
    name: "Must-do", 
    question: "Any must-dos? Places, foods, experiences you absolutely want?\n\n(e.g., \"TeamLab, sushi at Tsukiji, see Mt. Fuji\" or \"skip\" if you want me to suggest everything)", 
    inputType: "text" as InputType 
  },
];

const PROGRESS_PER_PHASE = 100 / (PHASES.length + 1);

// ============================================
// MAIN COMPONENT
// ============================================
export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hey! I'm JapanWise — think of me as your friend who lives in Japan. 🇯🇵\n\nI'll help you build a trip that actually works:\n• Efficient routes (no backtracking)\n• Realistic timing\n• What needs reservations\n• How to get between spots\n\nTell me what you want to do, and I'll handle the annoying planning parts. Ready?",
    },
    {
      id: "phase-1",
      role: "assistant",
      content: PHASES[0].question,
      inputType: PHASES[0].inputType,
    },
  ]);
  const [currentPhase, setCurrentPhase] = useState(1);
  const [tripInfo, setTripInfo] = useState<TripInfo>({});
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [selectedDates, setSelectedDates] = useState<{ start: string; end: string }>({ start: "", end: "" });
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMobileItinerary, setShowMobileItinerary] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isGenerating) inputRef.current?.focus();
  }, [currentPhase, isGenerating]);

  // ============================================
  // HANDLERS
  // ============================================
  const addMessage = (role: MessageRole, content: string, extras?: Partial<Message>) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      ...extras,
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  const handleDateSubmit = () => {
    if (!selectedDates.start || !selectedDates.end) return;

    const start = new Date(selectedDates.start);
    const end = new Date(selectedDates.end);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    addMessage("user", `${selectedDates.start} to ${selectedDates.end} (${days} days)`);
    setTripInfo((prev) => ({ ...prev, dates: selectedDates }));
    moveToNextPhase();
  };

  const handleCityToggle = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  const handleCitySubmit = () => {
    if (selectedCities.length === 0) return;

    addMessage("user", selectedCities.join(", "));
    setTripInfo((prev) => ({ ...prev, cities: selectedCities }));
    moveToNextPhase();
  };

  const handleTextSubmit = () => {
    if (!inputValue.trim()) return;

    const value = inputValue.trim();
    addMessage("user", value);

    if (currentPhase === 2) {
      setTripInfo((prev) => ({ ...prev, travelers: value }));
    } else if (currentPhase === 4) {
      if (value.toLowerCase() !== "skip") {
        setTripInfo((prev) => ({ ...prev, mustDo: [value] }));
      }
    }

    setInputValue("");
    moveToNextPhase();
  };

  const moveToNextPhase = () => {
    const nextPhase = currentPhase + 1;

    if (nextPhase <= PHASES.length) {
      setCurrentPhase(nextPhase);
      const phase = PHASES[nextPhase - 1];

      setTimeout(() => {
        addMessage("assistant", phase.question, {
          inputType: phase.inputType,
          options: phase.options,
        });
      }, 500);
    } else {
      setTimeout(() => {
        addMessage(
          "assistant",
          "Got it! Ready to build your itinerary?\n\nOr tell me more if you want (pace, food preferences, budget, things to avoid...)",
          { inputType: "buttons", options: ["Build my itinerary! ✨", "I want to add more details"] }
        );
      }, 500);
    }
  };

  const handleButtonClick = async (option: string) => {
    addMessage("user", option);

    if (option.includes("Build")) {
      await generateItinerary();
    } else {
      setTimeout(() => {
        addMessage("assistant", "Sure! What else should I know?\n\nExamples:\n• \"Relaxed pace, no rushing\"\n• \"We're vegetarian\"\n• \"Budget around ¥15,000/day\"\n• \"Avoid crowded tourist spots\"");
      }, 500);
    }
  };

  const handleGenerateNow = async () => {
    await generateItinerary();
  };

  const generateItinerary = async () => {
    setIsGenerating(true);
    addMessage("assistant", "Building your trip... \n\nI'm working out the best routes, checking what needs reservations, and making sure the timing actually works. Give me ~30 seconds. ✨");

    try {
      // Parse traveler info
      const travelerText = tripInfo.travelers?.toLowerCase() || "";
      let travelerType = "solo-male";
      if (travelerText.includes("girlfriend") || travelerText.includes("boyfriend") || travelerText.includes("partner") || travelerText.includes("wife") || travelerText.includes("husband") || travelerText.includes("couple")) {
        travelerType = "couple";
      } else if (travelerText.includes("friend")) {
        travelerType = "friends";
      } else if (travelerText.includes("family") || travelerText.includes("kid") || travelerText.includes("child") || travelerText.includes("son") || travelerText.includes("daughter")) {
        if (travelerText.includes("teen")) {
          travelerType = "family-teens";
        } else if (travelerText.includes("baby") || travelerText.includes("toddler") || /\b[0-5]\s*(year|yr|歳)/.test(travelerText)) {
          travelerType = "family-young";
        } else {
          travelerType = "family-kids";
        }
      } else if (travelerText.includes("solo")) {
        travelerType = travelerText.includes("female") || travelerText.includes("woman") ? "solo-female" : "solo-male";
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: tripInfo.dates?.start,
          endDate: tripInfo.dates?.end,
          travelerType,
          cities: tripInfo.cities?.map((c) => c.toLowerCase()) || ["tokyo"],
          mustVisit: tripInfo.mustDo?.join(", ") || "",
          japanExperience: "first",
          foodStyle: "local",
          pace: "moderate",
          additionalNotes: tripInfo.travelers || "",
        }),
      });

      if (!response.ok) throw new Error("Failed to generate");

      const data = await response.json();
      setItinerary(data);

      addMessage(
        "assistant",
        `Done! Here's your ${data.summary?.totalDays || ""}-day trip. 🎉\n\nCheck the itinerary on the right (or tap the menu icon on mobile).\n\nWant to change anything? Just tell me:\n• \"Day 2 is too packed\"\n• \"Add more ramen spots\"\n• \"Make mornings start later\"\n• \"Switch Day 3 and 4\"`
      );
    } catch (error) {
      console.error("Generation error:", error);
      addMessage("assistant", "Sorry, something went wrong. Let me try again...");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAdjustment = async () => {
    if (!inputValue.trim() || !itinerary) return;

    const adjustment = inputValue.trim();
    addMessage("user", adjustment);
    setInputValue("");
    setIsLoading(true);

    // Show what's happening
    addMessage("assistant", "Updating your itinerary...");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: tripInfo.dates?.start,
          endDate: tripInfo.dates?.end,
          cities: tripInfo.cities?.map((c) => c.toLowerCase()) || ["tokyo"],
          mustVisit: tripInfo.mustDo?.join(", ") || "",
          japanExperience: "first",
          foodStyle: "local",
          pace: "moderate",
          additionalNotes: `${tripInfo.travelers || ""}\n\n=== USER REQUESTED CHANGE ===\n${adjustment}\n\nPlease adjust the itinerary to reflect this request while keeping other good parts intact.`,
        }),
      });

      if (!response.ok) throw new Error("Failed to adjust");

      const data = await response.json();
      setItinerary(data);
      
      // Remove "Updating..." message and add success
      setMessages(prev => prev.slice(0, -1));
      addMessage("assistant", "Updated! Take a look. Anything else?");
    } catch (error) {
      setMessages(prev => prev.slice(0, -1));
      addMessage("assistant", "Couldn't make that change. Try rephrasing?");
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // PDF EXPORT
  // ============================================
  const exportPDF = () => {
    if (!itinerary) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = 20;

    // Helper function
    const addText = (text: string, fontSize: number, isBold = false, color = "#1c1917") => {
      pdf.setFontSize(fontSize);
      pdf.setFont("helvetica", isBold ? "bold" : "normal");
      const rgb = parseInt(color.slice(1), 16);
      pdf.setTextColor((rgb >> 16) & 255, (rgb >> 8) & 255, rgb & 255);
      
      const lines = pdf.splitTextToSize(text, contentWidth);
      lines.forEach((line: string) => {
        if (y > 270) {
          pdf.addPage();
          y = 20;
        }
        pdf.text(line, margin, y);
        y += fontSize * 0.5;
      });
      y += 2;
    };

    // Title
    addText("JapanWise Itinerary", 24, true, "#b45309");
    y += 5;

    // Summary
    if (itinerary.summary) {
      addText(`${itinerary.summary.totalDays} Days | ${itinerary.summary.cities.join(" → ")}`, 12, false, "#78716c");
      y += 10;
    }

    // Days
    itinerary.itinerary.forEach((day) => {
      if (y > 240) {
        pdf.addPage();
        y = 20;
      }

      addText(`Day ${day.day}: ${day.theme || day.city}`, 14, true);
      addText(`${day.date} - ${day.city}`, 10, false, "#78716c");
      y += 3;

      day.activities.forEach((activity) => {
        const icon = activity.type === "food" ? "[Food]" : activity.type === "stay" ? "[Stay]" : "[Activity]";
        addText(`${activity.time} ${icon} ${activity.name}`, 11, true);
        
        if (activity.description) {
          addText(activity.description, 10, false, "#57534e");
        }
        if (activity.tip) {
          addText(`Tip: ${activity.tip}`, 9, false, "#b45309");
        }
        if (activity.reservation) {
          addText(`Reservation: ${activity.reservation}`, 9, false, "#dc2626");
        }
        y += 2;
      });

      if (day.stayArea) {
        addText(`Stay: ${day.stayArea}`, 10, false, "#4f46e5");
      }
      y += 8;
    });

    // Tips
    if (itinerary.tips && itinerary.tips.length > 0) {
      if (y > 240) {
        pdf.addPage();
        y = 20;
      }
      addText("Pro Tips", 14, true, "#b45309");
      itinerary.tips.forEach((tip) => {
        addText(`• ${tip}`, 10);
      });
    }

    pdf.save("japanwise-itinerary.pdf");
  };

  // ============================================
  // RENDER
  // ============================================
  const progress = Math.min(currentPhase * PROGRESS_PER_PHASE, 100);
  const canGenerate = currentPhase > PHASES.length || (tripInfo.dates && tripInfo.cities && tripInfo.cities.length > 0);

  const renderInput = () => {
    const lastMessage = messages[messages.length - 1];
    const inputType = lastMessage?.inputType;

    if (itinerary) {
      return (
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleAdjustment()}
            placeholder="Tell me what to change..."
            className="flex-1 px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
            disabled={isLoading}
          />
          <button
            onClick={handleAdjustment}
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 disabled:opacity-50 transition-colors"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      );
    }

    if (inputType === "calendar") {
      return (
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm text-stone-500 mb-1">From</label>
              <input
                type="date"
                value={selectedDates.start}
                onChange={(e) => setSelectedDates((prev) => ({ ...prev, start: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-stone-500 mb-1">To</label>
              <input
                type="date"
                value={selectedDates.end}
                onChange={(e) => setSelectedDates((prev) => ({ ...prev, end: e.target.value }))}
                min={selectedDates.start}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>
          <button
            onClick={handleDateSubmit}
            disabled={!selectedDates.start || !selectedDates.end}
            className="w-full py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      );
    }

    if (inputType === "multi-select" && lastMessage?.options) {
      return (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {lastMessage.options.map((option) => (
              <button
                key={option}
                onClick={() => handleCityToggle(option)}
                className={`px-4 py-2 rounded-full border transition-colors ${
                  selectedCities.includes(option)
                    ? "bg-amber-500 text-white border-amber-500"
                    : "bg-white text-stone-700 border-stone-200 hover:border-amber-400"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            onClick={handleCitySubmit}
            disabled={selectedCities.length === 0}
            className="w-full py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 disabled:opacity-50 transition-colors"
          >
            Continue with {selectedCities.length} {selectedCities.length === 1 ? "city" : "cities"}
          </button>
        </div>
      );
    }

    if (inputType === "buttons" && lastMessage?.options) {
      return (
        <div className="flex flex-col gap-2">
          {lastMessage.options.map((option) => (
            <button
              key={option}
              onClick={() => handleButtonClick(option)}
              disabled={isGenerating}
              className={`w-full py-3 rounded-xl transition-colors flex items-center justify-center gap-2 ${
                option.includes("Build")
                  ? "bg-amber-500 text-white hover:bg-amber-600"
                  : "bg-white text-stone-700 border border-stone-200 hover:border-amber-400"
              } disabled:opacity-50`}
            >
              {isGenerating && option.includes("Build") ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Building...</>
              ) : option}
            </button>
          ))}
        </div>
      );
    }

    return (
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
          placeholder="Type your answer..."
          className="flex-1 px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <button
          onClick={handleTextSubmit}
          disabled={!inputValue.trim()}
          className="px-4 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 disabled:opacity-50 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    );
  };

  const renderItineraryPanel = () => {
    if (!itinerary) {
      const days = tripInfo.dates
        ? Math.ceil((new Date(tripInfo.dates.end).getTime() - new Date(tripInfo.dates.start).getTime()) / (1000 * 60 * 60 * 24)) + 1
        : 0;

      return (
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-stone-200">
            <h2 className="text-xl font-semibold text-stone-800">Your Trip</h2>
            <p className="text-sm text-stone-500">Building as we chat...</p>
          </div>

          <div className="flex-1 p-6 space-y-4 overflow-auto">
            {tripInfo.dates ? (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-center gap-2 text-amber-700 font-medium mb-1">
                  <Calendar className="w-4 h-4" /> Dates
                </div>
                <p className="text-stone-700">{tripInfo.dates.start} → {tripInfo.dates.end}</p>
                <p className="text-sm text-stone-500">{days} days</p>
              </div>
            ) : (
              <div className="p-4 bg-stone-50 rounded-xl border border-dashed border-stone-300">
                <div className="flex items-center gap-2 text-stone-400">
                  <Calendar className="w-4 h-4" /> When?
                </div>
              </div>
            )}

            {tripInfo.travelers ? (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-center gap-2 text-amber-700 font-medium mb-1">
                  <Users className="w-4 h-4" /> Travelers
                </div>
                <p className="text-stone-700">{tripInfo.travelers}</p>
              </div>
            ) : (
              <div className="p-4 bg-stone-50 rounded-xl border border-dashed border-stone-300">
                <div className="flex items-center gap-2 text-stone-400">
                  <Users className="w-4 h-4" /> Who?
                </div>
              </div>
            )}

            {tripInfo.cities && tripInfo.cities.length > 0 ? (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-center gap-2 text-amber-700 font-medium mb-1">
                  <MapPin className="w-4 h-4" /> Destinations
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tripInfo.cities.map((city) => (
                    <span key={city} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-stone-50 rounded-xl border border-dashed border-stone-300">
                <div className="flex items-center gap-2 text-stone-400">
                  <MapPin className="w-4 h-4" /> Where?
                </div>
              </div>
            )}

            {tripInfo.mustDo && tripInfo.mustDo.length > 0 && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-center gap-2 text-amber-700 font-medium mb-1">
                  <Sparkles className="w-4 h-4" /> Must Do
                </div>
                <p className="text-stone-700">{tripInfo.mustDo.join(", ")}</p>
              </div>
            )}

            {days > 0 && tripInfo.cities && tripInfo.cities.length > 0 && (
              <div className="mt-6 pt-6 border-t border-stone-200">
                <h3 className="text-sm font-medium text-stone-500 mb-3">Preview</h3>
                <div className="space-y-2">
                  {Array.from({ length: Math.min(days, 10) }).map((_, i) => (
                    <div key={i} className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-stone-600">Day {i + 1}</span>
                        <span className="text-xs text-stone-400">{tripInfo.cities![i % tripInfo.cities!.length]}</span>
                      </div>
                      <div className="mt-2 h-2 bg-stone-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // ===== ITINERARY VIEW =====
    return (
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-stone-800">Your Itinerary</h2>
            <p className="text-sm text-stone-500">{itinerary.summary?.totalDays} days • {itinerary.summary?.cities.join(" → ")}</p>
          </div>
          <button 
            onClick={exportPDF}
            className="flex items-center gap-2 px-3 py-2 text-sm text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
          >
            <FileDown className="w-4 h-4" />
            PDF
          </button>
        </div>

        <div className="flex-1 p-6 overflow-auto space-y-6">
          {itinerary.itinerary.map((day) => (
            <div key={day.day} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center font-semibold">
                  {day.day}
                </div>
                <div>
                  <h3 className="font-semibold text-stone-800">{day.theme || `Day ${day.day}`}</h3>
                  <p className="text-sm text-stone-500">{day.date} • {day.city}</p>
                </div>
              </div>

              <div className="ml-5 pl-5 border-l-2 border-stone-200 space-y-3">
                {day.activities.map((activity, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[25px] w-3 h-3 bg-white border-2 border-stone-300 rounded-full" />
                    <div className={`p-3 rounded-lg ${
                      activity.type === "food" ? "bg-rose-50 border border-rose-200" :
                      activity.type === "transport" ? "bg-blue-50 border border-blue-200" :
                      activity.type === "stay" ? "bg-indigo-50 border border-indigo-200" :
                      "bg-stone-50 border border-stone-200"
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {activity.type === "food" ? <Utensils className="w-4 h-4 text-rose-500" /> :
                           activity.type === "transport" ? <Train className="w-4 h-4 text-blue-500" /> :
                           activity.type === "stay" ? <Hotel className="w-4 h-4 text-indigo-500" /> :
                           <Camera className="w-4 h-4 text-stone-500" />}
                          <span className="font-medium text-stone-800">{activity.name}</span>
                        </div>
                        <span className="text-xs text-stone-500">{activity.time}</span>
                      </div>
                      
                      {activity.description && <p className="text-sm text-stone-600 mt-1">{activity.description}</p>}
                      
                      {activity.tip && (
                        <p className="text-xs text-amber-700 mt-2 bg-amber-50 px-2 py-1 rounded">
                          Tip: {activity.tip}
                        </p>
                      )}
                      
                      {activity.reservation && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {activity.reservation}
                        </p>
                      )}
                      
                      <div className="flex gap-3 mt-2 text-xs text-stone-500">
                        {activity.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{activity.duration}</span>}
                        {(activity.cost || activity.price) && <span>{activity.cost || activity.price}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {day.stayArea && <div className="ml-5 pl-5 text-sm text-indigo-600">🏨 Stay: {day.stayArea}</div>}
            </div>
          ))}

          {itinerary.tips && itinerary.tips.length > 0 && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <h3 className="font-semibold text-amber-800 mb-2">Pro Tips</h3>
              <ul className="space-y-2">
                {itinerary.tips.map((tip, idx) => (
                  <li key={idx} className="text-sm text-stone-700 flex items-start gap-2">
                    <span>•</span><span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-stone-800">JapanWise</h1>
          <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded-full">Your friend in Japan</span>
        </div>
        <button
          onClick={() => setShowMobileItinerary(!showMobileItinerary)}
          className="lg:hidden p-2 text-stone-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
        >
          {showMobileItinerary ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Progress */}
      <div className="bg-white border-b border-stone-200 px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${itinerary ? 100 : progress}%` }} />
          </div>
          <span className="text-sm text-stone-500">{itinerary ? "Done!" : `${Math.round(progress)}%`}</span>
          {canGenerate && !itinerary && !isGenerating && (
            <button
              onClick={handleGenerateNow}
              className="px-3 py-1 text-sm bg-amber-500 text-white rounded-full hover:bg-amber-600 flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" /> Build now
            </button>
          )}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat */}
        <div className={`flex-1 flex flex-col ${showMobileItinerary ? "hidden lg:flex" : "flex"}`}>
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  message.role === "user"
                    ? "bg-amber-500 text-white rounded-br-md"
                    : "bg-white text-stone-800 border border-stone-200 rounded-bl-md"
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-2 text-stone-500">
                    <Loader2 className="w-4 h-4 animate-spin" /> Building your perfect trip...
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t border-stone-200 bg-white p-4">{renderInput()}</div>
        </div>

        {/* Itinerary Panel */}
        <div className={`w-full lg:w-[450px] bg-white border-l border-stone-200 ${showMobileItinerary ? "block" : "hidden lg:block"}`}>
          {renderItineraryPanel()}
        </div>
      </div>
    </div>
  );
}