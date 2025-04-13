import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ScoreRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const query = router.query;
    const values = Array.from({ length: 72 }, (_, i) => {
      const key = `Q${i + 1}`;
      return parseInt(query[key] || 0, 10);
    });

    const reverseIndexes = [
      2, 4, 7, 10, 12, 14, 18, 19, 20, 21,
      24, 26, 29, 31, 33, 34, 35, 37, 38, 39,
      40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
      50, 51, 52, 53, 54, 55, 56, 57, 58, 60,
      61, 62, 63, 64, 65, 66, 67, 68, 71
    ];

    const reverseScore = (value) => 8 - value;
    const scoredAnswers = values.map((val, i) =>
      reverseIndexes.includes(i) ? reverseScore(val) : val
    );

    const sum = (arr) => arr.reduce((a, b) => a + b, 0);
    const fluency = sum(scoredAnswers.slice(0, 24));
    const maturity = sum(scoredAnswers.slice(24, 48));
    const bs = sum(scoredAnswers.slice(48, 72));
    const total = fluency + maturity + bs;

    let flag = 'red';
    if (total >= 390 && fluency >= 120 && maturity >= 120 && bs >= 120) flag = 'green';
    else if (total >= 300 && fluency >= 90 && maturity >= 90 && bs >= 90) flag = 'yellow';
    else flag = 'neutral';

    function getProfile(f, m, b, t) {
      if (f > 130 && m > 130 && b > 130) return 'Steady Flame';
      if (f > 125 && m < 100 && b > 125) return 'Soft Talker, Hard Avoider';
      if (f > 120 && m < 105 && b < 105) return 'Self-Aware Tornado';
      if (f < 90 && m < 90 && b < 90) return 'Ghost of Relationships Past';
      if (m < 110 && b < 110 && f >= 100 && f < 130) return 'Fix-Me Pick-Me';
      if (f >= 110 && m >= 110 && b >= 110 && f <= 130 && m <= 130 && b <= 130) return 'Emotionally Ambidextrous';
      if (f > 125 && m >= 90 && m <= 110 && b < 90) return 'Boundary Flirt';
      if (f > 130 && m < 100 && b < 100) return 'Overfunctioning Mystic';
      if (f >= 120 && m < 90 && b >= 100 && t >= 290) return 'Burnt Empath';
      if (t < 260) return 'Still Figuring It Out';
      return 'Disorganized Seeker';
    }

    const profile = getProfile(fluency, maturity, bs, total);
    const redirectUrl = `/result/${encodeURIComponent(profile)}?fluency=${fluency}&maturity=${maturity}&bs=${bs}&total=${total}&flag=${flag}`;

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
