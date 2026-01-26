import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============================================
// RATE LIMITING
// ============================================
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000;

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0] || realIp || "unknown";
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (rateLimitMap.size > 10000) {
    for (const [k, v] of rateLimitMap.entries()) {
      if (now > v.resetTime) rateLimitMap.delete(k);
    }
  }

  if (!record || now > record.resetTime) {
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
// CITY ALLOCATION
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

function getSeasonInfo(month: number): string {
  if (month >= 3 && month <= 5) {
    return "SPRING: Cherry blossoms late March-mid April. Golden Week (Apr 29-May 5) is extremely crowded.";
  } else if (month >= 6 && month <= 8) {
    return "SUMMER: June is rainy. July-August hot & humid. Many festivals! Recommend early morning activities.";
  } else if (month >= 9 && month <= 11) {
    return "AUTUMN: Leaves peak mid-Nov to early Dec. Perfect weather. Include koyo viewing spots!";
  } else {
    return "WINTER: Cold but fewer tourists. Great for onsen. Some places closed Dec 31-Jan 3.";
  }
}

// ============================================
// PERSONALIZATION RULES
// ============================================
function getPersonalizationRules(travelerType: string, foodStyle: string): string {
  const rules: string[] = [];

  switch (travelerType) {
    case "family-young":
      rules.push("FAMILY WITH YOUNG KIDS (0-6): No izakayas or bars. Dinner by 18:00. Kid-friendly restaurants with high chairs. Stroller-accessible spots. Include parks, aquariums, interactive museums. Shorter walking distances. Nap time consideration in early afternoon.");
      break;
    case "family-kids":
      rules.push("FAMILY WITH KIDS (7-12): Family restaurants OK, but no smoky izakayas. Activities kids find exciting (Pokemon Center, teamLab, etc). Balance culture with fun. Don't over-explain history.");
      break;
    case "family-teens":
      rules.push("FAMILY WITH TEENS: Teens love Harajuku, Akihabara, trendy cafes. Give them some independence. Later dinners OK. Include Instagram-worthy spots.");
      break;
    case "couple":
      rules.push("COUPLE: Romantic spots, intimate restaurants, nice atmosphere > hype. Rooftop bars, river walks, sunset views. Quality over quantity.");
      break;
    case "solo-female":
      rules.push("SOLO FEMALE: Safe neighborhoods, well-lit areas for evening. Solo-friendly restaurants (counter seats). Women-only accommodations option. Combine popular spots with hidden gems.");
      break;
    case "solo-male":
      rules.push("SOLO MALE: Counter seats at izakayas, ramen shops. Standing bars (tachinomi) for local interaction. Flexible schedule, deeper exploration.");
      break;
    case "friends":
      rules.push("FRIENDS GROUP: Izakayas perfect for sharing. Karaoke. Group-friendly activities. Lively neighborhoods. Late nights OK.");
      break;
    case "multi-gen":
      rules.push("MULTI-GENERATIONAL: Balance everyone's pace. Accessible routes. Rest spots. Mix of cultural and light activities. Early dinners. Avoid too many stairs.");
      break;
  }

  switch (foodStyle) {
    case "budget":
      rules.push("BUDGET FOOD: Convenience stores (onigiri, sandwiches), standing soba, gyudon chains OK for quick meals. Lunch deals (teishoku). Depachika discounts after 7pm.");
      break;
    case "local":
      rules.push("LOCAL EATS: Neighborhood izakayas, family-run shops, local favorites. Where salary workers eat. Counter seats for interaction. ¥1,500-3,000 per meal.");
      break;
    case "foodie":
      rules.push("FOODIE: Famous local specialties, destination restaurants, food halls. Worth traveling for. Reservations may be needed. ¥3,000-8,000 per meal.");
      break;
    case "gourmet":
      rules.push("GOURMET: High-end sushi, kaiseki, omakase. Michelin spots and local legends. Reservations essential. ¥10,000+ per meal. Dress code awareness.");
      break;
  }

  return rules.join("\n");
}

// ============================================
// SYSTEM PROMPT - JAPANWISE SOUL
// ============================================
const SYSTEM_PROMPT = `You are JapanWise — not a travel agency, but a friend who lives in Japan.

YOUR IDENTITY:
You're the friend everyone wishes they had in Japan. You've lived in Tokyo for 8 years, but you've spent serious time in Kyoto, Osaka, and beyond. You're a bit of a food obsessive, you know the culture deeply, and you genuinely love showing people YOUR Japan — not the guidebook Japan.

HOW YOU PLAN TRIPS:
You're not making an "itinerary" — you're planning a trip for a friend who's visiting you. You'd never send them somewhere you haven't been yourself. You pick places because YOU love them, not because they're famous.

YOUR PHILOSOPHY:
1. "IKI" (粋) — Be tasteful, never try-hard. No over-stuffed schedules. No tourist traps just because they're popular. Leave room to breathe.

2. "KIKUBARI" (気配り) — Anticipate what they need before they know it. Tired after 3 temples? There's a perfect kissaten around the corner. Heavy lunch? The afternoon is a gentle walk.

3. "SENSIBILITY" — Your taste shows in what you pick. Not the famous spot, but the RIGHT spot for THIS person. A solo female traveler gets different recs than a group of friends.

4. "STORY" — A trip is a narrative, not a checklist. Day 1 sets the tone. The middle builds. The last day closes with meaning. Even within a day, there's a rhythm.

YOUR RULES:
- NEVER recommend a place you wouldn't personally take a friend
- ALWAYS consider who this specific person is (kids? couple? foodie? first-timer?)
- Each restaurant must be a REAL place with a specific name and location
- Include the insider tip you'd whisper to them as you walk in together
- Mix the iconic (if they want it) with your personal favorites
- Consider the FLOW: energy levels, walking distance, meal timing, emotional arc
- Variety: never repeat the same type of spot back-to-back unless that's the point

CRITICAL - PRACTICAL PLANNING (for "planner" type travelers):
- ALWAYS include "transport" field: how to get from previous spot (e.g., "10 min walk", "JR Yamanote to Shibuya (15 min, ¥200)", "Taxi recommended (¥1,500)")
- ALWAYS include "reservation" field: "Required - book 2 weeks ahead", "Recommended", "Walk-in OK", "Get there by 11am to avoid queue"
- Make sure timing is REALISTIC - include travel time between spots
- If a place is hard to find, mention landmarks in the tip
- For popular spots, mention best times to avoid crowds

RESPONSE:
- Valid JSON only, no markdown, no explanation
- Every activity MUST have transport and reservation fields`;

// ============================================
// MAIN HANDLER
// ============================================
export async function POST(request: NextRequest) {
  const rateLimitKey = getRateLimitKey(request);
  const { allowed, remaining } = checkRateLimit(rateLimitKey);

  if (!allowed) {
    return NextResponse.json(
      { 
        error: "Daily limit reached (5 itineraries/day). Please try again tomorrow.",
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
      dietaryRestrictions,
      avoidances,
      additionalNotes,
      // For partial adjustments
      existingItinerary,
      adjustmentRequest,
    } = formData;

    // Calculate days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Cities
    const startCity = airportCityMap[arrivalAirport] || "tokyo";
    const actualDepartureAirport = departureAirport === "same" ? arrivalAirport : departureAirport;
    const endCity = airportCityMap[actualDepartureAirport] || startCity;

    // Day allocation
    const selectedCities = cities || [];
    const cityWeights = selectedCities.map((city: string) => ({
      city,
      weight: cityAllocationRules[city]?.weight || 1,
      min: cityAllocationRules[city]?.min || 1,
      max: cityAllocationRules[city]?.max || 3,
    }));
    
    const totalWeight = cityWeights.reduce((sum: number, c: { weight: number }) => sum + c.weight, 0);
    const travelMonth = start.getMonth() + 1;
    const seasonInfo = getSeasonInfo(travelMonth);

    const dayAllocation = cityWeights.map((c: { city: string; weight: number; min: number; max: number }) => {
      const allocatedDays = Math.round((c.weight / totalWeight) * totalDays);
      return {
        city: c.city,
        days: Math.max(c.min, Math.min(c.max, allocatedDays)),
      };
    });

    // Generate dates for each day
    const dates: string[] = [];
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }

    // Get personalization rules
    const personalizationRules = getPersonalizationRules(travelerType, foodStyle);

    // ============================================
    // PARTIAL ADJUSTMENT MODE
    // ============================================
    if (existingItinerary && adjustmentRequest) {
      const adjustPrompt = `You have already created this itinerary for your friend:

${JSON.stringify(existingItinerary, null, 2)}

Your friend now says: "${adjustmentRequest}"

Please adjust the itinerary based on their request. 
IMPORTANT:
- Keep everything that's working well
- Only change what they asked for
- Maintain the overall flow and quality
- Update transport times if spots change
- Keep the same JSON structure
- NEVER remove days or drastically restructure unless asked

Return the COMPLETE updated itinerary as valid JSON.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: adjustPrompt },
        ],
        temperature: 0.7,
        max_tokens: 8000,
      });

      const textContent = response.choices[0]?.message?.content;
      if (!textContent) throw new Error("No response from AI");

      let itineraryData;
      try {
        let cleanedContent = textContent
          .replace(/```json\s*/g, "")
          .replace(/```\s*/g, "")
          .replace(/\/\/.*$/gm, "")
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .trim();
        
        const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No JSON found");
        
        itineraryData = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error("Parse error:", parseError);
        throw new Error("Failed to parse adjusted itinerary");
      }

      return NextResponse.json(itineraryData, {
        headers: {
          "X-RateLimit-Limit": RATE_LIMIT.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
        }
      });
    }

    // ============================================
    // FULL GENERATION MODE
    // ============================================
    const prompt = `Create a ${totalDays}-day Japan itinerary for my friend.

WHO IS THIS FRIEND:
- ${ageRange || "Adult"}, traveling as: ${travelerType || "solo"}
- Japan experience: ${japanExperience === "first" ? "First time ever! Show them the magic while keeping it real." : japanExperience === "second" ? "Been once before. They know the basics, show them deeper." : "Japan regular. Skip the obvious, go straight to the good stuff."}

THEIR TRIP:
- Dates: ${dates.join(", ")}
- Arriving: ${startCity.toUpperCase()} on ${startDate} (${arrivalTime || "afternoon"})
- Leaving: ${endCity.toUpperCase()} on ${endDate} (${departureTime || "afternoon"})
- Cities they want to visit: ${dayAllocation.map((d: { city: string; days: number }) => `${d.city} (${d.days} days)`).join(", ")}

SEASON: ${seasonInfo}

THEIR STYLE:
- Accommodation: ${accommodationStyle || "comfortable"}
- Food: ${foodStyle || "local"}
- Pace: ${pace || "moderate"}
${tripPurpose ? `- This trip is for: ${tripPurpose}` : ""}
${morningPerson === "early" ? "- They're an early bird, 6am starts are fine" : morningPerson === "late" ? "- Night owl, let them sleep in" : ""}

WHAT THEY'RE INTO: ${interests?.length ? interests.join(", ") : "Open to everything"}
${mustVisit ? `MUST INCLUDE: ${mustVisit}` : ""}
${dietaryRestrictions?.length ? `DIETARY NEEDS: ${dietaryRestrictions.join(", ")}` : ""}
${avoidances?.length ? `THEY WANT TO AVOID: ${avoidances.join(", ")}` : ""}
${additionalNotes ? `THEY MENTIONED: ${additionalNotes}` : ""}

PERSONALIZATION RULES (FOLLOW STRICTLY):
${personalizationRules}

Return ONLY valid JSON with this structure:
{
  "summary": {
    "totalDays": ${totalDays},
    "cities": ["city1", "city2"],
    "highlights": ["highlight1", "highlight2", "highlight3"]
  },
  "itinerary": [
    {
      "day": 1,
      "date": "${dates[0]}",
      "city": "Tokyo",
      "theme": "Arrival & First Taste",
      "activities": [
        {
          "time": "15:00",
          "type": "activity",
          "name": "Specific Place Name",
          "description": "Why I'm taking you here",
          "tip": "What I'd tell you as we walk in",
          "duration": "1.5h",
          "cost": "¥500",
          "transport": "From Shinjuku Station East Exit: 5 min walk",
          "reservation": "Not needed"
        },
        {
          "time": "18:00",
          "type": "food",
          "name": "Restaurant Name (日本語名) - Neighborhood",
          "cuisine": "Type",
          "description": "Why this place is special",
          "tip": "What to order, where to sit, what to know",
          "price": "¥2,000-3,000",
          "transport": "10 min walk through Omoide Yokocho",
          "reservation": "Recommended for dinner - call same day morning"
        }
      ],
      "stayArea": "Neighborhood"
    }
  ],
  "tips": ["Practical tip for this specific trip"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT + `\n\nInclude ALL ${totalDays} days. Every activity MUST have transport and reservation fields.` },
        { role: "user", content: prompt },
      ],
      temperature: 0.85,
      max_tokens: 8000,
    });

    const textContent = response.choices[0]?.message?.content;
    if (!textContent) {
      throw new Error("No response from AI");
    }

    let itineraryData;
    try {
      let cleanedContent = textContent
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .replace(/\/\/.*$/gm, "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .trim();
      
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");
      
      itineraryData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("Parse error:", parseError);
      console.error("Raw:", textContent.slice(0, 500));
      throw new Error("Failed to parse itinerary");
    }

    return NextResponse.json(itineraryData, {
      headers: {
        "X-RateLimit-Limit": RATE_LIMIT.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
      }
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate itinerary" },
      { status: 500 }
    );
  }
}