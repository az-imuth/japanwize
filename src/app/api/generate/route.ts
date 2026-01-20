import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============================================
// SIMPLE RATE LIMITING (In-Memory)
// ============================================
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // requests per day
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in ms

function getRateLimitKey(request: NextRequest): string {
  // Get IP from various headers (Vercel/Cloudflare)
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0] || realIp || "unknown";
  return ip;
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  // Clean up old entries periodically
  if (rateLimitMap.size > 10000) {
    for (const [k, v] of rateLimitMap.entries()) {
      if (now > v.resetTime) {
        rateLimitMap.delete(k);
      }
    }
  }

  if (!record || now > record.resetTime) {
    // First request or window expired
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (record.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT - record.count };
}

// ============================================
// CITY ALLOCATION RULES
// ============================================
const cityAllocationRules: Record<string, { min: number; max: number; weight: number }> = {
  tokyo: { min: 3, max: 7, weight: 3 },
  kyoto: { min: 2, max: 5, weight: 2.5 },
  osaka: { min: 1, max: 3, weight: 2 },
  nara: { min: 0.5, max: 1, weight: 0.5 },
  hiroshima: { min: 1, max: 2, weight: 1.5 },
  hakone: { min: 1, max: 2, weight: 1 },
  nikko: { min: 0.5, max: 1, weight: 0.5 },
  kanazawa: { min: 1, max: 2, weight: 1.5 },
  takayama: { min: 1, max: 2, weight: 1 },
  fukuoka: { min: 1, max: 3, weight: 1.5 },
  sapporo: { min: 2, max: 4, weight: 2 },
  okinawa: { min: 3, max: 5, weight: 2 },
};

const airportCityMap: Record<string, string> = {
  NRT: "tokyo",
  HND: "tokyo", 
  KIX: "osaka",
  NGO: "nagoya",
  FUK: "fukuoka",
  CTS: "sapporo",
  OKA: "okinawa",
};

