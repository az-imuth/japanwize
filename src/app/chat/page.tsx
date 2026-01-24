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
  X
} from "lucide-react";

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
// CONSTANTS
// ============================================
const PHASES = [
  { id: 1, name: "Dates", question: "When are you visiting Japan?", inputType: "calendar" as InputType },
  { id: 2, name: "Travelers", question: "Who are you traveling with? Tell me a bit about your group so I can personalize the trip!", inputType: "text" as InputType },
  { id: 3, name: "Cities", question: "Which areas interest you?", inputType: "multi-select" as InputType, options: ["Tokyo", "Kyoto", "Osaka", "Hiroshima", "Hakone", "Nara", "Kanazawa", "Fukuoka", "Sapporo", "Okinawa"] },
  { id: 4, name: "Must-do", question: "Anything you absolutely want to do or see? (Or type 'skip' if you're open to suggestions!)", inputType: "text" as InputType },
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
      content: "Hey! I'm JapanWise — think of me as your friend who lives in Japan. 🇯🇵\n\nI'll help you plan a trip you'll actually love. Let's start with a few questions, then we'll build your perfect itinerary together.\n\nReady?",
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
    inputRef.current?.focus();
  }, [currentPhase]);

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
          "Perfect! I've got everything I need to create your itinerary.\n\nWant to tell me anything else? (pace, food preferences, budget, etc.) Or we can generate now!",
          { inputType: "buttons", options: ["Generate my itinerary! ✨", "I want to add more details"] }
        );
      }, 500);
    }
  };

  const handleButtonClick = async (option: string) => {
    addMessage("user", option);

    if (option.includes("Generate")) {
      await generateItinerary();
    } else {
      setTimeout(() => {
        addMessage("assistant", "Sure! What else would you like me to know?\n\nExamples:\n• \"We prefer a relaxed pace\"\n• \"Vegetarian options needed\"\n• \"Budget around ¥15,000/day\"\n• \"We love ramen!\"");
      }, 500);
    }
  };

  const handleGenerateNow = async () => {
    await generateItinerary();
  };

  const generateItinerary = async () => {
    setIsGenerating(true);
    addMessage("assistant", "Creating your perfect Japan trip... Give me about 30 seconds. ✨");

    try {
      const travelerText = tripInfo.travelers?.toLowerCase() || "";
      let travelerType = "solo-male";
      if (travelerText.includes("girlfriend") || travelerText.includes("boyfriend") || travelerText.includes("partner") || travelerText.includes("wife") || travelerText.includes("husband") || travelerText.includes("couple")) {
        travelerType = "couple";
      } else if (travelerText.includes("friend")) {
        travelerType = "friends";
      } else if (travelerText.includes("family") || travelerText.includes("kid") || travelerText.includes("child") || travelerText.includes("son") || travelerText.includes("daughter")) {
        if (travelerText.includes("teen")) {
          travelerType = "family-teens";
        } else if (travelerText.includes("baby") || travelerText.includes("toddler") || /\b[0-5]\s*(year|yr)/.test(travelerText)) {
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
        `Done! 🎉 I've created a ${data.summary?.totalDays || ""}-day trip for you.\n\nCheck out your itinerary on the right. Feel free to ask me to change anything!\n\nTry:\n• \"Day 3 is too packed\"\n• \"Add more food spots\"\n• \"Make mornings start later\"\n• \"Add a day trip to Mt. Fuji\"`
      );
    } catch (error) {
      console.error("Generation error:", error);
      addMessage("assistant", "Sorry, something went wrong. Let's try again...");
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
          additionalNotes: `${tripInfo.travelers || ""}\n\nIMPORTANT - USER REQUESTED CHANGE: ${adjustment}\n\nPlease adjust the itinerary according to this request.`,
        }),
      });

      if (!response.ok) throw new Error("Failed to adjust");

      const data = await response.json();
      setItinerary(data);
      addMessage("assistant", "Done! I've updated your itinerary. Take a look! Anything else you'd like to change?");
    } catch (error) {
      addMessage("assistant", "Sorry, couldn't make that change. Could you try rephrasing?");
    } finally {
      setIsLoading(false);
    }
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
            onKeyDown={(e) => e.key === "Enter" && handleAdjustment()}
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
                option.includes("Generate")
                  ? "bg-amber-500 text-white hover:bg-amber-600"
                  : "bg-white text-stone-700 border border-stone-200 hover:border-amber-400"
              } disabled:opacity-50`}
            >
              {isGenerating && option.includes("Generate") ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Creating...</>
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

    return (
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-stone-800">Your Itinerary</h2>
            <p className="text-sm text-stone-500">{itinerary.summary?.totalDays} days • {itinerary.summary?.cities.join(" → ")}</p>
          </div>
          <button className="p-2 text-stone-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg">
            <FileDown className="w-5 h-5" />
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
                      activity.type === "stay" ? "bg-indigo-50 border border-indigo-200" :
                      "bg-stone-50 border border-stone-200"
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {activity.type === "food" ? <Utensils className="w-4 h-4 text-rose-500" /> :
                           activity.type === "stay" ? <Hotel className="w-4 h-4 text-indigo-500" /> :
                           <Camera className="w-4 h-4 text-stone-500" />}
                          <span className="font-medium text-stone-800">{activity.name}</span>
                        </div>
                        <span className="text-xs text-stone-500">{activity.time}</span>
                      </div>
                      {activity.description && <p className="text-sm text-stone-600 mt-1">{activity.description}</p>}
                      {activity.tip && (
                        <p className="text-xs text-amber-700 mt-2 bg-amber-50 px-2 py-1 rounded">
                          💡 {activity.tip}
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

      <div className="bg-white border-b border-stone-200 px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${itinerary ? 100 : progress}%` }} />
          </div>
          <span className="text-sm text-stone-500">{itinerary ? "Complete!" : `${Math.round(progress)}%`}</span>
          {canGenerate && !itinerary && (
            <button
              onClick={handleGenerateNow}
              disabled={isGenerating}
              className="px-3 py-1 text-sm bg-amber-500 text-white rounded-full hover:bg-amber-600 disabled:opacity-50 flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" /> Generate now
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
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
                    <Loader2 className="w-4 h-4 animate-spin" /> Creating your trip...
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t border-stone-200 bg-white p-4">{renderInput()}</div>
        </div>

        <div className={`w-full lg:w-[450px] bg-white border-l border-stone-200 ${showMobileItinerary ? "block" : "hidden lg:block"}`}>
          {renderItineraryPanel()}
        </div>
      </div>
    </div>
  );
}
