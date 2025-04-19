import attachmentProfiles from '@/data/attachmentProfiles.json';
import profileDescriptions from '@/data/profileDescriptions';
import questions from '@/data/questions';

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

    if (q.specialScoring === 'secureBoost') {
      secureScore += reversed;
    }

    if (q.specialScoring === 'anxiousBoost' || q.specialScoring === 'lowScoreAnxiousBoost') {
      if (reversed > maxAnxiousBoost) maxAnxiousBoost = reversed;
    }

    if (q.specialScoring === 'avoidantBoost') {
      if (reversed > maxAvoidantBoost) maxAvoidantBoost = reversed;
    }

    if (q.attachment === 'anxious') anxiousScore += reversed;
    if (q.attachment === 'avoidant') avoidantScore += reversed;
    if (q.attachment === 'secure') secureScore += reversed;
  });

  anxiousScore += maxAnxiousBoost;
  avoidantScore += maxAvoidantBoost;

  const finalScore = secureScore;
  const diff = Math.abs(anxiousScore - avoidantScore);
  const secureIsHighest = secureScore > anxiousScore && secureScore > avoidantScore;
  const overrideToMixed = !secureIsHighest && diff <= 10;

  let profile;
  if (overrideToMixed) {
    profile = attachmentProfiles.find((p) => p.name === 'Anxious or Avoidant');
  } else {
    profile = attachmentProfiles.find(({ range }) => finalScore >= range[0] && finalScore <= range[1]);
  }

  console.log('[Attachment Style Debug]', {
    secureScore,
    anxiousScore,
    avoidantScore,
    maxAnxiousBoost,
    maxAvoidantBoost,
    finalScore,
    overrideToMixed,
    profile: profile?.name
  });

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

export function scoreQuiz(responses = {}, gender = '', trauma = false) {
  let fluency = 0;
  let maturity = 0;
  let bs = 0;
  let attachment = { secure: 0, anxious: 0, avoidant: 0, disorganized: 0 };

  questions.forEach((q) => {
    const val = parseInt(responses[q.id], 10);
    if (isNaN(val)) return;

    let score = q.reverse ? 6 - val : val;

    if (q.gender && ['female', 'non-binary', 'trans female'].includes(gender.toLowerCase())) {
      score += 1;
    }

    if (trauma && q.trauma) {
      score += 1;
    }

    if (q.attachment && attachment[q.attachment] !== undefined) {
      attachment[q.attachment] += score;
    }

    const qNum = parseInt(q.id.replace('Q', ''), 10);
    if (qNum >= 9 && qNum <= 31) fluency += score;
    else if (qNum >= 32 && qNum <= 50) maturity += score;
    else if (qNum >= 51 && qNum <= 65) bs += score;
  });

  const fluencyMax = 23 * 7;
  const maturityMax = 19 * 7;
  const bsMax = 15 * 7;

  const normFluency = (fluency / fluencyMax) * 100;
  const normMaturity = (maturity / maturityMax) * 100;
  const normBS = (bs / bsMax) * 100;

  const total = fluency + maturity + bs;
  const topAttachment = Object.entries(attachment).sort((a, b) => b[1] - a[1])[0][0];

  return {
    fluency: Math.round(normFluency),
    maturity: Math.round(normMaturity),
    bs: Math.round(normBS),
    total,
    attachmentStyle: topAttachment
  };
}

export function matchProfileWithWiggleRoom(fluency, maturity, bs, attachmentScore = 0, total = 0) {
  const scoredMatches = profileDescriptions.profiles.map((p) => {
    const inTotalRange = total >= (p.totalRange?.[0] || 0) && total <= (p.totalRange?.[1] || 1000);

    const categoryMatch = (() => {
      switch (p.categoryRule) {
        case 'EF>RM<BS': return fluency > maturity && bs > maturity;
        case 'EF<RM>BS': return fluency < maturity && bs < maturity;
        case 'EF=RM=BS': return Math.abs(fluency - maturity) <= 10 && Math.abs(maturity - bs) <= 10;
        case 'BS>RM>EF': return bs > maturity && maturity > fluency;
        case 'EF<RM<BS': return fluency < maturity && maturity < bs;
        case 'BS>RM<EF': return bs > maturity && fluency > maturity;
        case 'BS=RM=EF': return fluency === maturity && maturity === bs;
        default: return true;
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
    return getFallbackProfile(total, profileDescriptions.profiles);
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

  console.log('[Profile Match Debug]', {
    bestMatch,
    adjustedFlag,
    topThree,
    attachmentScore
  });

  return {
    profile: bestMatch?.name || 'Mystery Human',
    flag: adjustedFlag,
    topThree: topThree.map((p) => ({ name: p.name, flag: p.flag }))
  };
}

function getFallbackProfile(totalScore, profiles) {
  const fallbackTiers = [
    { min: 299, flag: 'forest green' },
    { min: 289, flag: 'lime green' },
    { min: 260, flag: 'sunshine yellow' },
    { min: 250, flag: 'orange' },
    { min: 200, flag: 'brick red' },
    { min: 150, flag: 'hell boy red' }
  ];
  const tier = fallbackTiers.find(t => totalScore >= t.min);
  if (!tier) {
    return { profile: 'The Soft Void', flag: 'hell boy red', topThree: [] };
  }
  const fallback = profiles.filter(p => p.flag === tier.flag && p.totalRange)
    .sort((a, b) => (a.totalRange[0] || 0) - (b.totalRange[0] || 0))[0];
  if (fallback) {
    return {
      profile: fallback.name,
      flag: fallback.flag,
      topThree: []
    };
  }
  return {
    profile: 'Mystery Human',
    flag: tier.flag,
    topThree: []
  };
}
