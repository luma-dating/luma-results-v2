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
      </div> //
