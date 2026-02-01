"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { 
  Send, 
  Calendar, 
  Users, 
  MapPin, 
  Sparkles,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Loader2,
  Clock,
  Utensils,
  Camera,
  Hotel,
  FileDown,
  Menu,
  X,
  Train,
  TicketCheck,
  Plane,
  ExternalLink,
  Eye,
  List,
  Map
} from "lucide-react";
import { jsPDF } from "jspdf";

// ============================================
// GOOGLE MAPS LOADER
// ============================================
let googleMapsLoaded = false;
let googleMapsLoading = false;
const loadGoogleMaps = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (googleMapsLoaded) {
      resolve();
      return;
    }
    if (googleMapsLoading) {
      const checkInterval = setInterval(() => {
        if (googleMapsLoaded) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      return;
    }
    googleMapsLoading = true;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      googleMapsLoaded = true;
      googleMapsLoading = false;
      resolve();
    };
    script.onerror = () => {
      googleMapsLoading = false;
      reject(new Error('Failed to load Google Maps'));
    };
    document.head.appendChild(script);
  });
};

// ============================================
// JAPAN LOCATION DATA (for geocoding fallback)
// ============================================
const JAPAN_LOCATIONS: { [key: string]: { lat: number; lng: number } } = {
  // Cities
  "tokyo": { lat: 35.6762, lng: 139.6503 },
  "kyoto": { lat: 35.0116, lng: 135.7681 },
  "osaka": { lat: 34.6937, lng: 135.5023 },
  "nara": { lat: 34.6851, lng: 135.8048 },
  "hiroshima": { lat: 34.3853, lng: 132.4553 },
  "hakone": { lat: 35.2324, lng: 139.1069 },
  "kanazawa": { lat: 36.5613, lng: 136.6562 },
  "fukuoka": { lat: 33.5902, lng: 130.4017 },
  "sapporo": { lat: 43.0618, lng: 141.3545 },
  "okinawa": { lat: 26.2124, lng: 127.6809 },
  // Popular spots
  "senso-ji": { lat: 35.7148, lng: 139.7967 },
  "sensoji": { lat: 35.7148, lng: 139.7967 },
  "asakusa": { lat: 35.7148, lng: 139.7967 },
  "shibuya": { lat: 35.6580, lng: 139.7016 },
  "shinjuku": { lat: 35.6938, lng: 139.7034 },
  "shinjuku gyoen": { lat: 35.6852, lng: 139.7100 },
  "harajuku": { lat: 35.6702, lng: 139.7027 },
  "akihabara": { lat: 35.7023, lng: 139.7745 },
  "ginza": { lat: 35.6717, lng: 139.7649 },
  "ueno": { lat: 35.7141, lng: 139.7774 },
  "ueno park": { lat: 35.7146, lng: 139.7732 },
  "tokyo tower": { lat: 35.6586, lng: 139.7454 },
  "skytree": { lat: 35.7101, lng: 139.8107 },
  "tokyo skytree": { lat: 35.7101, lng: 139.8107 },
  "meiji shrine": { lat: 35.6764, lng: 139.6993 },
  "tsukiji": { lat: 35.6654, lng: 139.7707 },
  "teamlab": { lat: 35.6269, lng: 139.7840 },
  "teamlab planets": { lat: 35.6269, lng: 139.7840 },
  "odaiba": { lat: 35.6290, lng: 139.7798 },
  "roppongi": { lat: 35.6627, lng: 139.7318 },
  "imperial palace": { lat: 35.6852, lng: 139.7528 },
  // Kyoto
  "fushimi inari": { lat: 34.9671, lng: 135.7727 },
  "kinkaku-ji": { lat: 35.0394, lng: 135.7292 },
  "kinkakuji": { lat: 35.0394, lng: 135.7292 },
  "golden pavilion": { lat: 35.0394, lng: 135.7292 },
  "arashiyama": { lat: 35.0094, lng: 135.6737 },
  "bamboo grove": { lat: 35.0168, lng: 135.6713 },
  "gion": { lat: 35.0037, lng: 135.7756 },
  "kiyomizu-dera": { lat: 34.9949, lng: 135.7850 },
  "kiyomizudera": { lat: 34.9949, lng: 135.7850 },
  "nijo castle": { lat: 35.0142, lng: 135.7481 },
  // Osaka
  "dotonbori": { lat: 34.6687, lng: 135.5031 },
  "osaka castle": { lat: 34.6873, lng: 135.5262 },
  "shinsekai": { lat: 34.6524, lng: 135.5063 },
  "universal studios japan": { lat: 34.6654, lng: 135.4323 },
  "usj": { lat: 34.6654, lng: 135.4323 },
  // Nara
  "nara park": { lat: 34.6851, lng: 135.8430 },
  "todai-ji": { lat: 34.6890, lng: 135.8399 },
  "todaiji": { lat: 34.6890, lng: 135.8399 },
  // Other
  "mount fuji": { lat: 35.3606, lng: 138.7274 },
  "mt fuji": { lat: 35.3606, lng: 138.7274 },
  "mt. fuji": { lat: 35.3606, lng: 138.7274 },
  "lake kawaguchi": { lat: 35.5163, lng: 138.7519 },
  "miyajima": { lat: 34.2961, lng: 132.3198 },
  "itsukushima": { lat: 34.2961, lng: 132.3198 },
  "himeji castle": { lat: 34.8394, lng: 134.6939 },
  "narita airport": { lat: 35.7720, lng: 140.3929 },
  "haneda airport": { lat: 35.5494, lng: 139.7798 },
};

