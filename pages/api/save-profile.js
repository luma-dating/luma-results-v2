// /pages/api/save-profile.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const profile = req.body;

    // In a real app, you'd store this in a database.
    // For now, we'll simulate a save with a simple log.
    console.log('Saving profile:', profile);

    // Simulate a delay for realism
    await new Promise((resolve) => setTimeout(resolve, 800));

    res.status(200).json({ message: 'Profile saved successfully!' });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
}
