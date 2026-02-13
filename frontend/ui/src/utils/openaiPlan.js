/**
 * Gemini integration for dual-input date plan.
 * Uses gemini-flash-latest, key from VITE_GEMINI_API_KEY.
 */

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

function buildPrompt(mergedData, compatibilityData) {
  const { person1Name, person2Name, budget, dateType, indoorOutdoor, surpriseLevel } = mergedData;
  const { percentage, coupleType } = compatibilityData;

  return `You are a romantic date planner. Create a detailed date plan in India (currency INR ₹).

Inputs:
- Person 1 name: ${person1Name}
- Person 2 name: ${person2Name}
- Compatibility: ${percentage}% (Couple type: ${coupleType})
- Total budget: ₹${budget} for the evening (for both)
- Date type: ${dateType}
- Setting: ${indoorOutdoor}
- Surprise level: ${surpriseLevel}

Respond with ONLY valid JSON (no markdown, no code block). Use this exact structure:

{
  "romanticTitle": "A short creative title for the evening",
  "venueType": "One sentence describing the ideal venue type",
  "activities": ["First detailed activity", "Second detailed activity", "Third detailed activity"],
  "budgetBreakdown": {
    "dinner": number in INR,
    "activities": number in INR,
    "travel": number in INR,
    "total": ${budget}
  },
  "timeline": [
    { "time": "6:00 PM", "event": "What they do" },
    { "time": "7:00 PM", "event": "..." }
  ],
  "personalMessage": "A warm 2-3 sentence message for ${person1Name} and ${person2Name}, personalized to their compatibility",
  "surpriseIdea": "One creative surprise idea for the date"
}

Rules:
- budgetBreakdown.dinner + activities + travel must equal ${budget}.
- Timeline should span 6 PM to 10 PM with 4-6 slots.
- Be specific and romantic. Use Indian context.`;
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

/**
 * @param {Object} mergedData - from mergePreferences
 * @param {{ percentage: number, coupleType: string }} compatibilityData
 * @returns {Promise<{ plan: Object|null, error?: string, message?: string }>}
 */
export async function generateAIPlan(mergedData, compatibilityData) {
  const apiKey = typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY;
  const key = typeof apiKey === 'string' ? apiKey.trim() : '';
  if (!key) {
    return { plan: null, error: 'MISSING_KEY' };
  }

  try {
    const url = `${GEMINI_URL}?key=${encodeURIComponent(key)}`;
    const body = {
      contents: [{ parts: [{ text: buildPrompt(mergedData, compatibilityData) }] }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 4096,
        responseMimeType: 'application/json',
      },
    };
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error('Gemini API error', res.status, errText);
      return {
        plan: null,
        error: 'API_ERROR',
        message: `Gemini API error: ${res.status}`,
      };
    }
    const data = await res.json();
    const text = getTextFromResponse(data);
    const parsed = parsePlanJson(text);
    if (!parsed) {
      return { plan: null, error: 'API_ERROR', message: 'Could not parse response from Gemini' };
    }
    return {
      plan: {
        romanticTitle: parsed.romanticTitle || '',
        personalMessage: parsed.personalMessage || '',
        venueType: parsed.venueType || '',
        activities: Array.isArray(parsed.activities) ? parsed.activities : [],
        budgetBreakdown: parsed.budgetBreakdown || {},
        timeline: Array.isArray(parsed.timeline) ? parsed.timeline : [],
        surpriseMoment: parsed.surpriseIdea || '',
      },
    };
  } catch (err) {
    console.error('Gemini plan failed', err);
    return {
      plan: null,
      error: 'API_ERROR',
      message: err?.message || String(err),
    };
  }
}
