// pages/api/save-profile.js

import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const profile = req.body;

    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          name: profile.name || '',
          pronouns: profile.pronouns || '',
          birth_year: profile.birthYear || null,
          location: profile.location || '',
          relationship_style: profile.relationshipStyle || '',
          looking_for: profile.lookingFor || [],
          open_to: profile.datingIntentions || [],
          profile_json: profile
        }
      ]);

    if (error) {
      console.error('❌ Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to save profile' });
    }

    return res.status(200).json({ message: '✅ Profile saved!', data });
  } catch (err) {
    console.error('🔥 Save handler error:', err);
    return res.status(500).json({ error: 'Unexpected error while saving profile' });
  }
}
