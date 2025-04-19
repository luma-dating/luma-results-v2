// pages/score.jsx
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  scoreQuiz,
  calculateAttachmentStyle,
  matchProfileWithWiggleRoom
} from '@/data/scoring';

export default function ScoreRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const query = router.query;
    const responses = {};
    let gender = '';
    let trauma = false;

    // Parse the query params
    Object.entries(query).forEach(([key, value]) => {
      if (key.startsWith('Q')) responses[key] = parseInt(value, 10);
      if (key === 'gender') gender = value;
      if (key === 'trauma') trauma = value === 'true';
    });

    // Get main score info
    const { fluency, maturity, bs, total, attachmentStyle } = scoreQuiz(responses, gender, trauma);

    // Use raw answers to get attachment-style specific logic
    const attachmentValues = Object.entries(responses)
      .filter(([key]) => key.startsWith('Q'))
      .map(([, val]) => val || 0);

    const attachmentScoreObj = calculateAttachmentStyle(responses); // ← Use full responses not just array!

    const result = matchProfileWithWiggleRoom(
      fluency,
      maturity,
      bs,
      attachmentScoreObj.score,
      total
    );

    // Compose alt top matches
    const topParams =
      result.topThree
        ?.map(
          (p, i) =>
            `alt${i + 1}=${encodeURIComponent(p.name)}&alt${i + 1}Flag=${encodeURIComponent(p.flag)}`
        )
        .join('&') || '';

    // Build final redirect URL
    const redirectUrl = `/result/${encodeURIComponent(result.profile)}?` +
      `fluency=${fluency}&maturity=${maturity}&bs=${bs}&total=${total}` +
      `&flag=${encodeURIComponent(result.flag)}` +
      `&attachment=${encodeURIComponent(attachmentScoreObj?.style || '')}` +
      `&attachmentScore=${attachmentScoreObj?.score || 0}` +
      `&${topParams}`;

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