// ============================================
// MAIN API HANDLER
// ============================================
export async function POST(request: NextRequest) {
  // Check rate limit
  const rateLimitKey = getRateLimitKey(request);
  const { allowed, remaining } = checkRateLimit(rateLimitKey);

  if (!allowed) {
    return NextResponse.json(
      { 
        error: "Rate limit exceeded. You can generate up to 5 itineraries per day. Please try again tomorrow.",
        retryAfter: "24 hours"
      },
      { 
        status: 429,
        headers: {
          "X-RateLimit-Limit": RATE_LIMIT.toString(),
          "X-RateLimit-Remaining": "0",
        }
      }
    );
  }

  try {
    const formData = await request.json();

    const {
      startDate,
      endDate,
      arrivalAirport,
      arrivalTime,
      departureAirport,
      departureTime,
      ageRange,
      travelerType,
      japanExperience,
      cities,
      mustVisit,
      accommodationStyle,
      foodStyle,
      pace,
      tripPurpose,
      interests,
      morningPerson,
      englishLevel,
      dietaryRestrictions,
      avoidances,
      additionalNotes,
    } = formData;

    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Determine starting and ending cities based on airports
    const startCity = airportCityMap[arrivalAirport] || "tokyo";
    const actualDepartureAirport = departureAirport === "same" ? arrivalAirport : departureAirport;
    const endCity = airportCityMap[actualDepartureAirport] || startCity;

    // Calculate recommended day allocation
    const selectedCities = cities || [];
    const cityWeights = selectedCities.map((city: string) => ({
      city,
      weight: cityAllocationRules[city]?.weight || 1,
      min: cityAllocationRules[city]?.min || 1,
      max: cityAllocationRules[city]?.max || 3,
    }));
    
    const totalWeight = cityWeights.reduce((sum: number, c: { weight: number }) => sum + c.weight, 0);

    // Get month for seasonal recommendations
    const travelMonth = start.getMonth() + 1;
    const seasonInfo = getSeasonInfo(travelMonth);

    // Calculate day allocation
    const dayAllocation = cityWeights.map((c: { city: string; weight: number; min: number; max: number }) => {
      const allocatedDays = Math.round((c.weight / totalWeight) * totalDays);
      return {
        city: c.city,
        days: Math.max(c.min, Math.min(c.max, allocatedDays)),
      };
    });

    const prompt = `Create a ${totalDays}-day Japan itinerary with DEEP LOCAL KNOWLEDGE.

TRAVELER: ${ageRange || "adult"} | ${travelerType || "solo"} | ${japanExperience === "first" ? "First-timer (include iconic spots but with LOCAL SECRETS)" : japanExperience === "second" ? "2nd visit (mix popular with hidden gems)" : "Frequent visitor (focus on unique experiences)"}

DATES: ${startDate} to ${endDate}
ARRIVAL: ${startCity.toUpperCase()} (${arrivalTime || "afternoon"})
DEPARTURE: ${endCity.toUpperCase()} (${departureTime || "afternoon"})

CITIES & DAYS:
${dayAllocation.map((d: { city: string; days: number }) => `- ${d.city}: ${d.days} day(s)`).join("\n")}

SEASON: ${seasonInfo}

STYLE: ${accommodationStyle || "comfortable"} accommodation, ${foodStyle || "local"} food, ${pace || "moderate"} pace
${tripPurpose ? `PURPOSE: ${tripPurpose}` : ""}

INTERESTS: ${interests?.length ? interests.join(", ") : "General sightseeing"}
${mustVisit ? `MUST VISIT: ${mustVisit}` : ""}
${dietaryRestrictions?.length ? `DIETARY: ${dietaryRestrictions.join(", ")}` : ""}
${avoidances?.length ? `AVOID: ${avoidances.join(", ")}` : ""}
${additionalNotes ? `NOTES: ${additionalNotes}` : ""}

═══════════════════════════════════════════════════════════════════
CRITICAL REQUIREMENTS - READ CAREFULLY
═══════════════════════════════════════════════════════════════════

1. RESTAURANTS MUST BE SPECIFIC:
   ❌ WRONG: "Ramen in Shinjuku", "Izakaya dinner"
   ✅ RIGHT: "Fuunji (風雲児) in Shinjuku", "Torikizoku Shibuya"
   → Use REAL restaurant names that exist. Include the area.

2. EVERY ACTIVITY MUST HAVE A LOCAL TIP:
   ❌ WRONG: "Visit Senso-ji Temple" (no tip)
   ✅ RIGHT: "Senso-ji Temple" + tip: "Arrive before 7am to experience it without crowds. Enter via Nitenmon gate for a tourist-free approach."

3. TIPS MUST BE SPECIFIC TO THIS TRIP:
   ❌ WRONG: "Buy a JR Pass" (generic)
   ✅ RIGHT: "For your Tokyo-Osaka route, the JR Pass 7-day (¥50,000) saves money vs individual tickets (¥28,000 round trip) only if you also do day trips"

4. TIME OPTIMIZATION IS KEY:
   - Include BEST TIME to visit each spot
   - Mention crowd avoidance strategies
   - Morning activities for popular spots

═══════════════════════════════════════════════════════════════════

RESPOND WITH ONLY VALID JSON. NO COMMENTS. NO MARKDOWN.
Include ALL ${totalDays} days completely.

{
  "summary": {
    "totalDays": ${totalDays},
    "cities": ["city1", "city2"],
    "highlights": ["specific highlight 1", "specific highlight 2"]
  },
  "itinerary": [
    {
      "day": 1,
      "date": "${startDate}",
      "city": "Tokyo",
      "theme": "Arrival & Shinjuku Discovery",
      "activities": [
        {
          "time": "15:00",
          "type": "activity",
          "name": "Shinjuku Gyoen",
          "description": "Beautiful garden perfect for recovering from jet lag",
          "tip": "Enter from Okido Gate (less crowded than main entrance). The Taiwan Pavilion area is usually empty.",
          "duration": "1.5h",
          "cost": "¥500"
        },
        {
          "time": "18:00",
          "type": "food",
          "name": "Omoide Yokocho - Torishige",
          "cuisine": "Yakitori",
          "description": "Tiny 8-seat yakitori joint run by the same family since 1950",
          "tip": "Order the 'negima' (chicken and leek) and 'sunagimo' (gizzard). Cash only.",
          "price": "¥2,000-3,000"
        }
      ],
      "stayArea": "Shinjuku"
    }
  ],
  "tips": [
    "Specific tip for THIS itinerary based on the cities and dates",
    "Another specific practical tip"
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are JapanWise, a Japan travel expert who lived in Japan for 15 years. You know LOCAL SECRETS that tourists never discover.

YOUR UNIQUE VALUE:
- You recommend SPECIFIC restaurants by name (real places that exist)
- You know the BEST TIME to visit each spot to avoid crowds
- You share tips that only locals know (which entrance, what to order, hidden spots)
- You optimize routes so travelers don't waste time

RULES:
1. Every restaurant MUST have a specific name (not just "ramen shop" but "Fuunji in Shinjuku")
2. Every activity MUST have a useful local tip
3. Tips should be actionable and specific (times, prices, what to order)
4. Response must be valid JSON only - no comments, no markdown
5. Include ALL days - never skip or abbreviate`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 16000,
    });

    const textContent = response.choices[0]?.message?.content;
    if (!textContent) {
      throw new Error("No response from AI");
    }

    // Clean and parse JSON
    let itineraryData;
    try {
      let cleanedContent = textContent
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();
      
      cleanedContent = cleanedContent
        .replace(/\/\/.*$/gm, "")
        .replace(/\/\*[\s\S]*?\*\//g, "");
      
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      
      itineraryData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Raw response:", textContent.slice(0, 1000));
      throw new Error("Failed to parse itinerary JSON");
    }

    // Return with rate limit headers
    return NextResponse.json(itineraryData, {
      headers: {
        "X-RateLimit-Limit": RATE_LIMIT.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
      }
    });
  } catch (error) {
    console.error("Error generating itinerary:", error);
    return NextResponse.json(
      { error: "Failed to generate itinerary" },
      { status: 500 }
    );
  }
}

function getSeasonInfo(month: number): string {
  if (month >= 3 && month <= 5) {
    return "SPRING: Cherry blossoms late March-mid April. Include hanami spots! Golden Week (Apr 29-May 5) is extremely crowded.";
  } else if (month >= 6 && month <= 8) {
    return "SUMMER: June is rainy (tsuyu). July-August hot & humid. Many festivals! Recommend early morning activities.";
  } else if (month >= 9 && month <= 11) {
    return "AUTUMN: Leaves peak mid-Nov to early Dec. Perfect weather. Include koyo viewing spots!";
  } else {
    return "WINTER: Cold but fewer tourists. Great for onsen. Illuminations in Dec. Some places closed Dec 31-Jan 3.";
  }
}