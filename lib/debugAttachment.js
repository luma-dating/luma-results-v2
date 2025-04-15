// Temporary debug tool injected into the score.js file
// This will log the attachment score calculations

export function debugAttachmentScore(scoredAnswers) {
  const attachmentIndexes = [10, 11, 12, 13, 14, 15];

  const reverseAttachmentIndexes = []; // none reversed currently
  const reverseScore = (value) => Math.round((8 - value) * 0.85);

  console.log("---- Debugging Attachment Score ----");
  attachmentIndexes.forEach((index, i) => {
    const raw = scoredAnswers[index];
    const reversed = reverseAttachmentIndexes.includes(index);
    const final = reversed ? reverseScore(raw) : raw;

    console.log(`Q${index + 3}: raw=${raw}, reversed=${reversed}, final=${final}`);
  });

  const totalScore = attachmentIndexes.reduce((sum, index) => {
    const raw = scoredAnswers[index] || 0;
    const value = reverseAttachmentIndexes.includes(index)
      ? reverseScore(raw)
      : raw;
    return sum + value;
  }, 0);

  console.log("Attachment Total Score:", totalScore);
  return totalScore;
}

// In score.js you would import this:
// import { debugAttachmentScore } from '@/lib/debugAttachment';
// Then replace attachmentScore logic with:
// const attachmentScore = debugAttachmentScore(scoredAnswers);

// This lets us see exactly what is being scored and why