function getLocationCoords(name: string, city: string): { lat: number; lng: number } | null {
  const searchTerms = [
    name.toLowerCase(),
    `${name} ${city}`.toLowerCase(),
    city.toLowerCase()
  ];
  
  for (const term of searchTerms) {
    for (const [key, coords] of Object.entries(JAPAN_LOCATIONS)) {
      if (term.includes(key) || key.includes(term.split(' ')[0])) {
        return coords;
      }
    }
  }
  
  // Default to city center if available
  const cityLower = city.toLowerCase();
  if (JAPAN_LOCATIONS[cityLower]) {
    // Add small random offset so markers don't stack
    return {
      lat: JAPAN_LOCATIONS[cityLower].lat + (Math.random() - 0.5) * 0.01,
      lng: JAPAN_LOCATIONS[cityLower].lng + (Math.random() - 0.5) * 0.01
    };
  }
  
  return null;
}

// ============================================
// KLOOK AFFILIATE INTEGRATION
// ============================================
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

// ============================================
// TYPES
// ============================================
type MessageRole = "assistant" | "user";
type InputType = "text" | "calendar" | "buttons" | "multi-select" | "buttons-with-other" | "airport-time";
type PanelView = "list" | "map";

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  inputType?: InputType;
  options?: string[];
}

