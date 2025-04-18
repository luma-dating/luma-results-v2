import React from 'react';
import profileData from '@/data/profileDescriptions.json';

export default function ResultCard({
  profile,
  flag,
  scores,
  tagline,
  description,
  attachmentStyle,
  topThree = [],
}) {
  const profileEntry = profileData.profiles?.[profile];

  const profileDescription =
    profileEntry?.description ||
    description ||
    'No description available.';

  const profileTagline =
    profileEntry?.tagline ||
    tagline ||
    '';

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

  return (
    <section className={`max-w-xl w-full shadow-xl rounded-2xl p-8 ${flagClass} font-body`}>
      <h1 className="text-4xl font-display font-bold mb-4">{profile}</h1>
      <p className="text-lg font-semibold mb-2">
        Flag: <span className="capitalize">{flag}</span>
      </p>

      {flagDescriptionEntry && (
        <p className="italic text-sm mb-4 text-luma-accentText">
          {flagDescriptionEntry.description}
        </p>
      )}

      {profileTagline && (
        <p className="italic text-luma-accentText mb-6">"{profileTagline}"</p>
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
        </div>
      )}

      {profileDescription && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-luma-evergreen">Profile Overview</h2>
          <p className="whitespace-pre-line">{profileDescription}</p>
        </div>
      )}

      {topThree.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-2 text-luma-evergreen">Also vibing with...</h2>
          <ul className="list-disc list-inside space-y-1">
            {topThree.map((alt, index) => (
              <li key={index}>
                <strong>{alt.name}</strong>{' '}
                <span className="text-sm">(Flag: {alt.flag})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10">
        <a
          href="https://www.simpleempathykc.com"
          className="text-luma-skyBlue hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Back to Simple Empathy
        </a>
      </div>
    </section>
  );
}
