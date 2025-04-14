import { useEffect } from 'react';
import { useRouter } from 'next/router';
import rawProfiles from '@/data/attachmentProfiles';

const profiles = Object.values(
  typeof rawProfiles?.default === 'object' ? rawProfiles.default : rawProfiles
);

function matchProfileWithWiggleRoom(f, m, b, attachmentScore = 0, total = 0) {
  let bestMatch = null;
  let lowestAvgDiff = Infinity;

  Object.values(profiles).forEach((p) => {
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
      return { profile: 'Still Figuring It Out', flag: 'sunshine yellow' };
    }
    return { profile: 'Disorganized Seeker', flag: 'brick red' };
  }

  let adjustedFlag = bestMatch.flag;

  if (bestMatch.avgDiff >= 3) {
    if (adjustedFlag === 'forest green') adjustedFlag = 'lime green';
    else if (adjustedFlag === 'lime green') adjustedFlag = 'sunshine yellow';
    else if (adjustedFlag === 'sunshine yellow') adjustedFlag = 'lemon yellow';
    else if (adjustedFlag === 'lemon yellow') adjustedFlag = 'orange';
    else if (adjustedFlag === 'orange') adjustedFlag = 'brick red';
    else if (adjustedFlag === 'brick red') adjustedFlag = 'hell boy red';
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
