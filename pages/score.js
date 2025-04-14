import { useEffect } from 'react';
import { useRouter } from 'next/router';
import rawProfiles from '@/data/attachmentProfiles';

// Normalize profiles data
const profiles = Array.isArray(rawProfiles)
  ? rawProfiles
  : typeof rawProfiles?.default === 'object'
  ? Object.values(rawProfiles.default)
  : Object.values(rawProfiles || {});

// Main matching function
function matchProfileWithWiggleRoom(f, m, b, attachmentScore = 0, total = 0) {
  const scoredMatches = profiles
    .filter((p) => p?.target && typeof p.target.fluency === 'number')
    .map((p) => {
      const diff = [
        Math.abs(f - p.target.fluency),
        Math.abs(m - p.target.maturity),
        Math.abs(b - p.target.bs),
      ];
      const avgDiff = diff.reduce((a, c) => a + c, 0) / 3;
      const gteMatch = p.useGTE
        ? f >= p.target.fluency && m >= p.target.maturity && b >= p.target.bs
        : true;

      return { ...p, avgDiff, gteMatch };
    });

  const topThree = scoredMatches
    .filter((p) => p.gteMatch && p.avgDiff < 10)
    .sort((a, b) => a.avgDiff - b.avgDiff)
    .slice(0, 3);

  const bestMatch = topThree[0];

  if (!bestMatch) {
    if (f >= 85 && m >= 100 && total >= 310) {
      return {
        profile: 'Still Figuring It Out',
        flag: 'sunshine yellow',
        topThree: [],
      };
    }
    return {
      profile: 'Disorganized Seeker',
      flag: 'brick red',
      topThree: [],
    };
  }

  let adjustedFlag = bestMatch.flag;

  if (bestMatch.avgDiff >= 3) {
    const downgrade = {
      'forest green': 'lime green',
      'lime green': 'sunshine yellow',
      'sunshine yellow': 'lemon yellow',
      'lemon yellow': 'orange',
      'orange': 'brick red',
      'brick red': 'hell boy red',
    };
    adjustedFlag = downgrade[adjustedFlag] || adjustedFlag;
  }

  if (attachmentScore >= 85 && bestMatch.avgDiff <= 5) {
    const upgrade = {
      'hell boy red': 'brick red',
      'brick red': 'orange',
      'orange': 'lemon yellow',
      'lemon yellow': 'sunshine yellow',
      'sunshine yellow': 'lime green',
      'lime green': 'forest green',
    };
    adjustedFlag = upgrade[adjustedFlag] || adjustedFlag;
  }

  return {
    profile: bestMatch.name,
    flag: adjustedFlag,
    topThree: topThree.map((p) => ({ name: p.name, avgDiff: p.avgDiff, flag: p.flag })),
  };
}

export { matchProfileWithWiggleRoom };

// Component to trigger redirect based on scores
export default function ScoreRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const query = router.query;
    const values = Array.from({ length: 72 }, (_, i) => {
      const key = `Q${i + 3}`;
      return [28, 32].includes(i) ? 0 : parseInt(query[key] || 0, 10);
    });

    const reverseIndexes = new Set([
      0, 2, 4, 7, 10, 13, 15, 18, 20, 21, 22, 23, 24, 26, 28, 30, 31, 32, 33, 34,
      35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
      54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
    ]);

    const reverseScore = (v) => Math.round((8 - v) * 0.85);
    const scoredAnswers = values.map((v, i) =>
      reverseIndexes.has(i) ? reverseScore(v) : v
    );

    const sum = (arr) =>
      arr.reduce((acc, val) => acc + (typeof val === 'number' ? val : 0), 0);

    const fluency = sum(scoredAnswers.slice(0, 24));
    const maturity = sum(scoredAnswers.slice(24, 48));
    const bs = sum(scoredAnswers.slice(48, 72));
    const total = fluency + maturity + bs;
    const attachmentScore = sum(scoredAnswers.slice(10, 16));

    const result = matchProfileWithWiggleRoom(
      fluency,
      maturity,
      bs,
      attachmentScore,
      total
    );

    const topParams = result.topThree
      .map(
        (p, i) =>
          `alt${i + 1}=${encodeURIComponent(p.name)}&alt${i + 1}Flag=${encodeURIComponent(
            p.flag
          )}`
      )
      .join('&');

    const redirectUrl = `/result/${encodeURIComponent(
      result.profile
    )}?fluency=${fluency}&maturity=${maturity}&bs=${bs}&total=${total}&flag=${
      result.flag
    }&${topParams}`;

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
