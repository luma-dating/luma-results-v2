export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { form_response } = req.body;
    const answersArray = form_response?.answers || [];

    // Convert quiz answers into a key:value map (Q1: 5, Q2: 3, etc)
    const answers = {};
    for (let i = 0; i < answersArray.length; i++) {
      const ref = answersArray[i]?.field?.ref;
      const value = answersArray[i]?.number;
      if (ref && typeof value === 'number') {
        answers[ref] = value;
      }
    }

    // Build a consistent 72-question array of answers
    const values = Array.from({ length: 72 }, (_, i) => {
      const key = `Q${i + 1}`;
      return parseInt(answers[key] || 0, 10);
    });

    // Indices of reverse-scored questions
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

    // Redirect to the result page with raw scores — let frontend handle all logic
    const redirectUrl = `https://luma-results-v2.vercel.app/result?fluency=${fluency}&maturity=${maturity}&bs=${bs}&total=${total}`;
    return res.redirect(302, redirectUrl);
  } catch (err) {
    console.error('Scoring error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
