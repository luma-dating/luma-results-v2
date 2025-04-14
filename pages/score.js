import { useEffect } from 'react';
import { useRouter } from 'next/router';
import rawProfiles from '@/data/attachmentProfiles';

const profiles = Array.isArray(rawProfiles)
  ? rawProfiles
  : typeof rawProfiles?.default === 'object'
    ? Object.values(rawProfiles.default)
    : Object.values(rawProfiles || {});

function matchProfileWithWiggleRoom(f, m, b, attachmentScore = 0, total = 0) {
  const scoredMatches = [];

  profiles.forEach((p) => {
    if (!p?.pattern) return;

    try {
      const match = eval(p.pattern.replace(/EF/g, f).replace(/RM/g, m).replace(/BS/g, b));
      if (match) {
        scoredMatches.push(p);
      }
    } catch (e) {
      console.warn(`Pattern failed for ${p.name}:`, e);
    }
  });

  if (scoredMatches.length === 0) {
    const flag = getFlagFromTotal(total);
    const fallback = getFallbackProfile(flag);
    return {
      profile: fallback.name,
      flag: fallback.flag,
      description: fallback.description,
      topThree: []
    };
  }

  const bestMatch = scoredMatches[0];
  const flag = getFlagFromTotal(total);

  return {
    profile: bestMatch.name,
    flag,
    description: bestMatch.description,
    topThree: scoredMatches.slice(1, 4).map((p) => ({ name: p.name, flag: p.flag }))
  };
}

function getFlagFromTotal(total) {
  if (total >= 330) return 'forest green';
  if (total >= 300) return 'lime green';
  if (total >= 260) return 'sunshine yellow';
  if (total >= 230) return 'lemon yellow';
  if (total >= 180) return 'orange';
  if (total >= 150) return 'brick red';
  return 'hell boy red';
}

function getFallbackProfile(flag) {
  const fallbackProfiles = {
    'forest green': { name: 'Unicorn', flag: 'forest green', description: "You’re exceptional, balanced, and don’t fit neatly into any one category. That’s your superpower." },
    'lime green': { name: 'Evergreen Wanderer', flag: 'lime green', description: "You’re consistent and curious, still exploring your inner map." },
    'sunshine yellow': { name: 'Rubber Ducky', flag: 'sunshine yellow', description: "Self-aware and bobbing along. You’ve got insight, just need a little more integration." },
    'lemon yellow': { name: 'Delicate Teacup', flag: 'lemon yellow', description: "Tender but hesitant. You’re doing your best not to spill." },
    'orange': { name: 'Rollercoaster Rider', flag: 'orange', description: "You’re a thrill to love, but buckle up — you’re still figuring out emotional stability." },
    'brick red': { name: 'Stop Sign', flag: 'brick red', description: "Something’s gotta pause. Consider a full system reboot and some healing space." },
    'hell boy red': { name: 'Emotional Arsonist', flag: 'hell boy red', description: "You light fires to see who runs. There’s healing to do underneath the defense." }
  };

  return fallbackProfiles[flag] || fallbackProfiles['sunshine yellow'];
}

export { matchProfileWithWiggleRoom };

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

    const topParams = result.topThree.map((p, i) =>
      `alt${i + 1}=${encodeURIComponent(p.name)}&alt${i + 1}Flag=${encodeURIComponent(p.flag)}`
    ).join('&');

    const redirectUrl = `/result/${encodeURIComponent(result.profile)}?fluency=${fluency}&maturity=${maturity}&bs=${bs}&total=${total}&flag=${result.flag}&${topParams}`;

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
