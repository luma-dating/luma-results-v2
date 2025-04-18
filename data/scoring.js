// data/scoring.js

import attachmentProfiles from '@/data/attachmentProfiles';
import rawDescriptions from '@/data/profileDescriptions';
import questions from '@/data/questions';

const profileDescriptions = typeof rawDescriptions?.default === 'object'
  ? rawDescriptions.default
  : rawDescriptions;

// 🧠 Attachment Scoring
export function calculateAttachmentStyle(responses = {}) {
  let secureScore = 0;
  let anxiousScore = 0;
  let avoidantScore = 0;

  let maxAnxiousBoost = 0;
  let maxAvoidantBoost = 0;

  questions.flat().forEach((q) => {
    const raw = responses[q.id];
    if (typeof raw !== 'number') return;

    const reversed = q.reverse ? 8 - raw : raw;

    // Secure scoring
    if (q.specialScoring === 'secureBoost') {
      secureScore += reversed;
    }

    // Special boost logic: record *max* value for anxious/avoidant
    if (q.specialScoring === 'anxiousBoost' || q.specialScoring === 'lowScoreAnxiousBoost') {
      if (reversed > maxAnxiousBoost) maxAnxiousBoost = reversed;
    }

    if (q.specialScoring === 'avoidantBoost') {
      if (reversed > maxAvoidantBoost) maxAvoidantBoost = reversed;
    }

    // Generic attachment scoring
    if (q.attachment === 'anxious') anxiousScore += reversed;
    if (q.attachment === 'avoidant') avoidantScore += reversed;
    if (q.attachment === 'secure') secureScore += reversed;
    // optional: disorganized logic
  });

  // Boosts added
  anxiousScore += maxAnxiousBoost;
  avoidantScore += maxAvoidantBoost;

  const finalScore = secureScore - (anxiousScore + avoidantScore);

  const diff = Math.abs(anxiousScore - avoidantScore);
  const overrideToMixed = diff <= 10;

  let profile = attachmentProfiles.find(({ range }) =>
    finalScore >= range[0] && finalScore <= range[1]
  );

  if (overrideToMixed) {
    profile = attachmentProfiles.find((p) => p.name === 'Anxious or Avoidant');
  }

  return {
    style: profile?.name || 'Unknown',
    score: finalScore,
    anxious: anxiousScore,
    avoidant: avoidantScore,
    secure: secureScore,
    tagline: profile?.tagline || '',
    description: profile?.description || ''
  };
}

// 🧮 Main Quiz Score
export function scoreQuiz(responses = {}, gender = '', trauma = false) {
  let fluency = 0;
  let maturity = 0;
  let bs = 0;

  const attachment = {
    secure: 0,
    anxious: 0,
    avoidant: 0,
    disorganized: 0
  };

  questions.flat().forEach((q) => {
    const val = parseInt(responses[q.id], 10);
    if (isNaN(val)) return;

    let score = q.reverse ? 6 - val : val;

    if (q.gender && ['female', 'non-binary', 'trans female'].includes(gender.toLowerCase())) {
      score += 1;
    }

    if (trauma && q.trauma) {
      score += 1;
    }

    switch (q.specialScoring) {
      case 'midRangePenalty':
        if (val >= 3 && val <= 4) bs -= 1;
        break;
      case 'anxiousTrigger':
        attachment.anxious += score <= 2 ? 1 : 0;
        break;
      case 'lowScoreAnxiousBoost':
        if (score <= 3) attachment.anxious += 1;
        break;
      case 'avoidantPenalty':
        if (score <= 2) attachment.avoidant += 2;
        break;
      case 'secureBoost':
        if (score >= 5) attachment.secure += 1;
        break;
      case 'disorganizedSignal':
        if (score >= 5) attachment.disorganized += 2;
        break;
      default:
        break;
    }

    if (q.attachment && attachment[q.attachment] !== undefined) {
      attachment[q.attachment] += score;
    }

    const qNum = parseInt(q.id.replace('Q', ''), 10);
    if (qNum >= 9 && qNum <= 31) fluency += score;
    else if (qNum >= 32 && qNum <= 50) maturity += score;
    else if (qNum >= 51 && qNum <= 65) bs += score;
  });

  const total = fluency + maturity + bs;
  const topAttachment = Object.entries(attachment).sort((a, b) => b[1] - a[1])[0][0];

  return { fluency, maturity, bs, total, attachmentStyle: topAttachment };
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
