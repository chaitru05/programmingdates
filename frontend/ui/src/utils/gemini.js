/**
 * Gemini API – detailed single-person date plan: where to go, cost per location, nearby places.
 */

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

function buildPrompt(formData) {
  const budget = Math.min(10000, Math.max(500, Number(formData.budget) || 3000));
  const plannerName = (formData.plannerName || '').trim() || 'the planner';
  const partnerName = (formData.partnerName || '').trim() || 'your partner';
  const city = (formData.city || '').trim() || 'the city';
  const dateType = formData.dateType || 'Cozy';
  const indoorOutdoor = formData.indoorOutdoor || 'indoor';
  const surprise = formData.surpriseLevel || 'medium';
  const p = formData.personality || {};
  const personality = [
    p.introvertExtrovert || 'introvert',
    p.calmAdventurous || 'calm',
    p.privateSocial || 'private',
  ].join(', ');

  return `You are an expert romantic date planner in India. Create a detailed, practical, and emotionally thoughtful evening plan in INR (₹) for a couple, where one person is planning the entire date for both.

  User inputs:
  - Planner's Name (for personalization): ${plannerName}
  - Partner's Name: ${partnerName}
  - City: ${city}
  - Total budget: ₹${budget} for the entire evening (for both people)
  - Date type: ${dateType}
  - Setting: ${indoorOutdoor}
  - Surprise / spontaneity level: ${surprise}
  - Partner's personality: ${personality}
  
  Important:
  The plan is being organized by ${plannerName} for ${partnerName}. 
  Make it feel intentional, thoughtful, and slightly surprising (based on surprise level).
  
  The timeline must be dynamically created by you based on:
  - The selected date type
  - The city
  - The indoor/outdoor setting
  - Realistic travel time between locations
  - Sunset timing (if outdoor)
  - Total number of locations included
  
  The timeline must:
  - Start between 5:00 PM and 6:30 PM (choose appropriately)
  - Include 5–7 time slots
  - Mention the exact location name in each time slot
  - Clearly describe what activity happens at that location
  - Flow naturally from one stop to the next
  - End between 10:00 PM and 10:30 PM
  
  Respond with ONLY a valid JSON object (no markdown, no code fence). Use this exact structure:
  
  {
    "romanticTitle": "A creative romantic title for the evening",
    
    "personalMessage": "A warm 3-4 sentence message addressed to ${plannerName}, encouraging them and helping them impress ${partnerName}. Set the emotional tone.",
  
    "locations": [
      {
        "name": "Exact venue/place name",
        "description": "2-3 sentences explaining what they should do here and why it will impress ${partnerName}",
        "estimatedCost": number in INR (for both people),
        "area": "Area or locality in ${city}"
      }
    ],
  
    "nearbyPlaces": [
      "3-5 real or realistic nearby romantic suggestions in ${city}"
    ],
  
    "activities": [
      "4-6 specific romantic activities as strings",
      "Each should match the locations and timeline"
    ],
  
    "budgetBreakdown": {
      "dinner": number in INR,
      "activities": number in INR,
      "travel": number in INR,
      "total": ${budget}
    },
  
    "timeline": [
      { 
        "time": "5:30 PM", 
        "location": "Exact location name from locations array",
        "event": "Detailed description of what ${plannerName} and ${partnerName} will do here"
      }
    ],
  
    "surpriseMoment": "One creative surprise idea tailored to ${partnerName}'s personality and the selected surprise level (${surprise})",
  
    "tips": [
      "3-5 practical tips for ${plannerName} (reservation advice, best table to request, transport advice in ${city})"
    ],
  
    "outfitSuggestion": "Short paragraph suggesting what ${plannerName} should wear for ${dateType} and ${indoorOutdoor} in ${city}",
  
    "backupIdea": "One short romantic backup plan if weather changes or venue is unavailable"
  }
  
  Rules:
  - Every timeline entry MUST reference a location from the locations array.
  - Timeline must logically account for travel time between areas in ${city}.
  - estimatedCost values in locations should sum close to the total budget (leave some for travel).
  - budgetBreakdown.dinner + activities + travel must exactly equal ${budget}.
  - Use real or realistic venues in ${city}.
  - Keep pricing realistic for Indian cities.
  - Make it romantic, practical, and emotionally thoughtful.
  - Do NOT include solo/self-date tone.
  - Respond ONLY with valid JSON.
  - Ensure JSON is valid and parsable.
`;
}

