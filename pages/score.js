import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ScoreRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const query = router.query;
    const values = Array.from({ length: 72 }, (_, i) => {
      const key = `Q${i + 3}`; // Likert questions start at Q3
      return parseInt(query[key] || 0, 10);
    });

    const reverseIndexes = [
      0, 2, 4, 7, 10, // Q3–Q12 (Fluency)
      13, 15, 18, 20, 21, 22, 23, // Q16–Q26 (Fluency)
      24, 26, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, // Q27–Q48 (Maturity)
      48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71 // Q49–Q74 (BS Detection)
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

    let flag = 'red';
    if (total >= 375 && fluency >= 115 && maturity >= 115 && bs >= 115) flag = 'green';
    else if (total >= 300 && fluency >= 85 && maturity >= 85 && bs >= 85) flag = 'yellow';
    else flag = 'neutral';

    function getProfile(f, m, b, t) {
      if (f >= 120 && m >= 120 && b >= 120) return 'Steady Flame';
      if (f >= 130 && m < 90 && b > 120) return 'Soft Talker, Hard Avoider';
      if (f > 120 && m < 105 && b < 105) return 'Self-Aware Tornado';
      if (f < 90 && m < 90 && b < 90) return 'Ghost of Relationships Past';
      if (f >= 100 && (m < 90 || b < 90)) return 'Fix-Me Pick-Me';
      if (f >= 110 && m >= 110 && b >= 110 && f <= 135 && m <= 135 && b <= 135) return 'Emotionally Ambidextrous';
      if (f > 125 && m >= 90 && m <= 110 && b < 90) return 'Boundary Flirt';
      if (f > 130 && m < 100 && b < 100) return 'Overfunctioning Mystic';
      if (f >= 120 && m < 95 && b >= 125 && t >= 300) return 'Burnt Empath';
      if (f > 135 && m >= 90 && m < 115 && b >= 130 && t >= 345) return 'Oracle of Cord-Cutting';
      if (t <= 310 && m < 95) return 'Still Figuring It Out';
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
