import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { scoreQuiz, matchProfileWithWiggleRoom } from '@/data/scoring';

export default function ScoreRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const query = router.query;
    const responses = {};
    let gender = '';
    let trauma = false;

    Object.keys(query).forEach((key) => {
      if (key.startsWith('Q')) {
        responses[key] = parseInt(query[key], 10);
      } else if (key === 'gender') {
        gender = query[key];
      } else if (key === 'trauma') {
        trauma = query[key] === 'true';
      }
    });

    const { fluency, maturity, bs, total, attachmentStyle } = scoreQuiz(responses, gender, trauma);

    const attachmentQuestions = ['Q13', 'Q14', 'Q15', 'Q16', 'Q17', 'Q18'];
    const attachmentValues = attachmentQuestions.map((q) => responses[q] || 0);
    const attachmentScoreObj = calculateAttachmentStyle(attachmentValues);

    const result = matchProfileWithWiggleRoom(fluency, maturity, bs, attachmentScoreObj?.score || 0, total);

    const topParams = result.topThree?.map((p, i) =>
      `alt${i + 1}=${encodeURIComponent(p.name)}&alt${i + 1}Flag=${encodeURIComponent(p.flag)}`
    ).join('&') || '';

    const redirectUrl = `/result/${encodeURIComponent(result.profile)}?fluency=${fluency}&maturity=${maturity}&bs=${bs}&total=${total}&flag=${result.flag}&attachment=${encodeURIComponent(attachmentStyle || '')}&${topParams}`;

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
