// pages/score.jsx
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { scoreQuiz, calculateAttachmentStyle, matchProfileWithWiggleRoom } from '@/data/scoring'; // or '@/data/scoring' if that's where you're keeping it

export default function ScoreRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const  query  = router.query;
    const responses = {};
    let gender = '';
    let trauma = false;

    Object.entries(query).forEach(([key, value]) => {
      if (key.startsWith('Q')) responses[key] = parseInt(value, 10);
      if (key === 'gender') gender = value;
      if (key === 'trauma') trauma = value === 'true';
    });

    const { fluency, maturity, bs, total, attachmentStyle } = scoreQuiz(responses, gender, trauma);

    const attachmentValues = Object.entries(responses)
  .filter(([key]) => key.startsWith('Q'))
  .map(([, val]) => val || 0);
const attachmentScoreObj = calculateAttachmentStyle(attachmentValues);

    const result = matchProfileWithWiggleRoom(fluency, maturity, bs, attachmentValues.reduce((a, b) => a + b, 0), total);

    const topParams = result.topThree?.map((p, i) =>
      `alt${i + 1}=${encodeURIComponent(p.name)}&alt${i + 1}Flag=${encodeURIComponent(p.flag)}`
    ).join('&') || '';

    const redirectUrl = `/result/${encodeURIComponent(result.profile)}?fluency=${fluency}&maturity=${maturity}&bs=${bs}&total=${total}&flag=${result.flag}&attachment=${encodeURIComponent(attachmentMeta?.name || '')}&${topParams}`;

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
