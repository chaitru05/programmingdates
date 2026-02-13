/**
 * Compatibility Mood Engine – Rule-based AI
 * Assigns scores from personality choices and returns a romantic type.
 */

/**
 * @param {Object} formData - Form state with personality and preferences
 * @returns {{ type: string, score: number }} Romantic type and compatibility score
 */
export function calculateCompatibility(formData) {
  let score = 50; // Base score

  // Introvert (+calm) => Cozy; Extrovert (+adventurous) => Adventurous; mix => Balanced
  const isIntrovert = formData.personality?.introvertExtrovert === 'introvert';
  const isExtrovert = formData.personality?.introvertExtrovert === 'extrovert';
  const isCalm = formData.personality?.calmAdventurous === 'calm';
  const isAdventurous = formData.personality?.calmAdventurous === 'adventurous';
  const isPrivate = formData.personality?.privateSocial === 'private';
  const isSocial = formData.personality?.privateSocial === 'social';

  if (isIntrovert) score += 5;
  if (isExtrovert) score += 8;
  if (isCalm) score += 6;
  if (isAdventurous) score += 10;
  if (isPrivate) score += 4;
  if (isSocial) score += 7;

  // Surprise level influence
  const surprise = formData.surpriseLevel || 'medium';
  if (surprise === 'high') score += 12;
  else if (surprise === 'medium') score += 6;
  else score += 2;

  // Date type influence
  const dateType = (formData.dateType || '').toLowerCase();
  if (dateType === 'cozy') score += 8;
  else if (dateType === 'luxury') score += 10;
  else if (dateType === 'nature') score += 7;
  else if (dateType === 'fun') score += 9;
  else if (dateType === 'movie night') score += 5;

  score = Math.min(100, Math.max(0, score));

  // Determine romantic type
  const cozyScore = (isIntrovert ? 2 : 0) + (isCalm ? 2 : 0) + (isPrivate ? 1 : 0) + (dateType === 'cozy' ? 3 : 0);
  const adventureScore = (isExtrovert ? 2 : 0) + (isAdventurous ? 2 : 0) + (isSocial ? 1 : 0) + (dateType === 'nature' || dateType === 'fun' ? 2 : 0);

  let type = 'Balanced Lovers';
  if (cozyScore > adventureScore + 2) type = 'Cozy Dreamers';
  else if (adventureScore > cozyScore + 2) type = 'Adventurous Romantics';

  return { type, score };
}
