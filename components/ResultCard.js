import React from 'react';
import profileData from '@/data/profileDescriptions.json';

export default function ResultCard({ profile, flag, scores, tagline, description, attachmentStyle, topThree = [] }) {
  const profileEntry = profileData.profiles?.[profile];

  const profileDescription =
    profileEntry?.description ||
    description ||
    "No description available.";

  const profileTagline =
    profileEntry?.tagline ||
    tagline ||
    "";

  const flagColors = {
    'forest green': 'bg-green-800 text-white',
    'lime green': 'bg-lime-500 text-black',
    'sunshine yellow': 'bg-yellow-300 text-black',
    'lemon yellow': 'bg-yellow-100 text-black',
    'orange': 'bg-orange-400 text-black',
    'brick red': 'bg-red-700 text-white',
    'hell boy red': 'bg-red-900 text-white'
  };

  const flagDescriptionEntry = profileData.flagDescriptions?.find(
    (f) => f.name.toLowerCase().replace(/\s/g, '') === flag.toLowerCase().replace(/\s/g, '')
  );

  const flagClass = flagColors[flag.toLowerCase()] || 'bg-gray-200 text-black';

  return (
    <section className={`max-w-xl w-full shadow-xl rounded-2xl p-6 ${flagClass}`}>
      <h1 className="text-3xl font-bold mb-2">{profile}</h1>
      <p className="text-lg font-medium mb-2">
        Flag: <span className="capitalize font-semibold">{flag}</span>
      </p>

      {flagDescriptionEntry && (
        <p className="italic text-sm mb-4">{flagDescriptionEntry.description}</p>
      )}

      {profileTagline && (
        <p className="italic text-gray-100 mb-4">"{profileTagline}"</p>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Your Scores</h2>
        <ul className="space-y-1">
          <li>Emotional Fluency: <strong>{scores.fluency}</strong></li>
          <li>Relational Maturity: <strong>{scores.maturity}</strong></li>
          <li>BS Detection: <strong>{scores.bs}</strong></li>
          <li>Total Score: <strong>{scores.total}</strong></li>
        </ul>
      </div>

      {attachmentStyle && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Attachment Style</h2>
          <p>{attachmentStyle}</p>
        </div>
      )}

      {profileDescription && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Profile Overview</h2>
          <p className="whitespace-pre-line">{profileDescription}</p>
        </div>
      )}

      {topThree.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Also vibing with...</h2>
          <ul className="list-disc list-inside space-y-1">
            {topThree.map((alt, index) => (
              <li key={index}>
                <strong>{alt.name}</strong> <span className="text-sm">(Flag: {alt.flag})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10">
        <Link href="https://www.simpleempathykc.com" className="text-blue-100 hover:underline" target="_blank" rel="noopener noreferrer">
  Back to Simple Empathy
</Link>
      </div>
    </section>
  );
}
