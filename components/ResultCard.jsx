// components/ResultCard.jsx

import React from 'react';

export default function ResultCard({
  profile,
  flag,
  scores,
  tagline,
  description,
  attachmentStyle,
  attachmentScore,
  topThree
}) {
  return (
    <div className="p-6 border rounded-xl shadow-lg bg-white max-w-xl w-full text-center">
      <h1 className="text-3xl font-bold mb-2">{profile}</h1>
      <p className="text-lg italic mb-4">{tagline}</p>
      <p className="mb-4">{description}</p>

      <div className="mb-4">
        <h3 className="font-semibold">Scores</h3>
        <ul>
          <li>Fluency: {scores.fluency}</li>
          <li>Maturity: {scores.maturity}</li>
          <li>BS: {scores.bs}</li>
          <li>Total: {scores.total}</li>
        </ul>
      </div>

      {attachmentStyle && (
        <div className="mb-4">
          <strong>Attachment Style:</strong> {attachmentStyle} ({attachmentScore})
        </div>
      )}

      {topThree?.length > 0 && (
        <div>
          <h3 className="font-semibold">Top Three Alternatives</h3>
          <ul>
            {topThree.map((alt, idx) => (
              <li key={idx}>{alt.name} {alt.flag && `(${alt.flag})`}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
