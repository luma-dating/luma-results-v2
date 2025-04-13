import React from 'react';

const flagStyles = {
  "forest green": "bg-green-800 text-white border-green-800",
  "lime green": "bg-lime-500 text-black border-lime-500",
  "sunshine yellow": "bg-yellow-400 text-black border-yellow-400",
  "lemon yellow": "bg-yellow-200 text-black border-yellow-200",
  "orange": "bg-orange-400 text-black border-orange-400",
  "brick red": "bg-red-700 text-white border-red-700",
  "hell boy red": "bg-red-900 text-white border-red-900",
  "neutral": "bg-gray-300 text-black border-gray-300"
};

export default function ResultCard({ profile, flag, scores }) {
  const style = flagStyles[flag] || flagStyles["neutral"];

  return (
    <div className={`p-6 rounded-xl border shadow-xl max-w-2xl mx-auto mt-10 ${style}`}>
      <h1 className="text-3xl font-bold mb-2">{profile}</h1>
      <p className="text-md italic capitalize mb-4">Flag: {flag}</p>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Emotional Fluency:</p>
          <p className="font-semibold">{scores.fluency}</p>
        </div>
        <div>
          <p className="text-gray-600">Relational Maturity:</p>
          <p className="font-semibold">{scores.maturity}</p>
        </div>
        <div>
          <p className="text-gray-600">BS Detection:</p>
          <p className="font-semibold">{scores.bs}</p>
        </div>
        <div>
          <p className="text-gray-600">Total Score:</p>
          <p className="font-semibold">{scores.total}</p>
        </div>
      </div>

      <div className="mt-6">
        <a
          href="https://simpleempathykc.com"
          className="text-sm underline hover:text-blue-700"
        >
          Back to Simple Empathy
        </a>
      </div>
    </div>
  );
}
