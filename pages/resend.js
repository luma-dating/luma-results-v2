import React from 'react';
import { useState } from 'react';

export default function ResendBuilder() {
  const [formData, setFormData] = useState({});
  const [url, setUrl] = useState('');
  const [csvInput, setCsvInput] = useState('');

  const handleChange = (e, i) => {
    const val = parseInt(e.target.value, 10) || 0;
    setFormData({ ...formData, [`Q${i + 9}`]: val });
  };

  const buildUrl = () => {
    const query = Object.keys(formData)
      .map((key) => `${key}=${formData[key]}`)
      .join('&');
    setUrl(`https://luma-results-v2.vercel.app/score?${query}`);
  };

  const fillFromCsv = () => {
    const parts = csvInput.split(',').map((v) => parseInt(v.trim(), 10));
    const filled = {};
    parts.forEach((val, i) => {
      if (i < 57) filled[`Q${i + 9}`] = val;
    });
    setFormData(filled);
  };

  return (
    <main className="min-h-screen p-6 bg-white">
      <h1 className="text-2xl font-bold mb-4">Resend Results Link Generator</h1>
      <p className="mb-4 text-sm text-gray-500">
        Enter or paste 57 answers from Q9 onward. You don’t have to fill out all 57 — just the ones you have.
      </p>

      <div className="mb-4">
        <textarea
          className="w-full p-2 border rounded mb-2"
          rows={3}
          placeholder="Paste 57 comma-separated values here (e.g. 5,6,7,4,...)"
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {Array.from({ length: 57 }).map((_, i) => (
          <div key={i}>
            <label className="block text-sm">Q{i + 9}</label>
            <input
              type="number"
              min="1"
              max="7"
              className="border p-1 w-full"
              value={formData[`Q${i + 9}`] || ''}
              onChange={(e) => handleChange(e, i)}
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
