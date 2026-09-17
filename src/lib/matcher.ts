import { Item, MatchScoreResult } from '@/types';

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'is', 'it', 'my', 'has', 'was', 'are', 'this', 'that', 'near',
  'lost', 'found', 'room', 'floor', 'desk', 'campus', 'item', 'student', 'hall',
]);

function extractTokens(text: string): Set<string> {
  const clean = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
  return new Set(clean);
}

export function computeItemMatch(itemA: Item, itemB: Item): MatchScoreResult {
  // Only compare Lost with Found (or vice versa)
  if (itemA.type === itemB.type) {
    return {
      candidateItem: itemB,
      score: 0,
      breakdown: {
        categoryMatch: false,
        tokenSimilarity: 0,
        locationMatch: false,
        dateProximityDays: 999,
      },
      reasons: [],
    };
  }

  let score = 0;
  const reasons: string[] = [];

  // 1. Category match (Weight: 35%)
  const categoryMatch = itemA.category === itemB.category;
  if (categoryMatch) {
    score += 35;
    reasons.push(`Matching category (${itemA.category.replace('_', ' ')})`);
  }

  // 2. Token overlap (Weight: 35%)
  const textA = `${itemA.title} ${itemA.description}`;
  const textB = `${itemB.title} ${itemB.description}`;
  const tokensA = extractTokens(textA);
  const tokensB = extractTokens(textB);

  const intersection: string[] = [];
  tokensA.forEach((token) => {
    if (tokensB.has(token)) {
      intersection.push(token);
    }
  });

  const unionSize = new Set([...Array.from(tokensA), ...Array.from(tokensB)]).size;
  const tokenSimilarity = unionSize > 0 ? intersection.length / unionSize : 0;
  const tokenScore = Math.min(35, Math.round(tokenSimilarity * 80)); // boost overlap
  score += tokenScore;

  if (intersection.length > 0) {
    const matchedWords = intersection.slice(0, 3).join(', ');
    reasons.push(`Shared keywords: "${matchedWords}"`);
  }

  // 3. Location match (Weight: 15%)
  const locationMatch = itemA.location.toLowerCase().trim() === itemB.location.toLowerCase().trim();
  if (locationMatch) {
    score += 15;
    reasons.push(`Same campus building (${itemA.location})`);
  } else if (
    itemA.locationDetails &&
    itemB.locationDetails &&
    (itemA.locationDetails.toLowerCase().includes(itemB.location.toLowerCase()) ||
      itemB.locationDetails.toLowerCase().includes(itemA.location.toLowerCase()))
  ) {
    score += 8;
    reasons.push('Proximity in location notes');
  }

  // 4. Date proximity (Weight: 15%)
  const dateA = new Date(itemA.date).getTime();
  const dateB = new Date(itemB.date).getTime();
  const diffDays = Math.abs(dateA - dateB) / (1000 * 60 * 60 * 24);

  if (diffDays <= 1) {
    score += 15;
    reasons.push('Reported within 24 hours of each other');
  } else if (diffDays <= 3) {
    score += 10;
    reasons.push(`Reported within ${Math.round(diffDays)} days`);
  } else if (diffDays <= 7) {
    score += 5;
    reasons.push('Reported within the same week');
  }

  const finalScore = Math.min(100, Math.max(0, score));

  return {
    candidateItem: itemB,
    score: finalScore,
    breakdown: {
      categoryMatch,
      tokenSimilarity,
      locationMatch,
      dateProximityDays: Math.round(diffDays),
    },
    reasons,
  };
}

export function getSmartMatchesForItem(
  targetItem: Item,
  allCandidates: Item[],
  minThreshold = 45
): MatchScoreResult[] {
  const oppositePool = allCandidates.filter(
    (item) => item.id !== targetItem.id && item.type !== targetItem.type && item.status !== 'returned'
  );

  const results: MatchScoreResult[] = [];

  oppositePool.forEach((candidate) => {
    const match = computeItemMatch(targetItem, candidate);
    if (match.score >= minThreshold) {
      results.push(match);
    }
  });

  return results.sort((a, b) => b.score - a.score);
}

export interface GlobalMatchPair {
  lostItem: Item;
  foundItem: Item;
  result: MatchScoreResult;
}

export function getHighConfidencePairs(items: Item[], minScore = 65): GlobalMatchPair[] {
  const lostItems = items.filter((i) => i.type === 'lost' && i.status === 'active');
  const foundItems = items.filter((i) => i.type === 'found' && i.status === 'active');

  const pairs: GlobalMatchPair[] = [];
  const pairedFoundIds = new Set<string>();

  lostItems.forEach((lost) => {
    let highestMatch: MatchScoreResult | null = null;

    foundItems.forEach((found) => {
      if (pairedFoundIds.has(found.id)) return;
      const match = computeItemMatch(lost, found);
      if (match.score >= minScore) {
        if (!highestMatch || match.score > highestMatch.score) {
          highestMatch = match;
        }
      }
    });

    if (highestMatch) {
      const matchResult = highestMatch as MatchScoreResult;
      pairedFoundIds.add(matchResult.candidateItem.id);
      pairs.push({
        lostItem: lost,
        foundItem: matchResult.candidateItem,
        result: matchResult,
      });
    }
  });

  return pairs;
}
