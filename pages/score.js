import { useEffect } from 'react';
import { useRouter } from 'next/router';

const profiles = [
  // Green / Greenish
  { name: 'Steady Flame', target: { fluency: 120, maturity: 105, bs: 120 }, baseFlag: 'green', useGTE: true },
  { name: 'Emotionally Ambidextrous', target: { fluency: 115, maturity: 100, bs: 115 }, baseFlag: 'green' },
  { name: 'Hopeful Realist', target: { fluency: 105, maturity: 105, bs: 110 }, baseFlag: 'green' },
  { name: 'Gentle Challenger', target: { fluency: 110, maturity: 100, bs: 100 }, baseFlag: 'green' },
  { name: 'Warm Cynic', target: { fluency: 95, maturity: 105, bs: 130 }, baseFlag: 'green' },
  { name: 'Quiet Flame', target: { fluency: 100, maturity: 110, bs: 105 }, baseFlag: 'green' },
  { name: 'Grounded Dreamer', target: { fluency: 110, maturity: 95, bs: 110 }, baseFlag: 'green' },
  { name: 'Earnest Explorer', target: { fluency: 100, maturity: 100, bs: 100 }, baseFlag: 'green' },

  // Yellow
  { name: 'Self-Aware Tornado', target: { fluency: 125, maturity: 90, bs: 95 }, baseFlag: 'yellow' },
  { name: 'Burnt Empath', target: { fluency: 125, maturity: 80, bs: 130 }, baseFlag: 'yellow' },
  { name: 'Almost Integrated', target: { fluency: 110, maturity: 90, bs: 110 }, baseFlag: 'yellow' },
  { name: 'Disorganized Seeker', target: { fluency: 110, maturity: 90, bs: 135 }, baseFlag: 'yellow' },
  { name: 'Hard-Learned Lover', target: { fluency: 105, maturity: 85, bs: 120 }, baseFlag: 'yellow' },
  { name: 'Introspective Firecracker', target: { fluency: 115, maturity: 85, bs: 100 }, baseFlag: 'yellow' },
  { name: 'Soft Talker, Hard Avoider', target: { fluency: 130, maturity: 80, bs: 120 }, baseFlag: 'yellow', useGTE: true },
  { name: 'Boundary Flirt', target: { fluency: 125, maturity: 90, bs: 85 }, baseFlag: 'yellow' },

  // Neutral
  { name: 'Fix-Me Pick-Me', target: { fluency: 115, maturity: 65, bs: 100 }, baseFlag: 'neutral' },
  { name: 'Overfunctioning Mystic', target: { fluency: 130, maturity: 80, bs: 85 }, baseFlag: 'neutral' },
  { name: 'Still Figuring It Out', target: { fluency: 90, maturity: 80, bs: 110 }, baseFlag: 'neutral' },
  { name: 'Curious-but-Cautious', target: { fluency: 95, maturity: 85, bs: 100 }, baseFlag: 'neutral' },
  { name: 'Boundary Newbie', target: { fluency: 90, maturity: 75, bs: 95 }, baseFlag: 'neutral' },
  { name: 'Nervous Negotiator', target: { fluency: 100, maturity: 80, bs: 85 }, baseFlag: 'neutral' },
  { name: 'Silent Integrator', target: { fluency: 105, maturity: 85, bs: 90 }, baseFlag: 'neutral' },
  { name: 'Earnest Mirror', target: { fluency: 110, maturity: 80, bs: 100 }, baseFlag: 'neutral' },

  // Red
  { name: 'Performer in Disguise', target: { fluency: 95, maturity: 60, bs: 90 }, baseFlag: 'red' },
  { name: 'Emotional Escape Artist', target: { fluency: 85, maturity: 70, bs: 100 }, baseFlag: 'red' },
  { name: 'Charm and Dodge', target: { fluency: 100, maturity: 60, bs: 85 }, baseFlag: 'red' },
  { name: 'Tornado with Teeth', target: { fluency: 110, maturity: 65, bs: 70 }, baseFlag: 'red' },
  { name: 'Boundary Bulldozer', target: { fluency: 90, maturity: 60, bs: 95 }, baseFlag: 'red' },
  { name: 'Gaslight-and-Grow', target: { fluency: 105, maturity: 50, bs: 90 }, baseFlag: 'red' },
  { name: 'Red Flag Romantic', target: { fluency: 100, maturity: 55, bs: 80 }, baseFlag: 'red' },
  { name: 'The Shape-Shifter', target: { fluency: 90, maturity: 50, bs: 85 }, baseFlag: 'red' }
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

    if (avgDiff < lowestAvgDiff && avgDiff < 12 && gteMatch) {
      bestMatch = { ...p, avgDiff };
      lowestAvgDiff = avgDiff;
    }
  });

  if (!bestMatch) {
    if (f >= 85 && m >= 100 && total >= 310) {
      return { profile: 'Still Figuring It Out', flag: 'neutral' };
    }
    return { profile: 'Disorganized Seeker', flag: 'yellow' };
  }

  let adjustedFlag = bestMatch.baseFlag;

  if (bestMatch.avgDiff >= 3) {
    if (adjustedFlag === 'green') adjustedFlag = 'yellow';
    else if (adjustedFlag === 'yellow') adjustedFlag = 'red';
    else if (adjustedFlag === 'neutral') adjustedFlag = 'yellow';
  }

  if (attachmentScore >= 85 && bestMatch.avgDiff <= 5) {
    if (adjustedFlag === 'red') adjustedFlag = 'yellow';
    else if (adjustedFlag === 'yellow') adjustedFlag = 'green';
    else if (adjustedFlag === 'neutral') adjustedFlag = 'green';
  }

  if (adjustedFlag === 'red' && f >= 90 && m >= 95) {
    adjustedFlag = 'yellow';
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
