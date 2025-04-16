// pages/api/gpt-summary.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Missing prompt in request body' });
  }

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a compassionate therapist who is also a poet. Summarize people with warmth and clarity.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 60,
      }),
    });

    const data = await openaiRes.json();
    const summary = data.choices?.[0]?.message?.content || 'You are a mystery wrapped in potential.';

    return res.status(200).json({ summary });
  } catch (err) {
    console.error('GPT fetch failed:', err);
    return res.status(500).json({ message: 'Failed to fetch summary.' });
  }
}
