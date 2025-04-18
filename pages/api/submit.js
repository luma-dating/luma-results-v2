import { scoreQuiz, matchProfileWithWiggleRoom } from '@/data/scoring';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { form_response } = req.body;
    const answersArray = form_response?.answers || [];

    // Step 1: Map Typeform answers by ref
    const answers = {};
    for (let i = 0; i < answersArray.length; i++) {
      const ref = answersArray[i]?.field?.ref;
      const choice = answersArray[i]?.choice?.label;
      const value = answersArray[i]?.number;

      if (ref && typeof value === 'number') {
        answers[ref] = value;
      } else if (ref && typeof choice === 'string') {
        answers[ref] = choice.toLowerCase();
      }
    }

    // Step 2: Extract gender and trauma
    const gender = answers['Q3'] || '';
    const trauma = answers['Q4'] === 'true';

    // Step 3: Build responses object for Likert Q9–Q65
    const responses = {};
    for (let i = 9; i <= 65; i++) {
      const key = `Q${i}`;
      if (answers[key]) {
        responses[key] = answers[key];
      }
    }

    // Step 4: Score it up
    const result = scoreQuiz(responses, gender, trauma);
    const profileMatch = matchProfileWithWiggleRoom(
      result.fluency,
      result.maturity,
      result.bs,
      result.attachmentStyle,
      result.total
    );

    const { profile, flag } = profileMatch;

    // Step 5: Redirect to result page
    const redirectUrl = `https://luma-results-v2.vercel.app/result/${encodeURIComponent(profile)}?flag=${encodeURIComponent(flag)}`;
    return res.redirect(302, redirectUrl);
  } catch (err) {
    console.error('Scoring error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
