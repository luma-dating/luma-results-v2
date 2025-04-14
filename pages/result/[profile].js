import React from 'react';
import profileData from '@/data/profileDescriptions.json';

export default function ResultCard({ profile, flag, scores, tagline, description, attachmentStyle, topThree = [] }) {
  const flagColors = {
    'forest green': 'bg-green-800 text-white',
    'lime green': 'bg-lime-500 text-black',
    'sunshine yellow': 'bg-yellow-300 text-black',
    'lemon yellow': 'bg-yellow-100 text-black',
    'orange': 'bg-orange-400 text-black',
    'brick red': 'bg-red-700 text-white',
    'hell boy red': 'bg-red-900 text-white'
  };

  const fallback = profileData.fallbacks?.find(f => f.flag === flag);
  const profileEntry = profileData.profiles?.find(p => p.name === profile);
  const profileDescription = profileEntry?.description || fallback?.description || description || "No description available.";
  const profileTagline = profileEntry?.tagline || tagline || "";

  return (
    <div className="max-w-2xl mx-auto text-center p-8 bg-white rounded-2xl shadow-md">
      <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 ${flagColors[flag] || 'bg-gray-200 text-black'}`}>
        {flag.toUpperCase()}
      </div>

      <h1 className="text-3xl font-bold mb-2">{profile}</h1>
      {profileTagline && <h2 className="text-xl text-gray-600 mb-6">{profileTagline}</h2>}

      <p className="text-gray-800 leading-relaxed mb-6 whitespace-pre-wrap">{profileDescription}</p>

      {attachmentStyle && (
        <div className="mt-6">
          <h3 className="font-semibold">Attachment Style:</h3>
          <p className="text-gray-700 italic">{attachmentStyle}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="bg-gray-100 p-4 rounded-xl">
          <p className="text-sm text-gray-500">Emotional Fluency</p>
          <p className="text-xl font-bold">{scores.fluency}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-xl">
          <p className="text-sm text-gray-500">Relational Maturity</p>
          <p className="text-xl font-bold">{scores.maturity}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-xl">
          <p className="text-sm text-gray-500">BS Detection</p>
          <p className="text-xl font-bold">{scores.bs}</p>
        </div>
        <div className="bg-gray-200 p-4 rounded-xl">
          <p className="text-sm text-gray-600">Total Score</p>
          <p className="text-xl font-bold">{scores.total}</p>
        </div>
      </div>

      {topThree.length > 1 && (
        <div className="mt-10 text-left">
          <h3 className="text-lg font-semibold mb-2">Also aligned with:</h3>
          <ul className="space-y-2">
            {topThree.slice(1).map((alt, idx) => (
              <li key={idx} className="pl-3 border-l-4 border-gray-300">
                <span className="font-medium">{alt.name}</span>
                <span className="ml-2 text-sm text-gray-500">(diff: {alt.avgDiff?.toFixed(2) ?? '?'})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
