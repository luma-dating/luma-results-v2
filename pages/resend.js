import { profiles } from '@/data/profileDescriptions';
import React, { useState } from 'react';
import {
  scoreQuiz,
  calculateAttachmentStyle,
  matchProfileWithWiggleRoom
} from '@/data/scoring';

export default function ResendBuilder() {
  const [formData, setFormData] = useState({});
  const [url, setUrl] = useState('');
  const [csvInput, setCsvInput] = useState('');
  const [gender, setGender] = useState('');

  const handleChange = (e, key) => {
    const val = parseInt(e.target.value, 10) || 0;
    setFormData({ ...formData, [key]: val });
  };

const fillFromCsv = () => {
  const parts = csvInput.split(',').map((v) => parseInt(v.trim(), 10));

  if (parts.length !== 62) {
    console.warn('[Resend] CSV data must be exactly 62 numbers. Got:', parts.length);
    alert('CSV input must contain exactly 62 numbers (5 T/F, 57 Likert)');
    return;
  }

  const filled = {};
  parts.slice(0, 5).forEach((val, i) => filled[`Q${i + 1}`] = val);
  parts.slice(5).forEach((val, i) => filled[`Q${i + 9}`] = val);
  setFormData(filled);
  console.log('[Resend] Filled formData:', filled);
};

const buildUrl = () => {
  try {
    const quizScore = scoreQuiz(formData, gender, false);
    const attachment = calculateAttachmentStyle(formData);
    const result = matchProfileWithWiggleRoom(
      quizScore.raw.fluency,
      quizScore.raw.maturity,
      quizScore.raw.bs,
      attachment.score,
      quizScore.raw.fluency + quizScore.raw.maturity + quizScore.raw.bs,
      profiles
    );

    const topParams =
      result.topThree
        ?.map(
          (p, i) =>
            `alt${i + 1}=${encodeURIComponent(p.name)}&alt${i + 1}Flag=${encodeURIComponent(p.flag)}`
        )
        .join('&') || '';

    const finalUrl = `/result/${encodeURIComponent(result.profile)}?` +
      `fluency=${quizScore.fluency}&maturity=${quizScore.maturity}&bs=${quizScore.bs}` +
      `&total=${quizScore.raw.fluency + quizScore.raw.maturity + quizScore.raw.bs}` +
      `&flag=${encodeURIComponent(result.flag)}` +
      `&attachment=${encodeURIComponent(attachment.style || '')}` +
      `&attachmentScore=${attachment.score || 0}` +
      `&${topParams}`;

    const fullLink = `https://luma-results-v2.vercel.app${finalUrl}`;
    console.log('[Resend] Generated URL:', fullLink);
    setUrl(fullLink);
  } catch (err) {
    console.error('[Resend] Error during URL build:', err);
    alert('Something went wrong building the link. Check the console for clues.');
  }
};


  return (
    <main className="min-h-screen p-6 bg-white">
      <h1 className="text-2xl font-bold mb-4">Resend Results Link Generator</h1>
      <p className="mb-4 text-sm text-gray-500">
        Paste 62 answers. Hit “generate.” Send the link. Wonder where your life went.
      </p>

      <div className="mb-4">
        <textarea
          className="w-full p-2 border rounded mb-2"
          rows={3}
          placeholder="Paste comma-separated values here (e.g. 1,0,1,... Likert)"
          value={csvInput}
          onChange={(e) => setCsvInput(e.target.value)}
        />
        <button
          onClick={fillFromCsv}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
        >
          Fill from CSV
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Gender</label>
        <select
          className="border p-1 w-full"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select gender</option>
          <option value="female">Female</option>
          <option value="non-binary">Non-binary</option>
          <option value="trans female">Trans Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {[...Array(5)].map((_, i) => (
          <div key={`Q${i + 1}`}>
            <label className="block text-sm">Q{i + 1} (T/F)</label>
            <input
              type="number"
              min="0"
              max="1"
              className="border p-1 w-full"
              value={formData[`Q${i + 1}`] || ''}
              onChange={(e) => handleChange(e, `Q${i + 1}`)}
            />
          </div>
        ))}

        {[...Array(57)].map((_, i) => (
          <div key={`Q${i + 9}`}>
            <label className="block text-sm">Q{i + 9}</label>
            <input
              type="number"
              min="1"
              max="7"
              className="border p-1 w-full"
              value={formData[`Q${i + 9}`] || ''}
              onChange={(e) => handleChange(e, `Q${i + 9}`)}
            />
          </div>
        ))}
      </div>

      <button
        onClick={buildUrl}
        className="mt-6 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        Generate Link
      </button>

      {url && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">Copy and send this link:</p>
          <a
            href={url}
            className="text-blue-600 underline break-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            {url}
          </a>
        </div>
      )}
    </main>
  );
}
