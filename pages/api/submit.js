export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;

    const answers = Array.from({ length: 72 }, (_, i) => {
      const key = `Q${i + 1}`;
      return parseInt(data[key], 10);
    });

    const reverseIndexes = [
      2, 4, 7, 10, 12, 14, 18, 19, 20, 21,
      24, 26, 29, 31, 33, 34, 35, 37, 38, 39,
      40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
      50, 51, 52, 53, 54, 55, 56, 57, 58, 60,
      61, 62, 63, 64, 65, 66, 67, 68, 71
    ];

    const reverseScore = (value) => 8 - value;
    const scoredAnswers = answers.map((val, i) =>
      reverseIndexes.includes(i) ? reverseScore(val) : val
    );

    const sum = (arr) => arr.reduce((a, b) => a + b, 0);
    const fluency = sum(scoredAnswers.slice(0, 24));
    const maturity = sum(scoredAnswers.slice(24, 48));
    const bs = sum(scoredAnswers.slice(48, 72));
    const total = fluency + maturity + bs;

    let flag = 'red';
    if (total >= 390 && fluency >= 130 && maturity >= 130 && bs >= 130) flag = 'green';
    else if (total >= 300 && fluency >= 100 && maturity >= 100 && bs >= 100) flag = 'yellow';

    function getProfile(f, m, b) {
      if (f > 130 && m > 130 && b > 130) return 'Steady Flame';
      if (f > 135 && m < 110 && b > 130) return 'Soft Talker, Hard Avoider';
      if (f > 120 && m < 110 && b < 110) return 'Self-Aware Tornado';
      if (f < 100 && m < 100 && b < 100) return 'Ghost of Relationships Past';
      if (m < 120 && b < 120 && f >= 100 && f < 130) return 'Fix-Me Pick-Me';
      return 'Disorganized Seeker';
    }

    const profile = getProfile(fluency, maturity, bs);

    return res.status(200).json({
      profile,
      flag,
      fluency,
      maturity,
      bs,
      total
    });
  } catch (err) {
    console.error('Scoring error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