interface TripInfo {
  dates?: { start: string; end: string };
  arrivalAirport?: string;
  arrivalTime?: string;
  departureAirport?: string;
  departureTime?: string;
  travelers?: string;
  cities?: string[];
  mustDo?: string[];
  japanExperience?: string;
  pace?: string;
  foodStyle?: string;
  additionalNotes?: string;
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

interface MapMarker {
  position: { lat: number; lng: number };
  title: string;
  day: number;
  type: "activity" | "food" | "stay";
  time?: string;
}

// ============================================
// AIRPORTS
// ============================================
const JAPAN_AIRPORTS = [
  { code: "NRT", name: "Tokyo Narita (NRT)", city: "Tokyo" },
  { code: "HND", name: "Tokyo Haneda (HND)", city: "Tokyo" },
  { code: "KIX", name: "Osaka Kansai (KIX)", city: "Osaka" },
  { code: "ITM", name: "Osaka Itami (ITM)", city: "Osaka" },
  { code: "NGO", name: "Nagoya Centrair (NGO)", city: "Nagoya" },
  { code: "FUK", name: "Fukuoka (FUK)", city: "Fukuoka" },
  { code: "CTS", name: "Sapporo New Chitose (CTS)", city: "Sapporo" },
  { code: "OKA", name: "Okinawa Naha (OKA)", city: "Okinawa" },
];

// ============================================
// PHASES
// ============================================
const PHASES = [
  { id: 1, name: "Dates", question: "When are you visiting Japan?", inputType: "calendar" as InputType, required: true },
  { id: 2, name: "Arrival", question: "Which airport are you flying into, and what time do you land?", inputType: "airport-time" as InputType, isArrival: true, required: true },
  { id: 3, name: "Departure", question: "Which airport are you flying out of, and what time is your flight?", inputType: "airport-time" as InputType, isArrival: false, required: true },
  { id: 4, name: "Travelers", question: "Who's joining you? Tell me about your group!\n\n(e.g., \"Me and my girlfriend, both late 20s\" or \"Family with 2 kids, ages 8 and 12\")", inputType: "text" as InputType, required: true },
  { id: 5, name: "Cities", question: "Which areas do you want to visit?", inputType: "multi-select" as InputType, options: ["Tokyo", "Kyoto", "Osaka", "Hiroshima", "Hakone", "Nara", "Kanazawa", "Fukuoka", "Sapporo", "Okinawa"], required: true },
  { id: 6, name: "Must-do", question: "Any must-dos? Places, foods, experiences you absolutely want?\n\n(e.g., \"TeamLab, sushi at Tsukiji, see Mt. Fuji\" or type \"skip\")", inputType: "text" as InputType, required: true },
  { id: 7, name: "Experience", question: "Have you been to Japan before?", inputType: "buttons-with-other" as InputType, options: ["First time! 🎌", "Been once before", "I'm a regular"], required: false },
  { id: 8, name: "Pace", question: "What's your travel pace?", inputType: "buttons-with-other" as InputType, options: ["Relaxed — quality over quantity", "Moderate — balanced mix", "Pack it in — see everything!"], required: false },
  { id: 9, name: "Food", question: "How about food?", inputType: "buttons-with-other" as InputType, options: ["Budget friendly 🍙", "Local favorites 🍜", "Foodie spots 🍣", "High-end dining 🥢"], required: false },
  { id: 10, name: "Extra", question: "Anything else I should know?\n\n(Dietary needs, things to avoid, special occasions, etc. Or type \"done\" to generate!)", inputType: "text" as InputType, required: false },
];

const REQUIRED_PHASES = 6;
const TOTAL_PHASES = PHASES.length;

// ============================================
// HELPER FUNCTIONS
// ============================================
function formatTimeDisplay(time: string): string {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
}

// ============================================
// MAP COMPONENT
// ============================================
function ItineraryMap({ itinerary, selectedDay }: { itinerary: Itinerary; selectedDay: number | null }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Generate markers from itinerary
  const markers: MapMarker[] = [];
  itinerary.itinerary.forEach((day) => {
    day.activities.forEach((activity) => {
      if (activity.type === "transport") return;
      const coords = getLocationCoords(activity.name, day.city);
      if (coords) {
        markers.push({
          position: coords,
          title: activity.name,
          day: day.day,
          type: activity.type === "food" ? "food" : activity.type === "stay" ? "stay" : "activity",
          time: activity.time,
        });
      }
    });
  });

  // Filter markers by selected day
  const filteredMarkers = selectedDay 
    ? markers.filter(m => m.day === selectedDay)
    : markers;

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;
      
      try {
        await loadGoogleMaps();
        
        // Calculate center and bounds
        let center = { lat: 35.6762, lng: 139.6503 }; // Default: Tokyo
        if (filteredMarkers.length > 0) {
          const avgLat = filteredMarkers.reduce((sum, m) => sum + m.position.lat, 0) / filteredMarkers.length;
          const avgLng = filteredMarkers.reduce((sum, m) => sum + m.position.lng, 0) / filteredMarkers.length;
          center = { lat: avgLat, lng: avgLng };
        }

        // Create map
        const map = new google.maps.Map(mapRef.current, {
          center,
          zoom: filteredMarkers.length > 1 ? 12 : 14,
          styles: [
            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
            { featureType: "transit", elementType: "labels", stylers: [{ visibility: "simplified" }] },
          ],
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        mapInstanceRef.current = map;

        // Clear existing markers
        markersRef.current.forEach(m => m.setMap(null));
        markersRef.current = [];

        // Add markers
        filteredMarkers.forEach((marker) => {
          const markerColor = marker.type === "food" ? "#f43f5e" : marker.type === "stay" ? "#6366f1" : "#f59e0b";
          
          const mapMarker = new google.maps.Marker({
            position: marker.position,
            map,
            title: marker.title,
            label: {
              text: marker.day.toString(),
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
            },
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 14,
              fillColor: markerColor,
              fillOpacity: 1,
              strokeColor: "white",
              strokeWeight: 2,
            },
          });

          // Info window
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; max-width: 200px;">
                <p style="font-weight: 600; margin: 0 0 4px 0;">${marker.title}</p>
                <p style="font-size: 12px; color: #666; margin: 0;">Day ${marker.day}${marker.time ? ` • ${marker.time}` : ''}</p>
              </div>
            `,
          });

          mapMarker.addListener("click", () => {
            infoWindow.open(map, mapMarker);
          });

          markersRef.current.push(mapMarker);
        });

        // Fit bounds if multiple markers
        if (filteredMarkers.length > 1) {
          const bounds = new google.maps.LatLngBounds();
          filteredMarkers.forEach(m => bounds.extend(m.position));
          map.fitBounds(bounds, { padding: 50 });
        }

        setMapLoaded(true);
      } catch (error) {
        console.error("Map error:", error);
        setMapError("Failed to load map");
      }
    };

    initMap();
  }, [filteredMarkers.length, selectedDay]);

  if (mapError) {
    return (
      <div className="h-full flex items-center justify-center bg-stone-100 rounded-lg">
        <p className="text-stone-500">{mapError}</p>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-100 rounded-lg">
          <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
        </div>
      )}
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-stone-600">Activity</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-stone-600">Food</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-indigo-500" />
            <span className="text-stone-600">Stay</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: "Hey! I'm JapanWise — your friend who lives in Japan. 🇯🇵\n\nI'll help you build a trip that actually works:\n• Efficient routes based on your flight times\n• Realistic timing with transport included\n• What needs reservations\n• Local spots you won't find in guidebooks\n\nLet me ask you a few questions, then we'll build your perfect itinerary together!" },
    { id: "phase-1", role: "assistant", content: PHASES[0].question, inputType: PHASES[0].inputType },
  ]);
  const [currentPhase, setCurrentPhase] = useState(1);
  const [tripInfo, setTripInfo] = useState<TripInfo>({});
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [selectedDates, setSelectedDates] = useState<{ start: string; end: string }>({ start: "", end: "" });
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedAirport, setSelectedAirport] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMobileItinerary, setShowMobileItinerary] = useState(false);
  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set());
  const [panelView, setPanelView] = useState<PanelView>("list");
  const [selectedMapDay, setSelectedMapDay] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isGenerating && !isLoading) inputRef.current?.focus();
  }, [currentPhase, isGenerating, isLoading]);

  useEffect(() => {
    setShowOtherInput(false);
    setSelectedAirport("");
    setSelectedTime("");
  }, [currentPhase]);

  const toggleActivity = (dayIdx: number, activityIdx: number) => {
    const key = `${dayIdx}-${activityIdx}`;
    setExpandedActivities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) newSet.delete(key);
      else newSet.add(key);
      return newSet;
    });
  };

  const addMessage = (role: MessageRole, content: string, extras?: Partial<Message>) => {
    const newMessage: Message = { id: Date.now().toString(), role, content, ...extras };
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

  const handleAirportTimeSubmit = (isArrival: boolean) => {
    if (!selectedAirport || !selectedTime) return;
    const airportName = JAPAN_AIRPORTS.find(a => a.code === selectedAirport)?.name || selectedAirport;
    const timeDisplay = formatTimeDisplay(selectedTime);
    addMessage("user", `${airportName}, ${timeDisplay}`);
    if (isArrival) {
      setTripInfo((prev) => ({ ...prev, arrivalAirport: selectedAirport, arrivalTime: selectedTime }));
    } else {
      setTripInfo((prev) => ({ ...prev, departureAirport: selectedAirport, departureTime: selectedTime }));
    }
    moveToNextPhase();
  };

  const handleCityToggle = (city: string) => {
    setSelectedCities((prev) => prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]);
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
    if (currentPhase === 4) setTripInfo((prev) => ({ ...prev, travelers: value }));
    else if (currentPhase === 6 && value.toLowerCase() !== "skip") setTripInfo((prev) => ({ ...prev, mustDo: [value] }));
    else if (currentPhase === 10 && value.toLowerCase() !== "done") setTripInfo((prev) => ({ ...prev, additionalNotes: value }));
    setInputValue("");
    if (currentPhase === 10) generateItinerary();
    else moveToNextPhase();
  };

  const handleButtonClick = async (option: string) => {
    addMessage("user", option);
    if (currentPhase === 7) {
      let exp = "first";
      if (option.includes("once")) exp = "second";
      if (option.includes("regular")) exp = "repeat";
      setTripInfo((prev) => ({ ...prev, japanExperience: exp }));
    } else if (currentPhase === 8) {
      let pace = "moderate";
      if (option.includes("Relaxed")) pace = "slow";
      if (option.includes("Pack")) pace = "fast";
      setTripInfo((prev) => ({ ...prev, pace }));
    } else if (currentPhase === 9) {
      let food = "local";
      if (option.includes("Budget")) food = "budget";
      if (option.includes("Foodie")) food = "foodie";
      if (option.includes("High-end")) food = "gourmet";
      setTripInfo((prev) => ({ ...prev, foodStyle: food }));
    }
    moveToNextPhase();
  };

  const handleOtherSubmit = () => {
    if (!inputValue.trim()) return;
    const value = inputValue.trim();
    addMessage("user", value);
    if (currentPhase === 7) setTripInfo((prev) => ({ ...prev, japanExperience: value }));
    else if (currentPhase === 8) setTripInfo((prev) => ({ ...prev, pace: value }));
    else if (currentPhase === 9) setTripInfo((prev) => ({ ...prev, foodStyle: value }));
    setInputValue("");
    setShowOtherInput(false);
    moveToNextPhase();
  };

  const moveToNextPhase = () => {
    const nextPhase = currentPhase + 1;
    if (nextPhase <= TOTAL_PHASES) {
      setCurrentPhase(nextPhase);
      const phase = PHASES[nextPhase - 1];
      if (nextPhase === REQUIRED_PHASES + 1) {
        setTimeout(() => {
          addMessage("assistant", "Great! I have enough to build your itinerary. But a few more questions will make it even better. 👇\n\n(You can also hit 'Build now' anytime!)");
          setTimeout(() => addMessage("assistant", phase.question, { inputType: phase.inputType, options: phase.options }), 800);
        }, 500);
      } else {
        setTimeout(() => addMessage("assistant", phase.question, { inputType: phase.inputType, options: phase.options }), 500);
      }
    } else {
      generateItinerary();
    }
  };

  const handleGenerateNow = async () => await generateItinerary();

  const parseTravelerType = (text: string): string => {
    const lower = text.toLowerCase();
    if (lower.includes("girlfriend") || lower.includes("boyfriend") || lower.includes("partner") || lower.includes("wife") || lower.includes("husband") || lower.includes("couple")) return "couple";
    else if (lower.includes("friend")) return "friends";
    else if (lower.includes("family") || lower.includes("kid") || lower.includes("child") || lower.includes("son") || lower.includes("daughter")) {
      if (lower.includes("teen")) return "family-teens";
      if (lower.includes("baby") || lower.includes("toddler") || /\b[0-5]\s*(year|yr|歳)/.test(lower)) return "family-young";
      return "family-kids";
    } else if (lower.includes("solo")) return lower.includes("female") || lower.includes("woman") ? "solo-female" : "solo-male";
    return "solo-male";
  };

  const generateItinerary = async () => {
    setIsGenerating(true);
    addMessage("assistant", "Building your trip... \n\nI'm checking your flight times, working out the best routes, and making sure Day 1 and your last day are realistic. ~30 seconds. ✨");
    try {
      const travelerType = parseTravelerType(tripInfo.travelers || "");
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: tripInfo.dates?.start,
          endDate: tripInfo.dates?.end,
          arrivalAirport: tripInfo.arrivalAirport || "NRT",
          arrivalTime: tripInfo.arrivalTime || "14:00",
          departureAirport: tripInfo.departureAirport || tripInfo.arrivalAirport || "NRT",
          departureTime: tripInfo.departureTime || "14:00",
          travelerType,
          cities: tripInfo.cities?.map((c) => c.toLowerCase()) || ["tokyo"],
          mustVisit: tripInfo.mustDo?.join(", ") || "",
          japanExperience: tripInfo.japanExperience || "first",
          foodStyle: tripInfo.foodStyle || "local",
          pace: tripInfo.pace || "moderate",
          additionalNotes: [tripInfo.travelers, tripInfo.additionalNotes].filter(Boolean).join("\n"),
        }),
      });
      if (!response.ok) throw new Error("Failed to generate");
      const data = await response.json();
      setItinerary(data);
      addMessage("assistant", `Done! 🎉 Here's your ${data.summary?.totalDays || ""}-day trip.\n\nI've planned around your ${tripInfo.arrivalAirport || "arrival"} landing and ${tripInfo.departureAirport || "departure"} flight times.\n\nWant to change anything? Just tell me:\n• \"Day 2 is too packed\"\n• \"Add more ramen spots\"\n• \"Make mornings start later\"\n• \"Switch Day 3 and 4\"`);
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
    try {
      const travelerType = parseTravelerType(tripInfo.travelers || "");
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: tripInfo.dates?.start,
          endDate: tripInfo.dates?.end,
          arrivalAirport: tripInfo.arrivalAirport || "NRT",
          arrivalTime: tripInfo.arrivalTime || "14:00",
          departureAirport: tripInfo.departureAirport || tripInfo.arrivalAirport || "NRT",
          departureTime: tripInfo.departureTime || "14:00",
          travelerType,
          cities: tripInfo.cities?.map((c) => c.toLowerCase()) || ["tokyo"],
          mustVisit: tripInfo.mustDo?.join(", ") || "",
          japanExperience: tripInfo.japanExperience || "first",
          foodStyle: tripInfo.foodStyle || "local",
          pace: tripInfo.pace || "moderate",
          additionalNotes: [tripInfo.travelers, tripInfo.additionalNotes].filter(Boolean).join("\n"),
          existingItinerary: itinerary,
          adjustmentRequest: adjustment,
        }),
      });
      if (!response.ok) throw new Error("Failed to adjust");
      const data = await response.json();
      setItinerary(data);
      addMessage("assistant", "Updated! ✅ Take a look at the changes. Anything else?");
    } catch (error) {
      addMessage("assistant", "Couldn't make that change. Try rephrasing?");
    } finally {
      setIsLoading(false);
    }
  };

