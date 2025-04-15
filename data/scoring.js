
import attachmentProfiles from '@/data/attachmentProfiles';
import profileDescriptions from '@/data/profileDescriptions';

export function calculateAttachmentStyle(qs = []) {
  if (!Array.isArray(qs) || qs.length !== 6) return null;

  const total = qs.reduce((sum, val) => sum + (parseInt(val, 10) || 0), 0);

  return attachmentProfiles.find(({ range }) => total >= range[0] && total <= range[1]) || null;
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
    .filter((p) => p.gteMatch && p.avgDiff < 10)
    .sort((a, b) => a.avgDiff - b.avgDiff);

  const topThree = sortedMatches.slice(0, 3);
  const bestMatch = topThree[0];

  if (!bestMatch) {
    if (fluency >= 85 && maturity >= 100 && total >= 310) {
      return {
        profile: 'Unicorn',
        flag: 'forest green',
        topThree: []
      };
    }
    return {
      profile: 'Stop Sign',
      flag: 'brick red',
      topThree: []
    };
  }

  let adjustedFlag = bestMatch.flag;

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

  if (attachmentScore >= 85 && bestMatch.avgDiff <= 5) {
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
