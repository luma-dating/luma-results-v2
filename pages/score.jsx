// pages/score.js

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { matchProfileWithWiggleRoom, calculateAttachmentStyle } from '@/data/scoring';

export default function ScoreRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const query = router.query;

    // Adjusted offset: Typeform Q4 is our index 0
    const values = Array.from({ length: 72 }, (_, i) => {
      const key = `Q${i + 4}`; // Skip Q1–Q3
      return parseInt(query[key] || 0, 10);
    });

    // Optional: force skip values for certain misbehaving questions
    const skipIndexes = [27, 31]; // Q31, Q35
    skipIndexes.forEach(i => values[i] = 0);

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

    const attachmentIndexes = [10, 11, 12, 13, 14, 15];
    const attachmentSlice = attachmentIndexes.map(i => scoredAnswers[i]);
    const attachmentScore = sum(attachmentSlice);
    const attachmentStyle = calculateAttachmentStyle(attachmentSlice);

    const result = matchProfileWithWiggleRoom(fluency, maturity, bs, attachmentScore, total);

    const topParams = result.topThree?.map((p, i) =>
      `alt${i + 1}=${encodeURIComponent(p.name)}&alt${i + 1}Flag=${encodeURIComponent(p.flag)}`
    ).join('&') || '';

    const redirectUrl = `/result/${encodeURIComponent(result.profile)}?fluency=${fluency}&maturity=${maturity}&bs=${bs}&total=${total}&flag=${result.flag}&attachment=${encodeURIComponent(attachmentStyle?.name || '')}&${topParams}`;

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
