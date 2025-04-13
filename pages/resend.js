import { useState } from 'react';

export default function ResendBuilder() {
  const [formData, setFormData] = useState({});
  const [url, setUrl] = useState('');
  const [csvInput, setCsvInput] = useState('');

  const handleChange = (e, i) => {
    const val = parseInt(e.target.value, 10) || 0;
    setFormData({ ...formData, [`Q${i + 1}`]: val });
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
      if (i < 72) filled[`Q${i + 1}`] = val;
    });
    setFormData(filled);
  };

  const loadPreset = (preset) => {
    const profiles = {
      flame: Array(72).fill(6),
      tornado: [...Array(24).fill(7), ...Array(24).fill(4), ...Array(24).fill(3)],
      flirt: [...Array(24).fill(7), ...Array(24).fill(4), ...Array(24).fill(2)],
      empath: [...Array(24).fill(6), ...Array(24).fill(2), ...Array(24).fill(5)],
      figuring: Array(72).fill(3)
    };
    const selected = profiles[preset] || [];
    const filled = {};
    selected.forEach((val, i) => {
      filled[`Q${i + 1}`] = val;
    });
    setFormData(filled);
  };

  return (
    <main className="min-h-screen p-6 bg-white">
      <h1 className="text-2xl font-bold mb-4">Resend Results Link Generator</h1>
      <p className="mb-4 text-sm text-gray-500">Enter or paste responses below. You don’t have to fill out all 72 — just the ones you have.</p>

      <div className="mb-4">
        <textarea
          className="w-full p-2 border rounded mb-2"
          rows={3}
          placeholder="Paste 72 comma-separated values here (e.g. 5,6,7,4,...)"
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

      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => loadPreset('flame')} className="bg-green-600 text-white px-3 py-1 rounded">Steady Flame</button>
        <button onClick={() => loadPreset('tornado')} className="bg-yellow-500 text-white px-3 py-1 rounded">Self-Aware Tornado</button>
        <button onClick={() => loadPreset('flirt')} className="bg-pink-500 text-white px-3 py-1 rounded">Boundary Flirt</button>
        <button onClick={() => loadPreset('empath')} className="bg-red-400 text-white px-3 py-1 rounded">Burnt Empath</button>
        <button onClick={() => loadPreset('figuring')} className="bg-gray-600 text-white px-3 py-1 rounded">Still Figuring It Out</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {Array.from({ length: 72 }).map((_, i) => (
          <div key={i}>
            <label className="block text-sm">Q{i + 1}</label>
            <input
              type="number"
              min="1"
              max="7"
              className="border p-1 w-full"
              value={formData[`Q${i + 1}`] || ''}
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
