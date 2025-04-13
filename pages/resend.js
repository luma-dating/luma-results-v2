import { useState } from 'react';

export default function ResendBuilder() {
  const [formData, setFormData] = useState({});
  const [url, setUrl] = useState('');

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

  return (
    <main className="min-h-screen p-6 bg-white">
      <h1 className="text-2xl font-bold mb-4">Resend Results Link Generator</h1>
      <p className="mb-4 text-sm text-gray-500">Enter response values (1–7) for each question. You don’t have to fill out all 72 — just the ones you have.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {Array.from({ length: 72 }).map((_, i) => (
          <div key={i}>
            <label className="block text-sm">Q{i + 1}</label>
            <input
              type="number"
              min="1"
              max="7"
              className="border p-1 w-full"
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
