// score.js

// score.js

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import rawProfiles from '@/data/attachmentProfiles';
import { matchProfileWithWiggleRoom } from '@/data/scoring';
import { calculateAttachmentStyle } from '@/data/scoring';
import { debugAttachmentScore } from '@/lib/debugAttachment';

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

    // Reverse-score logic
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
    const attachmentSlice = scoredAnswers.slice(10, 16); 
    const attachmentStyle = calculateAttachmentStyle(attachmentSlice);


   // ATTACHMENT SCORING (Q13–Q18 = index 10–15)
const attachmentIndexes = [10, 11, 12, 13, 14, 15];

const attachmentScore = attachmentIndexes.reduce((total, index) => {
  const value = scoredAnswers[index] || 0;
  console.log(`Q${index + 3}: final=${value}`);
  return total + value;
}, 0);

console.log("📎 Attachment Slice:", attachmentIndexes.map(i => scoredAnswers[i]));
console.log("📊 Attachment Score (Q13–Q18):", attachmentScore);

const attachmentStyle = calculateAttachmentStyle(attachmentIndexes.map(i => scoredAnswers[i]));
console.log("🧠 Matched Attachment Style:", attachmentStyle?.name || "None found");


  return (
    <main className="min-h-screen flex items-center justify-center bg-white text-center p-6">
      <div>
        <h1 className="text-xl font-semibold">Scoring your results...</h1>
        <p className="text-gray-500 mt-2">Please wait a moment.</p>
      </div>
    </main>
  );
}
