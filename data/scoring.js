// lib/scoring.js

import attachmentProfiles from '@/data/attachmentProfiles';
import rawDescriptions from '@/data/profileDescriptions';

const profileDescriptions = typeof rawDescriptions?.default === 'object'
  ? rawDescriptions.default
  : rawDescriptions;

export function calculateAttachmentStyle(qs = []) {
  if (!Array.isArray(qs) || qs.length !== 6) return null;

  const total = qs.reduce((sum, val) => sum + (parseInt(val, 10) || 0), 0);

  return attachmentProfiles.find(({ range }) => total >= range[0] && total <= range[1]) || null;
}

// Fallback logic moved OUTSIDE where it belongs
function getFallbackProfile(totalScore, profiles) {
  const fallbackTiers = [
    { min: 325, flag: 'forest green' },
    { min: 300, flag: 'lime green' },
    { min: 275, flag: 'sunshine yellow' },
    { min: 250, flag: 'orange' },
    { min: 200, flag: 'brick red' },
    { min: 150, flag: 'hell boy red' }
  ];

  const tier = fallbackTiers.find(t => totalScore >= t.min);

  if (!tier) {
    return {
      profile: 'Emotional Arsonist',
      flag: 'hell boy red',
      topThree: []
    };
  }

  const fallback = profiles
    .filter(p => p.flag === tier.flag && p.totalRange)
    .sort((a, b) => (a.totalRange[0] || 0) - (b.totalRange[0] || 0))[0];

  if (fallback) {
    return {
      profile: fallback.name,
      flag: fallback.flag,
      topThree: []
    };
  }

  return {
    profile: 'Emotional Arsonist',
    flag: 'hell boy red',
    topThree: []
  };
}

export function matchProfileWithWiggleRoom(fluency, maturity, bs, attachmentScore = 0, total = 0) {
  const scoredMatches = profileDescriptions.profiles.map((p) => {
    const target = p.target || {};

    const diff = [
      Math.abs(fluency - target.fluency),
      Math.abs(maturity - target.maturity),
      Math.abs(bs - target.bs)
    ];

    const avgDiff = diff.reduce((a, b) => a + b, 0) / 3;
    const gteMatch = p.useGTE
      ? fluency >= target.fluency && maturity >= target.maturity && bs >= target.bs
      : true;

    return { ...p, avgDiff, gteMatch };
  });

  const sortedMatches = scoredMatches
    .filter((p) => p.gteMatch)
    .sort((a, b) => a.avgDiff - b.avgDiff);

  const topThree = sortedMatches.slice(0, 3);
  const bestMatch = topThree[0];

  if (!bestMatch) {
    return getFallbackProfile(total, profileDescriptions.profiles);
  }

  let adjustedFlag = bestMatch.flag;

  // 🌿 Absolute override
  if (fluency >= 95 && maturity >= 105 && bs >= 135) {
    adjustedFlag = 'forest green';
  }

  // 🍋 Downgrade logic
  if (bestMatch.avgDiff >= 3) {
    const flagShift = {
      'forest green': 'lime green',
      'lime green': 'sunshine yellow',
      'sunshine yellow': 'lemon yellow',
      'lemon yellow': 'orange',
      'orange': 'brick red',
      'brick red': 'hell boy red'
    };
    adjustedFlag = flagShift[adjustedFlag] || adjustedFlag;
  }

  // 🪄 Upgrade boost
  if (attachmentScore >= 23 && bestMatch.avgDiff <= 5) {
    const flagBoost = {
      'hell boy red': 'brick red',
      'brick red': 'orange',
      'orange': 'lemon yellow',
      'lemon yellow': 'sunshine yellow',
      'sunshine yellow': 'lime green',
      'lime green': 'forest green'
    };
    adjustedFlag = flagBoost[adjustedFlag] || adjustedFlag;
  }

  return {
    profile: bestMatch.name,
    flag: adjustedFlag,
    topThree: topThree.map((p) => ({ name: p.name, flag: p.flag }))
  };
}