  const exportPDF = () => {
    if (!itinerary) return;
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = 20;

    const checkNewPage = (needed: number) => { if (y + needed > 270) { pdf.addPage(); y = 20; } };

    pdf.setFontSize(22);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(180, 83, 9);
    pdf.text("JapanWise Itinerary", margin, y);
    y += 10;

    if (itinerary.summary) {
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(120, 113, 108);
      pdf.text(`${itinerary.summary.totalDays} Days • ${itinerary.summary.cities.join(" → ")}`, margin, y);
      y += 15;
    }

    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 10;

    itinerary.itinerary.forEach((day) => {
      checkNewPage(50);
      pdf.setFontSize(13);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(28, 25, 23);
      pdf.text(`Day ${day.day} — ${day.city}`, margin, y);
      y += 5;
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(120, 113, 108);
      pdf.text(`${day.date}${day.theme ? ` • ${day.theme}` : ""}`, margin, y);
      y += 8;

      day.activities.forEach((activity) => {
        checkNewPage(15);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(28, 25, 23);
        const typeIcon = activity.type === "food" ? "🍽" : activity.type === "stay" ? "🏨" : "📍";
        pdf.text(`${activity.time}  ${typeIcon} ${activity.name}`, margin + 5, y);
        y += 5;
        if (activity.transport) {
          pdf.setFontSize(9);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(59, 130, 246);
          const transportLines = pdf.splitTextToSize(`→ ${activity.transport}`, contentWidth - 10);
          transportLines.forEach((line: string) => { checkNewPage(5); pdf.text(line, margin + 10, y); y += 4; });
        }
        if (activity.reservation && activity.reservation !== "Not needed" && activity.reservation !== "Walk-in OK") {
          pdf.setFontSize(9);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(220, 38, 38);
          pdf.text(`⚠ ${activity.reservation}`, margin + 10, y);
          y += 4;
        }
        y += 2;
      });

      if (day.stayArea) {
        checkNewPage(8);
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(79, 70, 229);
        pdf.text(`🏨 Stay: ${day.stayArea}`, margin + 5, y);
        y += 6;
      }
      y += 8;
    });

    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text("Generated by JapanWise • japanwise.app", margin, 285);
    pdf.save("japanwise-itinerary.pdf");
  };