function getTextFromResponse(data) {
  try {
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || null;
  } catch {
    return null;
  }
}

function parsePlanJson(raw) {
  if (!raw || typeof raw !== 'string') return null;
  let str = raw.trim();
  const codeBlock = str.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) str = codeBlock[1].trim();
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

function normalizePlan(parsed, formData) {
  if (!parsed) return null;
  const budget = Math.min(10000, Math.max(500, Number(formData.budget) || 3000));
  const breakdown = parsed.budgetBreakdown || {};
  const total = breakdown.total ?? budget;
  const partnerName = (formData.partnerName || '').trim();

  const locations = Array.isArray(parsed.locations) && parsed.locations.length
    ? parsed.locations.map((loc) => ({
        name: loc.name || 'Spot',
        description: loc.description || '',
        estimatedCost: typeof loc.estimatedCost === 'number' ? loc.estimatedCost : 0,
        area: loc.area || '',
      }))
    : [];

  const rawTimeline = Array.isArray(parsed.timeline) && parsed.timeline.length ? parsed.timeline : [];
  const timeline = rawTimeline.map((t) => ({
    time: t.time || '',
    event: t.event || (t.location ? `At ${t.location}` : ''),
    location: t.location || '',
  }));

  return {
    romanticTitle: parsed.romanticTitle || '',
    personalMessage: parsed.personalMessage || `Hope you and ${partnerName || 'your partner'} have a wonderful evening!`,
    locations,
    nearbyPlaces: Array.isArray(parsed.nearbyPlaces) ? parsed.nearbyPlaces : [],
    activities: Array.isArray(parsed.activities) ? parsed.activities : ['Dinner', 'Explore the area'],
    budgetBreakdown: {
      dinner: typeof breakdown.dinner === 'number' ? breakdown.dinner : Math.round(total * 0.45),
      activities: typeof breakdown.activities === 'number' ? breakdown.activities : Math.round(total * 0.35),
      travel: typeof breakdown.travel === 'number' ? breakdown.travel : Math.round(total * 0.2),
      total,
    },
    timeline: timeline.length
      ? timeline
      : [
          { time: '6:00 PM', event: 'Head to first spot', location: '' },
          { time: '7:00 PM', event: 'Dinner', location: '' },
          { time: '8:30 PM', event: 'Activity', location: '' },
          { time: '9:30 PM', event: 'Wind down', location: '' },
        ],
    surpriseMoment: parsed.surpriseMoment || '',
    tips: Array.isArray(parsed.tips) ? parsed.tips : [],
    outfitSuggestion: parsed.outfitSuggestion || '',
    backupIdea: parsed.backupIdea || '',
  };
}

export async function generateDatePlanWithGemini(formData, apiKey) {
  if (!apiKey?.trim()) return null;
  const url = `${GEMINI_URL}?key=${encodeURIComponent(apiKey.trim())}`;
  const body = {
    contents: [{ parts: [{ text: buildPrompt(formData) }] }],
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 4096,
      responseMimeType: 'application/json',
    },
  };
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error('Gemini API error', res.status, errText);
      return null;
    }
    const data = await res.json();
    const text = getTextFromResponse(data);
    const parsed = parsePlanJson(text);
    return normalizePlan(parsed, formData);
  } catch (err) {
    console.error('Gemini request failed', err);
    return null;
  }
}
