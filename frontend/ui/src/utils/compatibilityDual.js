/**
 * Dual-input compatibility and conflict resolution.
 * Person shape: { name, personality, energy, vibe, budgetComfort, preferredDateType, indoorOutdoor, surpriseLevel }
 */

const SURPRISE_ORDER = { low: 0, medium: 1, high: 2 };

/**
 * @param {Object} person1
 * @param {Object} person2
 * @returns {{ percentage: number, coupleType: string }}
 */
export function calculateCompatibility(person1, person2) {
  let score = 0;
  const max = 8;

  if ((person1.personality || '') === (person2.personality || '')) score += 2;
  if ((person1.energy || '') === (person2.energy || '')) score += 2;
  if ((person1.vibe || '') === (person2.vibe || '')) score += 1;
  if (Math.abs((person1.budgetComfort || 0) - (person2.budgetComfort || 0)) < 2000) score += 1;
  if ((person1.preferredDateType || '') === (person2.preferredDateType || '')) score += 2;

  const percentage = Math.round(Math.min(100, Math.max(0, (score / max) * 100)));
  let coupleType = 'Opposites Attract';
  if (percentage >= 80) coupleType = 'Power Couple';
  else if (percentage >= 60) coupleType = 'Balanced Romantics';

  return { percentage, coupleType };
}

/**
 * @param {Object} person1
 * @param {Object} person2
 * @param {number} compatibilityPercentage
 * @returns {Object} merged preferences for plan
 */
export function mergePreferences(person1, person2, compatibilityPercentage) {
  const b1 = Number(person1.budgetComfort) || 3000;
  const b2 = Number(person2.budgetComfort) || 3000;
  const budget = Math.round((b1 + b2) / 2);
  const budgetClamped = Math.min(10000, Math.max(500, budget));

  const indoor1 = (person1.indoorOutdoor || 'indoor') === 'indoor';
  const indoor2 = (person2.indoorOutdoor || 'indoor') === 'indoor';
  const indoorOutdoor = indoor1 === indoor2 ? (indoor1 ? 'indoor' : 'outdoor') : 'hybrid';

  const calm1 = (person1.energy || 'calm') === 'calm';
  const calm2 = (person2.energy || 'calm') === 'calm';
  const energyStyle = calm1 === calm2 ? (calm1 ? 'calm' : 'adventurous') : 'balanced';

  const type1 = person1.preferredDateType || 'Cozy';
  const type2 = person2.preferredDateType || 'Cozy';
  const dateType = type1 === type2 ? type1 : (compatibilityPercentage >= 60 ? type1 : type2);

  const s1 = SURPRISE_ORDER[(person1.surpriseLevel || 'medium').toLowerCase()] ?? 1;
  const s2 = SURPRISE_ORDER[(person2.surpriseLevel || 'medium').toLowerCase()] ?? 1;
  const surpriseLevel = s1 >= s2 ? (person1.surpriseLevel || 'medium') : (person2.surpriseLevel || 'medium');

  return {
    budget: budgetClamped,
    dateType,
    indoorOutdoor,
    energyStyle,
    surpriseLevel,
    person1Name: (person1.name || '').trim() || 'Person 1',
    person2Name: (person2.name || '').trim() || 'Person 2',
  };
}