  // Progress calculation
  const requiredProgress = Math.min(currentPhase, REQUIRED_PHASES) / REQUIRED_PHASES * 60;
  const optionalProgress = currentPhase > REQUIRED_PHASES ? ((currentPhase - REQUIRED_PHASES) / (TOTAL_PHASES - REQUIRED_PHASES)) * 40 : 0;
  const progress = itinerary ? 100 : Math.round(requiredProgress + optionalProgress);
  const canGenerate = currentPhase > REQUIRED_PHASES || (tripInfo.dates && tripInfo.arrivalAirport && tripInfo.cities && tripInfo.cities.length > 0);

  // ============================================
  // RENDER INPUT
  // ============================================
  const renderInput = () => {
    const lastMessage = messages[messages.length - 1];
    const inputType = lastMessage?.inputType;
    const currentPhaseData = PHASES[currentPhase - 1];

    if (itinerary) {
      return (
        <div className="flex gap-2">
          <input ref={inputRef} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !isLoading && handleAdjustment()} placeholder="Tell me what to change..." className="flex-1 px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400" disabled={isLoading} />
          <button onClick={handleAdjustment} disabled={isLoading || !inputValue.trim()} className="px-4 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 disabled:opacity-50 transition-colors">
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
              <input type="date" value={selectedDates.start} onChange={(e) => setSelectedDates((prev) => ({ ...prev, start: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-stone-500 mb-1">To</label>
              <input type="date" value={selectedDates.end} onChange={(e) => setSelectedDates((prev) => ({ ...prev, end: e.target.value }))} min={selectedDates.start} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
          </div>
          <button onClick={handleDateSubmit} disabled={!selectedDates.start || !selectedDates.end} className="w-full py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      );
    }

    if (inputType === "airport-time") {
      const isArrival = currentPhaseData?.isArrival ?? true;
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-stone-500 mb-2">Airport</label>
            <div className="grid grid-cols-2 gap-2">
              {JAPAN_AIRPORTS.map((airport) => (
                <button key={airport.code} onClick={() => setSelectedAirport(airport.code)} className={`px-3 py-2 rounded-lg border text-left text-sm transition-colors ${selectedAirport === airport.code ? "bg-amber-500 text-white border-amber-500" : "bg-white text-stone-700 border-stone-200 hover:border-amber-400"}`}>
                  <div className="font-medium">{airport.code}</div>
                  <div className="text-xs opacity-75">{airport.city}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-stone-500 mb-2">{isArrival ? "Landing time" : "Departure time"}</label>
            <input type="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-lg" />
            <p className="text-xs text-stone-400 mt-1">{isArrival ? "What time does your flight land in Japan?" : "What time does your flight depart from Japan?"}</p>
          </div>
          <button onClick={() => handleAirportTimeSubmit(isArrival)} disabled={!selectedAirport || !selectedTime} className="w-full py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
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
              <button key={option} onClick={() => handleCityToggle(option)} className={`px-4 py-2 rounded-full border transition-colors ${selectedCities.includes(option) ? "bg-amber-500 text-white border-amber-500" : "bg-white text-stone-700 border-stone-200 hover:border-amber-400"}`}>{option}</button>
            ))}
          </div>
          <button onClick={handleCitySubmit} disabled={selectedCities.length === 0} className="w-full py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 disabled:opacity-50 transition-colors">
            Continue with {selectedCities.length} {selectedCities.length === 1 ? "city" : "cities"}
          </button>
        </div>
      );
    }

    if (inputType === "buttons-with-other" && lastMessage?.options) {
      if (showOtherInput) {
        return (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input ref={inputRef} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleOtherSubmit()} placeholder="Tell me more..." className="flex-1 px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400" />
              <button onClick={handleOtherSubmit} disabled={!inputValue.trim()} className="px-4 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 disabled:opacity-50 transition-colors"><Send className="w-5 h-5" /></button>
            </div>
            <button onClick={() => setShowOtherInput(false)} className="text-sm text-stone-500 hover:text-stone-700">← Back to options</button>
          </div>
        );
      }
      return (
        <div className="flex flex-col gap-2">
          {lastMessage.options.map((option) => (
            <button key={option} onClick={() => handleButtonClick(option)} disabled={isGenerating} className="w-full py-3 rounded-xl transition-colors bg-white text-stone-700 border border-stone-200 hover:border-amber-400 hover:bg-amber-50 disabled:opacity-50">{option}</button>
          ))}
          <button onClick={() => setShowOtherInput(true)} className="w-full py-3 rounded-xl transition-colors bg-stone-50 text-stone-500 border border-dashed border-stone-300 hover:border-amber-400 hover:bg-amber-50">Other... (type your own)</button>
        </div>
      );
    }

    if (inputType === "buttons" && lastMessage?.options) {
      return (
        <div className="flex flex-col gap-2">
          {lastMessage.options.map((option) => (
            <button key={option} onClick={() => handleButtonClick(option)} disabled={isGenerating} className="w-full py-3 rounded-xl transition-colors bg-white text-stone-700 border border-stone-200 hover:border-amber-400 hover:bg-amber-50 disabled:opacity-50">{option}</button>
          ))}
        </div>
      );
    }

    return (
      <div className="flex gap-2">
        <input ref={inputRef} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()} placeholder="Type your answer..." className="flex-1 px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400" />
        <button onClick={handleTextSubmit} disabled={!inputValue.trim()} className="px-4 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 disabled:opacity-50 transition-colors"><Send className="w-5 h-5" /></button>
      </div>
    );
  };

  // ============================================
  // RENDER ITINERARY PANEL
  // ============================================
  const renderItineraryPanel = () => {
    if (!itinerary) {
      const days = tripInfo.dates ? Math.ceil((new Date(tripInfo.dates.end).getTime() - new Date(tripInfo.dates.start).getTime()) / (1000 * 60 * 60 * 24)) + 1 : 0;
      return (
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-stone-200">
            <h2 className="text-xl font-semibold text-stone-800">Your Trip</h2>
            <p className="text-sm text-stone-500">Building as we chat...</p>
          </div>
          <div className="flex-1 p-6 space-y-4 overflow-auto">
            {tripInfo.dates ? (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-center gap-2 text-amber-700 font-medium mb-1"><Calendar className="w-4 h-4" /> Dates</div>
                <p className="text-stone-700">{tripInfo.dates.start} → {tripInfo.dates.end}</p>
                <p className="text-sm text-stone-500">{days} days</p>
              </div>
            ) : (
              <div className="p-4 bg-stone-50 rounded-xl border border-dashed border-stone-300">
                <div className="flex items-center gap-2 text-stone-400"><Calendar className="w-4 h-4" /> When?</div>
              </div>
            )}
            {tripInfo.arrivalAirport ? (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-center gap-2 text-amber-700 font-medium mb-1"><Plane className="w-4 h-4" /> Flights</div>
                <p className="text-stone-700 text-sm">Arrive: {tripInfo.arrivalAirport} ({tripInfo.arrivalTime ? formatTimeDisplay(tripInfo.arrivalTime) : ""})</p>
                {tripInfo.departureAirport && <p className="text-stone-700 text-sm">Depart: {tripInfo.departureAirport} ({tripInfo.departureTime ? formatTimeDisplay(tripInfo.departureTime) : ""})</p>}
              </div>
            ) : (
              <div className="p-4 bg-stone-50 rounded-xl border border-dashed border-stone-300">
                <div className="flex items-center gap-2 text-stone-400"><Plane className="w-4 h-4" /> Flights?</div>
              </div>
            )}
            {tripInfo.travelers ? (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-center gap-2 text-amber-700 font-medium mb-1"><Users className="w-4 h-4" /> Travelers</div>
                <p className="text-stone-700">{tripInfo.travelers}</p>
              </div>
            ) : (
              <div className="p-4 bg-stone-50 rounded-xl border border-dashed border-stone-300">
                <div className="flex items-center gap-2 text-stone-400"><Users className="w-4 h-4" /> Who?</div>
              </div>
            )}
            {tripInfo.cities && tripInfo.cities.length > 0 ? (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-center gap-2 text-amber-700 font-medium mb-1"><MapPin className="w-4 h-4" /> Destinations</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tripInfo.cities.map((city) => (<span key={city} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">{city}</span>))}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-stone-50 rounded-xl border border-dashed border-stone-300">
                <div className="flex items-center gap-2 text-stone-400"><MapPin className="w-4 h-4" /> Where?</div>
              </div>
            )}
            {tripInfo.mustDo && tripInfo.mustDo.length > 0 && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-center gap-2 text-amber-700 font-medium mb-1"><Sparkles className="w-4 h-4" /> Must Do</div>
                <p className="text-stone-700">{tripInfo.mustDo.join(", ")}</p>
              </div>
            )}
            {(tripInfo.japanExperience || tripInfo.pace || tripInfo.foodStyle) && (
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <div className="text-sm text-stone-500 space-y-1">
                  {tripInfo.japanExperience && <p>Experience: {tripInfo.japanExperience}</p>}
                  {tripInfo.pace && <p>Pace: {tripInfo.pace}</p>}
                  {tripInfo.foodStyle && <p>Food: {tripInfo.foodStyle}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // ===== ITINERARY VIEW WITH TABS =====
    return (
      <div className="h-full flex flex-col">
        {/* Header with Tabs */}
        <div className="p-4 border-b border-stone-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-semibold text-stone-800">Your Itinerary</h2>
              <p className="text-xs text-stone-500">{itinerary.summary?.totalDays} days • {itinerary.summary?.cities.join(" → ")}</p>
            </div>
            <button onClick={exportPDF} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors">
              <FileDown className="w-3.5 h-3.5" /> PDF
            </button>
          </div>
          {/* View Toggle */}
          <div className="flex bg-stone-100 rounded-lg p-1">
            <button onClick={() => setPanelView("list")} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${panelView === "list" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}>
              <List className="w-4 h-4" /> List
            </button>
            <button onClick={() => setPanelView("map")} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${panelView === "map" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}>
              <Map className="w-4 h-4" /> Map
            </button>
          </div>
        </div>

        {/* Content */}
        {panelView === "map" ? (
          <div className="flex-1 flex flex-col">
            {/* Day Filter */}
            <div className="p-3 border-b border-stone-100 flex gap-2 overflow-x-auto">
              <button onClick={() => setSelectedMapDay(null)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${selectedMapDay === null ? "bg-amber-500 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}>
                All Days
              </button>
              {itinerary.itinerary.map((day) => (
                <button key={day.day} onClick={() => setSelectedMapDay(day.day)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${selectedMapDay === day.day ? "bg-amber-500 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}>
                  Day {day.day}
                </button>
              ))}
            </div>
            {/* Map */}
            <div className="flex-1 p-3">
              <ItineraryMap itinerary={itinerary} selectedDay={selectedMapDay} />
            </div>
          </div>
        ) : (
          <div className="flex-1 p-4 overflow-auto space-y-4">
            {itinerary.itinerary.map((day, dayIdx) => (
              <div key={day.day} className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">{day.day}</div>
                  <div>
                    <h3 className="font-semibold text-stone-800 text-sm">{day.theme || `Day ${day.day}`}</h3>
                    <p className="text-xs text-stone-500">{day.date} • {day.city}</p>
                  </div>
                </div>
                <div className="ml-4 pl-4 border-l-2 border-stone-200 space-y-2">
                  {day.activities.map((activity, activityIdx) => {
                    const isFood = activity.type === "food";
                    const klookLink = !isFood ? getKlookLink(activity.name) : null;
                    const isExpanded = expandedActivities.has(`${dayIdx}-${activityIdx}`);
                    const hasDetails = activity.description || activity.tip || activity.transport || (activity.reservation && activity.reservation !== "Not needed" && activity.reservation !== "Walk-in OK") || klookLink;
                    return (
                      <div key={activityIdx} className="relative">
                        <div className="absolute -left-[21px] w-2.5 h-2.5 bg-white border-2 border-stone-300 rounded-full" />
                        <div className={`rounded-lg transition-all ${activity.type === "food" ? "bg-rose-50 border border-rose-200" : activity.type === "stay" ? "bg-indigo-50 border border-indigo-200" : "bg-stone-50 border border-stone-200"}`}>
                          <button onClick={() => hasDetails && toggleActivity(dayIdx, activityIdx)} className={`w-full p-2.5 text-left ${hasDetails ? "cursor-pointer hover:bg-black/5" : "cursor-default"}`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {activity.type === "food" ? <Utensils className="w-3.5 h-3.5 text-rose-500" /> : activity.type === "stay" ? <Hotel className="w-3.5 h-3.5 text-indigo-500" /> : <Camera className="w-3.5 h-3.5 text-stone-500" />}
                                <span className="font-medium text-stone-800 text-sm">{activity.name}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs text-stone-500">{activity.time}</span>
                                {hasDetails && (isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-stone-400" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-400" />)}
                              </div>
                            </div>
                            <div className="flex gap-2 mt-1 text-xs text-stone-500">
                              {activity.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{activity.duration}</span>}
                              {(activity.cost || activity.price) && <span>{activity.cost || activity.price}</span>}
                            </div>
                          </button>
                          {isExpanded && hasDetails && (
                            <div className="px-2.5 pb-2.5 pt-1 border-t border-stone-200/50 space-y-1.5">
                              {activity.description && <p className="text-xs text-stone-600">{activity.description}</p>}
                              {activity.transport && <p className="text-xs text-blue-600 flex items-center gap-1"><Train className="w-3 h-3" />{activity.transport}</p>}
                              {activity.reservation && activity.reservation !== "Not needed" && activity.reservation !== "Walk-in OK" && <p className="text-xs text-red-600 flex items-center gap-1"><TicketCheck className="w-3 h-3" />{activity.reservation}</p>}
                              {activity.tip && <p className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded">💡 {activity.tip}</p>}
                              {klookLink && <a href={klookLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 mt-1 px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded-full transition-colors">Book on Klook <ExternalLink className="w-3 h-3" /></a>}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {day.stayArea && <div className="ml-4 pl-4 text-xs text-indigo-600">🏨 Stay: {day.stayArea}</div>}
              </div>
            ))}
            {itinerary.tips && itinerary.tips.length > 0 && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <h3 className="font-semibold text-amber-800 mb-2 text-sm">Pro Tips</h3>
                <ul className="space-y-1.5">
                  {itinerary.tips.map((tip, idx) => (<li key={idx} className="text-xs text-stone-700 flex items-start gap-2"><span>•</span><span>{tip}</span></li>))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <div className="h-screen flex flex-col bg-stone-50">
      <header className="bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-stone-800">JapanWise</h1>
          <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded-full">Your friend in Japan</span>
        </div>
        <button onClick={() => setShowMobileItinerary(!showMobileItinerary)} className="lg:hidden p-2 text-stone-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg">
          {showMobileItinerary ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className={`flex-1 flex flex-col ${showMobileItinerary ? "hidden lg:flex" : "flex"}`}>
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${message.role === "user" ? "bg-amber-500 text-white rounded-br-md" : "bg-white text-stone-800 border border-stone-200 rounded-bl-md"}`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-2 text-stone-500"><Loader2 className="w-4 h-4 animate-spin" /> Building your perfect trip...</div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t border-stone-200 bg-white">
            <div className="p-4 pb-2">{renderInput()}</div>
            <div className="px-4 pb-4 pt-2 border-t border-stone-100">
              <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-xs text-stone-500 w-12">{itinerary ? "Done!" : `${progress}%`}</span>
                </div>
                {canGenerate && !itinerary && !isGenerating && (
                  <button onClick={handleGenerateNow} className="px-4 py-2 text-sm bg-amber-500 text-white rounded-full hover:bg-amber-600 flex items-center gap-2 font-medium shadow-lg shadow-amber-500/25">
                    <Sparkles className="w-4 h-4" /> Build now
                  </button>
                )}
                {itinerary && (
                  <button onClick={() => setShowMobileItinerary(true)} className="lg:hidden px-4 py-2 text-sm bg-stone-800 text-white rounded-full hover:bg-stone-700 flex items-center gap-2 font-medium">
                    <Eye className="w-4 h-4" /> View Itinerary
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={`w-full lg:w-[450px] bg-white border-l border-stone-200 ${showMobileItinerary ? "block" : "hidden lg:block"}`}>
          {renderItineraryPanel()}
        </div>
      </div>
    </div>
  );
}