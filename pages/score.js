import { useEffect } from 'react';
import { useRouter } from 'next/router';
import rawProfiles from '@/data/attachmentProfiles';

const profiles = Array.isArray(rawProfiles)
  ? rawProfiles
  : typeof rawProfiles?.default === 'object'
    ? Object.values(rawProfiles.default)
    : Object.values(rawProfiles || {});

function getFlagFromTotal(total) {
  if (total >= 330) return 'forest green';
  if (total >= 300) return 'lime green';
  if (total >= 260) return 'sunshine yellow';
  if (total >= 230) return 'lemon yellow';
  if (total >= 180) return 'orange';
  if (total >= 150) return 'brick red';
  return 'hell boy red';
}

function getAttachmentStyle(score) {
  if (score >= 30) return 'Secure';
  if (score >= 24) return 'Anxious-Leaning Secure';
  if (score >= 18) return 'Anxious or Avoidant';
  return 'Disorganized';
}

function matchProfile(f, m, b, attachmentScore, total) {
  const flag = getFlagFromTotal(total);
  const matches = profiles.filter(p => {
    try {
      const EF = f, RM = m, BS = b;
      const pattern = p.pattern.replace(/EF/g, EF).replace(/RM/g, RM).replace(/BS/g, BS);
      const result = eval(pattern);
      return result;
    } catch (e) {
      console.warn('Pattern error in profile:', p.name);
      return false;
    }
  });

  if (matches.length > 0) {
    matches.sort((a, b) => {
      const avgA = Math.abs(f - eval(a.pattern.match(/EF [<>=]+ \d+/)?.[0]?.split(' ').pop())) +
                   Math.abs(m - eval(a.pattern.match(/RM [<>=]+ \d+/)?.[0]?.split(' ').pop())) +
                   Math.abs(b - eval(a.pattern.match(/BS [<>=]+ \d+/)?.[0]?.split(' ').pop()));
      const avgB = Math.abs(f - eval(b.pattern.match(/EF [<>=]+ \d+/)?.[0]?.split(' ').pop())) +
                   Math.abs(m - eval(b.pattern.match(/RM [<>=]+ \d+/)?.[0]?.split(' ').pop())) +
                   Math.abs(b - eval(b.pattern.match(/BS [<>=]+ \d+/)?.[0]?.split(' ').pop()));
      return avgA - avgB;
    });
    return {
      profile: matches[0].name,
      flag,
      attachmentStyle: getAttachmentStyle(attachmentScore),
      topThree: matches.slice(0, 3).map(p => p.name)
    };
  }

  const fallback = profiles.find(p => p.name === flagToFallback(flag));
  return {
    profile: fallback?.name || 'Still Figuring It Out',
    flag,
    attachmentStyle: getAttachmentStyle(attachmentScore),
    topThree: []
  };
}

function flagToFallback(flag) {
  switch (flag) {
    case 'forest green': return 'Unicorn';
    case 'lime green': return 'Evergreen Wanderer';
    case 'sunshine yellow': return 'Rubber Ducky';
    case 'lemon yellow': return 'Delicate Teacup';
    case 'orange': return 'Rollercoaster Rider';
    case 'brick red': return 'Stop Sign';
    case 'hell boy red': return 'Emotional Arsonist';
    default: return 'Still Figuring It Out';
  }
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
      0, 2, 4, 7, 10, 13, 15, 18, 20, 21, 22, 23, 24, 26, 28, 30, 31, 32, 33,
      34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
      51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71
    ];

    const reverseScore = val => Math.round((8 - val) * 0.85);
    const scored = values.map((val, i) => reverseIndexes.includes(i) ? reverseScore(val) : val);

    const sum = arr => arr.reduce((acc, val) => acc + (typeof val === 'number' ? val : 0), 0);

    const EF = sum(scored.slice(0, 24));
    const RM = sum(scored.slice(24, 48));
    const BS = sum(scored.slice(48, 72));
    const total = EF + RM + BS;
    const attachmentScore = sum(scored.slice(10, 16));

    const result = matchProfile(EF, RM, BS, attachmentScore, total);

    const topParams = result.topThree.map((name, i) => `alt${i + 1}=${encodeURIComponent(name)}`).join('&');

    const redirect = `/result/${encodeURIComponent(result.profile)}?fluency=${EF}&maturity=${RM}&bs=${BS}&total=${total}&flag=${result.flag}&attachment=${encodeURIComponent(result.attachmentStyle)}&${topParams}`;
    router.replace(redirect);
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
