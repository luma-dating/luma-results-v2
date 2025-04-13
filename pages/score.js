import { useEffect } from 'react';
import { useRouter } from 'next/router';

const profiles = [
  // Warm Cynic group
  { name: 'Warm Cynic', target: { fluency: 95, maturity: 100, bs: 130 }, baseFlag: 'sunshine yellow', useGTE: true },
  { name: 'Wary Wisecrack', target: { fluency: 80, maturity: 95, bs: 130 }, baseFlag: 'lemon yellow' },
  { name: 'Salted Seeker', target: { fluency: 85, maturity: 100, bs: 105 }, baseFlag: 'lemon yellow' },
  { name: 'Recovering Romantic', target: { fluency: 100, maturity: 95, bs: 130 }, baseFlag: 'sunshine yellow' },

  // Hopeful Realist archetype
  { name: 'Hopeful Realist', target: { fluency: 115, maturity: 105, bs: 115 }, baseFlag: 'forest green' },
  { name: 'Gentle Challenger', target: { fluency: 110, maturity: 100, bs: 115 }, baseFlag: 'forest green' },
  { name: 'Quiet Flame', target: { fluency: 105, maturity: 105, bs: 110 }, baseFlag: 'lime green' },
  { name: 'Grounded Dreamer', target: { fluency: 120, maturity: 95, bs: 110 }, baseFlag: 'lime green' },
  { name: 'Earnest Explorer', target: { fluency: 110, maturity: 100, bs: 110 }, baseFlag: 'lime green' },
  { name: 'Hard-Learned Lover', target: { fluency: 115, maturity: 110, bs: 100 }, baseFlag: 'forest green' },
  { name: 'Introspective Firecracker', target: { fluency: 115, maturity: 95, bs: 110 }, baseFlag: 'lime green' },

  // Existing Profiles
  { name: 'Steady Flame', target: { fluency: 120, maturity: 105, bs: 120 }, baseFlag: 'forest green', useGTE: true },
  { name: 'Soft Talker, Hard Avoider', target: { fluency: 130, maturity: 80, bs: 120 }, baseFlag: 'sunshine yellow', useGTE: true },
  { name: 'Self-Aware Tornado', target: { fluency: 125, maturity: 90, bs: 95 }, baseFlag: 'sunshine yellow' },
  { name: 'Fix-Me Pick-Me', target: { fluency: 115, maturity: 65, bs: 100 }, baseFlag: 'lemon yellow' },
  { name: 'Burnt Empath', target: { fluency: 125, maturity: 80, bs: 130 }, baseFlag: 'sunshine yellow' },
  { name: 'Emotionally Ambidextrous', target: { fluency: 115, maturity: 100, bs: 115 }, baseFlag: 'forest green' },
  { name: 'Boundary Flirt', target: { fluency: 125, maturity: 90, bs: 85 }, baseFlag: 'lemon yellow' },
  { name: 'Overfunctioning Mystic', target: { fluency: 130, maturity: 80, bs: 85 }, baseFlag: 'lemon yellow' },
  { name: 'Almost Integrated', target: { fluency: 110, maturity: 90, bs: 110 }, baseFlag: 'sunshine yellow' },
  { name: 'Disorganized Seeker', target: { fluency: 110, maturity: 90, bs: 135 }, baseFlag: 'brick red' },
  { name: 'Still Figuring It Out', target: { fluency: 90, maturity: 80, bs: 110 }, baseFlag: 'orange' }
];

function matchProfileWithWiggleRoom(f, m, b, attachmentScore = 0, total = 0) {
  let bestMatch = null;
  let lowestAvgDiff = Infinity;

  profiles.forEach((p) => {
    const diff = [
      Math.abs(f - p.target.fluency),
      Math.abs(m - p.target.maturity),
      Math.abs(b - p.target.bs)
    ];
    const avgDiff = diff.reduce((a, c) => a + c, 0) / 3;

    const gteMatch = p.useGTE
      ? f >= p.target.fluency && m >= p.target.maturity && b >= p.target.bs
      : true;

    if (avgDiff < lowestAvgDiff && avgDiff < 10 && gteMatch) {
      bestMatch = { ...p, avgDiff };
      lowestAvgDiff = avgDiff;
    }
  });

  if (!bestMatch) {
    if (f >= 85 && m >= 100 && total >= 310) {
      return { profile: 'Still Figuring It Out', flag: 'orange' };
    }
    return { profile: 'Disorganized Seeker', flag: 'brick red' };
  }

  let adjustedFlag = bestMatch.baseFlag;

  if (bestMatch.avgDiff >= 3) {
    if (adjustedFlag === 'forest green') adjustedFlag = 'lime green';
    else if (adjustedFlag === 'lime green') adjustedFlag = 'sunshine yellow';
    else if (adjustedFlag === 'sunshine yellow') adjustedFlag = 'lemon yellow';
    else if (adjustedFlag === 'lemon yellow') adjustedFlag = 'orange';
    else if (adjustedFlag === 'orange') adjustedFlag = 'brick red';
  }

  if (attachmentScore >= 85 && bestMatch.avgDiff <= 5) {
    if (adjustedFlag === 'brick red') adjustedFlag = 'orange';
    else if (adjustedFlag === 'orange') adjustedFlag = 'lemon yellow';
    else if (adjustedFlag === 'lemon yellow') adjustedFlag = 'sunshine yellow';
    else if (adjustedFlag === 'sunshine yellow') adjustedFlag = 'lime green';
    else if (adjustedFlag === 'lime green') adjustedFlag = 'forest green';
  }

  return { profile: bestMatch.name, flag: adjustedFlag };
}

export default function ScoreRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const query = router.query;
    const values = Array.from({ length: 72 }, (_, i) => {
      const key = `Q${i + 3}`;
      if ([28, 32].includes(i)) return 0;
      return parseInt(query[key] || 0, 10);
    });

    const reverseIndexes = [
      0, 2, 4, 7, 10, 13, 15, 18, 20, 21, 22, 23,
      24, 26, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38,
      39, 40, 41, 42, 43, 44, 45, 46, 47,
      48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71
    ];

    const reverseScore = (value) => Math.round((8 - value) * 0.85);
    const scoredAnswers = values.map((val, i) =>
      reverseIndexes.includes(i) ? reverseScore(val) : val
    );

    const sum = (arr) =>
      arr.reduce((acc, val) => acc + (typeof val === 'number' ? val : 0), 0);

    const fluency = sum(scoredAnswers.slice(0, 24));
    const maturity = sum(scoredAnswers.slice(24, 48));
    const bs = sum(scoredAnswers.slice(48, 72));
    const total = fluency + maturity + bs;
    const attachmentScore = sum(scoredAnswers.slice(10, 16));

    const result = matchProfileWithWiggleRoom(fluency, maturity, bs, attachmentScore, total);

    const redirectUrl = `/result/${encodeURIComponent(result.profile)}?fluency=${fluency}&maturity=${maturity}&bs=${bs}&total=${total}&flag=${result.flag}`;

    router.replace(redirectUrl);
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-white text-center p-6">
      <div>
        <h1 className="text-xl font-semibold">Scoring your results...</h1>
        <p className="text-gray-500 mt-2">Please wait a moment.</p>
      </div>
    </main>
  );
}
