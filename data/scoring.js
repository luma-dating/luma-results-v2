import attachmentProfiles from '@/data/attachmentProfiles.json';
import { profiles, flagDescriptions } from '@/data/profileDescriptions';
import questions from '@/data/questions';

export function calculateAttachmentStyle(responses = {}) {
  let secureScore = 0;
  let anxiousScore = 0;
  let avoidantScore = 0;

  questions.flat().forEach((q) => {
    const raw = responses[q.id];
    if (typeof raw !== 'number') return;

    const reversed = q.reverse ? 8 - raw : raw;

    if (q.attachment === 'secure') {
      secureScore += reversed;
    }

    if (q.attachment === 'anxious') {
      anxiousScore += raw; // True score
      secureScore -= raw;  // Subtract from secure
    }

    if (q.attachment === 'avoidant') {
      avoidantScore += raw; // True score
      secureScore -= raw;  // Subtract from secure
    }
  });

  const finalScore = Math.max(0, secureScore); // clamp to 0

  let profile;
  if (finalScore >= 160) {
    profile = attachmentProfiles.find((p) => p.name === 'Secure');
  } else if (finalScore >= 129) {
    profile = attachmentProfiles.find((p) => p.name === 'Anxious-Leaning Secure');
  } else if (finalScore >= 98) {
    profile = attachmentProfiles.find((p) => p.name === 'Anxious or Avoidant');
  } else {
    profile = attachmentProfiles.find((p) => p.name === 'Disorganized');
  }

  console.log('[Attachment Style Debug]', {
    secureScore,
    anxiousScore,
    avoidantScore,
    finalScore,
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

  questions.forEach((q) => {
    const val = parseInt(responses[q.id], 10);
    if (isNaN(val)) return;

    const score = q.reverse ? 8 - val : val;

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

  return {
    fluency: Math.round(normFluency),
    maturity: Math.round(normMaturity),
    bs: Math.round(normBS),
    raw: {
      fluency,
      maturity,
      bs
    },
    total
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

  if (attachmentScore >= 160 && bestMatch.matchScore >= 2) {
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
    { min: 310, flag: 'forest green' },
    { min: 285, flag: 'lime green' },
    { min: 255, flag: 'sunshine yellow' },
    { min: 230, flag: 'lemon yellow' },
    { min: 205, flag: 'orange' },
    { min: 185, flag: 'brick red' },
    { min: 0, flag: 'hell boy red' }
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
