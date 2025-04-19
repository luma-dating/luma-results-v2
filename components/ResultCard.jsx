import React from 'react';
import profileData from '@/data/profileDescriptions.json';

export default function ResultCard({
  profile,
  flag,
  scores,
  tagline,
  description,
  attachmentStyle,
  attachmentScore,
  topThree = [],
}) {
  const normalizedProfile = profile?.toLowerCase();
  const profileEntry = profileData.profiles.find(
    (p) => p.name.toLowerCase() === normalizedProfile
  );

  const profileName = profileEntry?.name || profile || 'Mystery Human';
  const profileDescription =
    profileEntry?.description || description || 'No description available.';
  const profileTagline =
    profileEntry?.tagline || tagline || 'You defy classification.';

  const flagColors = {
    'forest green': 'bg-luma-evergreen text-white',
    'limegreen': 'bg-luma-lime text-luma-textPrimary',
    'sunshine yellow': 'bg-luma-softYellow text-black',
    'lemon yellow': 'bg-luma-lemon text-black',
    'orange': 'bg-luma-orange text-black',
    'brick red': 'bg-luma-brick text-white',
    'hell boy red': 'bg-luma-redFlag text-white',
  };

  const normalizedFlag = flag?.toLowerCase().replace(/\s+/g, '');
  const colorKey = Object.keys(flagColors).find(
    (key) => key.replace(/\s+/g, '') === normalizedFlag
  );
  const flagClass = flagColors[colorKey] || 'bg-gray-100 text-luma-textPrimary';

  const flagDescriptionEntry = Array.isArray(profileData.flagDescriptions)
    ? profileData.flagDescriptions.find(
        (entry) =>
          entry?.name &&
          flag &&
          entry.name.toLowerCase() === flag.toLowerCase()
      )
    : null;

  return (
    <section className={`max-w-xl w-full shadow-xl rounded-2xl p-8 ${flagClass} font-body`}>
      <h1 className="text-4xl font-display font-bold mb-4">{profileName}</h1>
      <p className="text-lg font-semibold mb-2">
        Flag: <span className="capitalize">{flag}</span>
      </p>

      {flagDescriptionEntry?.description && (
        <p className="italic text-sm mb-4 text-luma-accentText">
          {flagDescriptionEntry.description}
        </p>
      )}

      {profileTagline && (
        <p className="italic text-luma-accentText mb-6">{profileTagline}</p>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-luma-evergreen">Your Scores</h2>
        <ul className="space-y-1">
          <li>Emotional Fluency: <strong>{scores.fluency}</strong></li>
          <li>Relational Maturity: <strong>{scores.maturity}</strong></li>
          <li>BS Detection: <strong>{scores.bs}</strong></li>
          <li>Total Score: <strong>{scores.total}</strong></li>
        </ul>
      </div>

      {attachmentStyle && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-luma-evergreen">Attachment Style</h2>
          <p>{attachmentStyle}</p>
          {typeof attachmentScore === 'number' && (
            <p className="text-sm text-luma-accentText">
              Score: <strong>{attachmentScore}</strong>
            </p>
          )}
        </div>
      )}
    </section>
  );
}
