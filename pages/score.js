// score.js — rewritten for full Luma glory
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const reverseIndexes = new Set([
  2, 4, 7, 10, 13, 15, 18, 20, 21, 22, 23,
  24, 26, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38,
  39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
  52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65,
  66, 67, 68, 71
]);

const reverseScore = (val) => 8 - val;

const profiles = [
  { name: 'Steady Flame', target: { fluency: 130, maturity: 130, bs: 130 }, baseFlag: 'green' },
  { name: 'Self-Aware Tornado', target: { fluency: 135, maturity: 110, bs: 110 }, baseFlag: 'yellow' },
  { name: 'Fix-Me Pick-Me', target: { fluency: 115, maturity: 90, bs: 90 }, baseFlag: 'yellow' },
  { name: 'Soft Talker, Hard Avoider', target: { fluency: 135, maturity: 95, bs: 135 }, baseFlag: 'red' },
  { name: 'Burnt Empath', target: { fluency: 130, maturity: 100, bs: 135 }, baseFlag: 'yellow' },
  { name: 'Emotionally Ambidextrous', target: { fluency: 125, maturity: 125, bs: 125 }, baseFlag: 'green' },
  { name: 'Boundary Flirt', target: { fluency: 125, maturity: 105, bs: 95 }, baseFlag: 'neutral' },
  { name: 'Overfunctioning Mystic', target: { fluency: 130, maturity: 100, bs: 100 }, baseFlag: 'neutral' },
  { name: 'Almost Integrated', target: { fluency: 120, maturity: 110, bs: 115 }, baseFlag: 'yellow' },
  { name: 'Disorganized Seeker', target: { fluency: 110, maturity: 95, bs: 135 }, baseFlag: 'yellow' },
  { name: 'Still Figuring It Out', target: { fluency: 90, maturity: 85, bs: 110 }, baseFlag: 'neutral' }
];

function getAvgDiff(p, f, m, b) {
  return (
    Math.abs(f - p.target.fluency) +
    Math.abs(m - p.target.maturity) +
    Math.abs(b - p.target.bs)
  ) / 3;
}

function matchProfile(f, m, b, secureAttachmentScore = 0) {
  let bestMatch = null;
  let lowestAvgDiff = Infinity;

  profiles.forEach((p) => {
    const avgDiff = getAvgDiff(p, f, m, b);
    if (avgDiff < lowestAvgDiff && avgDiff <= 10) {
      bestMatch = { ...p, avgDiff };
      lowestAvgDiff = avgDiff;
    }
  });

  if (!bestMatch) return { profile: 'Disorganized Seeker', flag: 'yellow' };

  let flag = bestMatch.baseFlag;
  if (bestMatch.avgDiff >= 3) {
    flag = flag === 'green' ? 'yellow' : flag === 'yellow' ? 'red' : 'yellow';
  }
  if (secureAttachmentScore >= 100 && bestMatch.avgDiff <= 5) {
    flag = flag === 'red' ? 'yellow' : 'green';
  }

  return { profile: bestMatch.name, flag };
}

function sum(arr) {
  return arr.reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);
}

export default function ScoreRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const query = router.query;
    const values = Array.from({ length: 72 }, (_, i) => {
      const key = `Q${i + 3}`;
      return parseInt(query[key] || 0);
    });

    const scoredAnswers = values.map((v, i) => reverseIndexes.has(i) ? reverseScore(v) : v);

    const fluency = sum(scoredAnswers.slice(0, 24));
    const maturity = sum(scoredAnswers.slice(24, 48));
    const bs = sum(scoredAnswers.slice(48, 72));
    const total = fluency + maturity + bs;
    const secureAttachmentScore = sum([1, 5, 10, 14, 16, 22, 23, 30, 35, 39, 43, 48, 70, 71]
      .map(i => scoredAnswers[i]))

    const result = matchProfile(fluency, maturity, bs, secureAttachmentScore);

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
