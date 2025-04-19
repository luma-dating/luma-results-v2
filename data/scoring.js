// data/scoring.js

import attachmentProfiles from '@/data/attachmentProfiles';
import rawDescriptions from '@/data/profileDescriptions';
import questions from '@/data/questions';

export function calculateAttachmentStyle(responses = {}) {
  let scores = {
    secure: 0,
    anxious: 0,
    avoidant: 0,
  };

  let maxAnxiousBoost = 0;
  let maxAvoidantBoost = 0;

  questions.flat().forEach((q) => {
    const raw = responses[q.id];
    if (typeof raw !== 'number') return;

    const reversed = q.reverse ? 8 - raw : raw;

    // Direct style assignments
    if (q.attachment === 'secure') scores.secure += reversed;
    if (q.attachment === 'anxious') scores.anxious += reversed;
    if (q.attachment === 'avoidant') scores.avoidant += reversed;

    // Boost logic
    if (q.specialScoring === 'anxiousBoost' || q.specialScoring === 'lowScoreAnxiousBoost') {
      if (reversed > maxAnxiousBoost) maxAnxiousBoost = reversed;
    }
    if (q.specialScoring === 'avoidantBoost') {
      if (reversed > maxAvoidantBoost) maxAvoidantBoost = reversed;
    }
    if (q.specialScoring === 'secureBoost') {
      scores.secure += reversed;
    }
  });

  // Apply max boosts
  scores.anxious += maxAnxiousBoost;
  scores.avoidant += maxAvoidantBoost;

  // Get final values
  const finalSecure = scores.secure;
  const finalAnxious = scores.anxious;
  const finalAvoidant = scores.avoidant;

  // Decide attachment type
  let chosenStyle = null;

  const diff = Math.abs(finalAnxious - finalAvoidant);
  if (diff <= 4 && finalSecure < 30) {
    chosenStyle = 'Anxious or Avoidant';
  } else {
    const highest = Math.max(finalSecure, finalAnxious, finalAvoidant);
    if (highest === finalSecure && finalSecure >= 30) {
      chosenStyle = 'Secure';
    } else if (highest === finalAnxious) {
      chosenStyle = finalSecure >= 24 ? 'Anxious-Leaning Secure' : 'Anxious or Avoidant';
    } else if (highest === finalAvoidant) {
      chosenStyle = finalSecure >= 24 ? 'Avoidant-Leaning Secure' : 'Anxious or Avoidant';
    }
  }

  // Fallback if no style determined
  if (!chosenStyle) chosenStyle = 'Disorganized';

  const profileData = attachmentProfiles.find((p) => p.name === chosenStyle);

  return {
    name: chosenStyle,
    scoreSummary: scores,
    ...profileData,
  };
}


// 🧩 Profile Matching
export function matchProfileWithWiggleRoom(fluency, maturity, bs, attachmentScore = 0, total = 0) {
  const scoredMatches = profileDescriptions.profiles.map((p) => {
    const inTotalRange = total >= (p.totalRange?.[0] || 0) && total <= (p.totalRange?.[1] || 1000);

    const categoryMatch = (() => {
      switch (p.categoryRule) {
        case 'EF>RM<BS':
          return fluency > maturity && bs > maturity;
        case 'EF<RM>BS':
          return fluency < maturity && bs < maturity;
        case 'EF=RM=BS':
          return (
            Math.abs(fluency - maturity) <= 10 &&
            Math.abs(maturity - bs) <= 10
          );
        case 'BS>RM>EF':
          return bs > maturity && maturity > fluency;
        case 'EF<RM<BS':
          return fluency < maturity && maturity < bs;
        case 'BS>RM<EF':
          return bs > maturity && fluency > maturity;
        case 'BS=RM=EF':
          return fluency === maturity && maturity === bs;
        default:
          return true;
      }
    })();

    let matchScore = 0;
    if (inTotalRange) matchScore += 1;
    if (categoryMatch) matchScore += 2;

    return { ...p, matchScore };
  });

  const sortedMatches = scoredMatches.sort((a, b) => b.matchScore - a.matchScore);
  const topThree = sortedMatches.slice(0, 3);
  const bestMatch = topThree[0];

  if (!bestMatch || bestMatch.matchScore < 2) {
    return {
      profile: 'Mystery Human',
      flag: 'gray',
      topThree: []
    };
  }

  let adjustedFlag = bestMatch.flag;

  if (total >= 350) adjustedFlag = 'forest green';

  if (attachmentScore >= 23 && bestMatch.matchScore >= 2) {
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
