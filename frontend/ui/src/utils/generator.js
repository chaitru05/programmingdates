/**
 * Smart Date Generator – Fallback rule-based plan for single person (no compatibility).
 */

const BUDGET_MIN = 500;
const BUDGET_MAX = 10000;

function allocateBudget(total) {
  const dinner = Math.round(total * 0.45);
  const activities = Math.round(total * 0.35);
  const travel = Math.round(total * 0.2);
  return { dinner, activities, travel, total };
}

function getVenueAndActivities(formData) {
  const dateType = (formData.dateType || 'Cozy').toLowerCase();
  const indoor = formData.indoorOutdoor !== 'outdoor';
  const budget = formData.budget || 3000;
  const isHighBudget = budget >= 5000;

  let venueType = 'Cafe';
  let activities = ['Grab a drink or snack', 'Relax and unwind', 'Take a short walk'];

  if (dateType === 'cozy') {
    venueType = indoor ? 'Cozy café or book café' : 'Garden café';
    activities = indoor ? ['Read or people-watch', 'Dessert', 'Quiet time'] : ['Stroll', 'Hot chocolate', 'Sunset'];
  } else if (dateType === 'luxury') {
    venueType = isHighBudget ? 'Fine-dining restaurant' : 'Upscale bistro';
    activities = ['Multi-course dinner', 'Dessert & coffee', 'Evening stroll'];
  } else if (dateType === 'nature') {
    venueType = indoor ? 'Greenhouse café' : 'Park or botanical garden';
    activities = indoor ? ['Walk among plants', 'Light snacks'] : ['Nature walk', 'Sunset'];
  } else if (dateType === 'fun') {
    venueType = indoor ? 'Bowling / arcade' : 'Outdoor games';
    activities = indoor ? ['Bowling or arcade', 'Snacks'] : ['Outdoor games', 'Street food'];
  } else if (dateType === 'movie night') {
    venueType = indoor ? 'Home' : 'Drive-in or outdoor cinema';
    activities = indoor ? ['Pick a movie', 'Snacks'] : ['Outdoor screen', 'Stargazing'];
  }
  return { venueType, activities };
}

function getTimeline(formData) {
  const dateType = (formData.dateType || 'Cozy').toLowerCase();
  if (dateType === 'movie night') {
    return [
      { time: '6:00 PM', event: 'Pick movie & snacks' },
      { time: '7:00 PM', event: 'Movie time' },
      { time: '9:00 PM', event: 'Wind down' },
    ];
  }
  return [
    { time: '6:00 PM', event: 'Head to first spot' },
    { time: '7:00 PM', event: 'Dinner' },
    { time: '8:30 PM', event: 'Activity' },
    { time: '9:30 PM', event: 'Wind down' },
  ];
}

/**
 * Fallback plan for single person (no compatibility). Same shape as Gemini for ResultCard.
 */
export function generateDatePlan(formData) {
  const budget = Math.min(BUDGET_MAX, Math.max(BUDGET_MIN, Number(formData.budget) || 3000));
  const breakdown = allocateBudget(budget);
  const { venueType, activities } = getVenueAndActivities(formData);
  const timeline = getTimeline(formData);
  const plannerName = (formData.plannerName || '').trim();
  const partnerName = (formData.partnerName || '').trim();
  const personalMessage = plannerName && partnerName
    ? `${plannerName}, hope you and ${partnerName} have a wonderful evening!`
    : 'Hope you have a wonderful evening!';

  return {
    romanticTitle: '',
    personalMessage,
    venueType,
    locations: [
      { name: venueType, description: 'Main stop for your evening.', estimatedCost: breakdown.dinner + breakdown.activities, area: (formData.city || '').trim() || 'Your city' },
    ],
    nearbyPlaces: [],
    activities,
    budgetBreakdown: breakdown,
    timeline: (timeline || []).map((t) => ({ ...t, location: t.location || '' })),
    surpriseMoment: '',
    tips: ['Carry cash/card', 'Check opening hours', 'Dress for the vibe'],
    outfitSuggestion: '',
    backupIdea: 'Have a backup café or spot in mind in case the first is full.',
  };
}

/**
 * Generate plan using Gemini API when key is set; otherwise fallback to rule-based.
 * @param {Object} formData - Full form state
 * @returns {Promise<Object>} Date plan (detailed if from Gemini)
 */
export async function generateDatePlanAsync(formData) {
  const apiKey = typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY;
  if (apiKey) {
    const { generateDatePlanWithGemini } = await import('./gemini.js');
    try {
      const geminiPlan = await generateDatePlanWithGemini(formData, apiKey);
      if (geminiPlan) return geminiPlan;
    } catch (_) {
      // fall through to rule-based
    }
  }
  return generateDatePlan(formData);
}

/** 10 romantic surprise ideas – one picked at random */
export const ROMANTIC_SURPRISES = [
  'Leave a handwritten note under their plate before dinner.',
  'Request their favourite song when you reach the venue.',
  'Bring a single rose and give it at the perfect moment.',
  'Plan a small dessert surprise (their favourite) after the main course.',
  'Take a cute couple selfie and set it as your wallpaper together.',
  'Whisper three things you love about them during the romantic moment.',
  'Stargaze for 10 minutes and make a wish together.',
  'Dedicate a toast to your favourite memory as a couple.',
  'End the night with a slow dance, even if it’s just for one song.',
  'Give them a small wrapped gift (keychain/photo) at the end of the date.',
];

/**
 * @returns {string} One random surprise from ROMANTIC_SURPRISES
 */
export function getRandomSurprise() {
  return ROMANTIC_SURPRISES[Math.floor(Math.random() * ROMANTIC_SURPRISES.length)];
}
