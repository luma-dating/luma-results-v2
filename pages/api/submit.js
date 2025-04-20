import { scoreQuiz, matchProfileWithWiggleRoom, calculateAttachmentStyle } from '@/data/scoring';
import { supabase } from '@/lib/supabase';
import { profiles } from '@/data/profileDescriptions';

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

    // Step 4: Score the quiz and determine attachment style
    const result = scoreQuiz(responses, gender, trauma);
    const attachment = calculateAttachmentStyle(responses);

    // Step 5: Match profile using full context
    const profileMatch = matchProfileWithWiggleRoom(
      result.fluency,
      result.maturity,
      result.bs,
      attachment.score,
      result.total,
      profiles
    );

    const { profile, flag, topThree: alt_profiles } = profileMatch;

    // Step 6: Save the result to Supabase
    const { data, error } = await supabase
      .from('results')
      .insert([{
        profile,
        flag,
        fluency: result.fluency,
        maturity: result.maturity,
        bs: result.bs,
        total: result.total,
        attachment_score: attachment.score,
        attachment_style: attachment.style,
        alt_profiles
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to save result' });
    }

    const id = data[0].id;

    // Step 7: Redirect to score page by ID
    const redirectUrl = `https://luma-results-v2.vercel.app/score?id=${id}`;
    return res.redirect(302, redirectUrl);
  } catch (err) {
    console.error('Scoring error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
