import React from 'react';
import profileData from '@/data/profileDescriptions.json';

export default function ResultCard({ profile, flag, scores, tagline, description, attachmentStyle, topThree = [] }) {
 const profileEntry = profileData.profiles?.[profile];

  const profileDescription =
    profileEntry?.description ||
    fallbackEntry?.description ||
    description ||
    "No description available.";

  const profileTagline =
    profileEntry?.tagline ||
    fallbackEntry?.tagline ||
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

  return (
    <section className="max-w-xl w-full bg-white shadow-xl rounded-2xl p-6">
      <h1 className="text-3xl font-bold mb-2">{profile}</h1>
      <p className="text-lg font-medium text-gray-600 mb-4">
        Flag: <span className="capitalize font-semibold">{flag}</span>
      </p>

      {profileTagline && (
        <p className="italic text-gray-500 mb-4">"{profileTagline}"</p>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Your Scores</h2>
        <ul className="text-gray-700 space-y-1">
          <li>Emotional Fluency: <strong>{scores.fluency}</strong></li>
          <li>Relational Maturity: <strong>{scores.maturity}</strong></li>
          <li>BS Detection: <strong>{scores.bs}</strong></li>
          <li>Total Score: <strong>{scores.total}</strong></li>
        </ul>
      </div>

      {attachmentStyle && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Attachment Style</h2>
          <p className="text-gray-700">{attachmentStyle}</p>
        </div>
      )}

      {profileDescription && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Profile Overview</h2>
          <p className="text-gray-700 whitespace-pre-line">{profileDescription}</p>
        </div>
      )}

      {topThree.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Also vibing with...</h2>
          <ul className="list-disc list-inside space-y-1">
            {topThree.map((alt, index) => (
              <li key={index}>
                <strong>{alt.name}</strong> <span className="text-sm text-gray-500">(Flag: {alt.flag})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10">
        <a href="https://www.simpleempathykc.com" className="text-blue-600 hover:underline">
          Back to Simple Empathy
        </a>
      </div>
    </section>
  );
}
