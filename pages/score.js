import { useEffect } from 'react';
import { useRouter } from 'next/router';

const profiles = [
  { name: 'Steady Flame', target: { fluency: 120, maturity: 120, bs: 120 }, baseFlag: 'green' },
  { name: 'Soft Talker, Hard Avoider', target: { fluency: 130, maturity: 85, bs: 120 }, baseFlag: 'yellow' },
  { name: 'Self-Aware Tornado', target: { fluency: 125, maturity: 95, bs: 95 }, baseFlag: 'yellow' },
  { name: 'Fix-Me Pick-Me', target: { fluency: 115, maturity: 70, bs: 100 }, baseFlag: 'neutral' },
  { name: 'Burnt Empath', target: { fluency: 125, maturity: 85, bs: 130 }, baseFlag: 'yellow' },
  { name: 'Emotionally Ambidextrous', target: { fluency: 115, maturity: 115, bs: 115 }, baseFlag: 'green' },
  { name: 'Boundary Flirt', target: { fluency: 125, maturity: 95, bs: 85 }, baseFlag: 'neutral' },
  { name: 'Overfunctioning Mystic', target: { fluency: 130, maturity: 85, bs: 85 }, baseFlag: 'neutral' },
  { name: 'Almost Integrated', target: { fluency: 110, maturity: 100, bs: 110 }, baseFlag: 'yellow' },
  { name: 'Disorganized Seeker', target: { fluency: 110, maturity: 95, bs: 135 }, baseFlag: 'yellow' },
  { name: 'Still Figuring It Out', target: { fluency: 90, maturity: 85, bs: 110 }, baseFlag: 'neutral' }
];

function matchProfileWithWiggleRoom(f, m, b, attachmentScore = 0) {
  let bestMatch = null;
  let lowestAvgDiff = Infinity;

  profiles.forEach((p) => {
    const diff = [
      Math.abs(f - p.target.fluency),
      Math.abs(m - p.target.maturity),
      Math.abs(b - p.target.bs)
    ];
    const avgDiff = diff.reduce((a, c) => a + c, 0) / 3;
    if (avgDiff < lowestAvgDiff && avgDiff < 10) {
      bestMatch = { ...p, avgDiff };
      lowestAvgDiff = avgDiff;
    }
  });

  if (!bestMatch) return { profile: 'Disorganized Seeker', flag: 'yellow' };

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

  return { profile: bestMatch.name, flag: adjustedFlag };
}

export default function ScoreRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const query = router.query;
    const values = Array.from({ length: 72 }, (_, i) => {
      const key = `Q${i + 3}`;
      return parseInt(query[key] || 0, 10);
    });

    const reverseIndexes = [
      0, 2, 4, 7, 10, 13, 15, 18, 20, 21, 22, 23,
      24, 26, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38,
      39, 40, 41, 42, 43, 44, 45, 46, 47,
      48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71
    ];

    const reverseScore = (value) => 8 - value;
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

    const result = matchProfileWithWiggleRoom(fluency, maturity, bs, attachmentScore);

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

