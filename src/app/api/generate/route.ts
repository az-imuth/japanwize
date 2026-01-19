import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    const {
      startDate,
      endDate,
      cities,
      travelStyle,
      interests,
      englishLevel,
      additionalNotes,
    } = formData;

    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const prompt = `You are a Japan travel expert. Create a detailed ${days}-day itinerary for a trip to Japan.

TRIP DETAILS:
- Dates: ${startDate} to ${endDate} (${days} days)
- Cities: ${cities.join(", ")}
- Travel Style: ${travelStyle}
- Interests: ${interests.join(", ")}
- English Requirement: ${englishLevel}
${additionalNotes ? `- Additional Notes: ${additionalNotes}` : ""}

REQUIREMENTS:
1. Distribute the days across the selected cities logically
2. For each day, provide:
   - Morning activity (sightseeing spot)
   - Lunch recommendation (specific restaurant with name)
   - Afternoon activity
   - Dinner recommendation (specific restaurant with name)
   - Evening activity (optional, based on interests)

3. For each activity/restaurant, include:
   - Name (real place that exists)
   - Brief description (1-2 sentences)
   - Pro tip that only locals would know
   - Approximate duration
   - Budget indication (Free / ¥ / ¥¥ / ¥¥¥)
   - English support level (Full English / Some English / Japanese only)

4. Consider the travel style:
   - Budget: Focus on free attractions, affordable eats, local spots
   - Mid-range: Balance of popular spots and local gems
   - Luxury: High-end restaurants, exclusive experiences, ryokans

5. Match recommendations to interests. If they like food, emphasize restaurants. If they like nature, include gardens and parks.

6. Consider English requirement when recommending restaurants.

RESPOND IN THIS EXACT JSON FORMAT (no markdown, just pure JSON):
{
  "itinerary": [
    {
      "day": 1,
      "date": "2024-04-01",
      "city": "Tokyo",
      "morning": {
        "name": "Place Name",
        "description": "Brief description",
        "tip": "Local tip",
        "duration": "2 hours",
        "budget": "¥500",
        "englishSupport": "Full English"
      },
      "lunch": {
        "name": "Restaurant Name",
        "description": "Brief description",
        "tip": "What to order",
        "duration": "1 hour",
        "budget": "¥1,500",
        "englishSupport": "Some English"
      },
      "afternoon": { ... },
      "dinner": { ... },
      "evening": { ... }
    }
  ]
}

Generate realistic dates starting from ${startDate}. Only include real places that exist in Japan. Be specific with restaurant and place names.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a Japan travel expert. Always respond with valid JSON only, no markdown formatting.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const textContent = response.choices[0]?.message?.content;
    if (!textContent) {
      throw new Error("No response from AI");
    }

    // Parse JSON from response
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse itinerary JSON");
    }

    const itineraryData = JSON.parse(jsonMatch[0]);

    return NextResponse.json(itineraryData);
  } catch (error) {
    console.error("Error generating itinerary:", error);
    return NextResponse.json(
      { error: "Failed to generate itinerary" },
      { status: 500 }
    );
  }
}