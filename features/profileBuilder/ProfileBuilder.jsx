import React, { useState } from 'react';
import { userProfileSchema } from '@/models/userProfileSchema';

const defaultProfile = JSON.parse(JSON.stringify(userProfileSchema));

defaultProfile.createdAt = new Date().toISOString();
defaultProfile.updatedAt = new Date().toISOString();

const steps = [
  'Core Details',
  'Emotional Blueprint',
  'Relational Energy',
  'Compatibility Filters',
  'Visibility Settings',
  'Review'
];

export default function ProfileBuilder() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState(defaultProfile);

  const handleNext = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString()
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Build Your Profile</h1>
      <p className="text-gray-600 mb-6">Step {step + 1} of {steps.length}: <strong>{steps[step]}</strong></p>

      {step === 0 && (
        <div className="space-y-4">
          <div>
            <label className="block font-medium">Name or Nickname</label>
            <input type="text" className="w-full border rounded px-3 py-2" value={profile.name} onChange={(e) => handleChange('name', e.target.value)} />
          </div>
          <div>
            <label className="block font-medium">Pronouns</label>
            <input type="text" className="w-full border rounded px-3 py-2" value={profile.pronouns} onChange={(e) => handleChange('pronouns', e.target.value)} />
          </div>
          <div>
            <label className="block font-medium">Birth Year</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={profile.birthYear || ''} onChange={(e) => handleChange('birthYear', parseInt(e.target.value, 10))} />
          </div>
          <div>
            <label className="block font-medium">Location</label>
            <input type="text" className="w-full border rounded px-3 py-2" value={profile.location} onChange={(e) => handleChange('location', e.target.value)} />
          </div>
          <div>
            <label className="block font-medium">Open to</label>
            <input type="text" className="w-full border rounded px-3 py-2" placeholder="e.g., Dating, Friendship" value={profile.openTo.join(', ')} onChange={(e) => handleChange('openTo', e.target.value.split(',').map(s => s.trim()))} />
          </div>
          <div>
            <label className="block font-medium">Relationship Style</label>
            <select className="w-full border rounded px-3 py-2" value={profile.relationshipStyle} onChange={(e) => handleChange('relationshipStyle', e.target.value)}>
              <option value="">Select...</option>
              <option value="Monogamous">Monogamous</option>
              <option value="Polyamorous">Polyamorous</option>
              <option value="Consensual Non-Monogamy">Consensual Non-Monogamy</option>
              <option value="Exploring">Exploring / Unsure</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Looking for...</label>
            <input type="text" className="w-full border rounded px-3 py-2" placeholder="e.g., Women, Nonbinary people" value={profile.lookingFor.join(', ')} onChange={(e) => handleChange('lookingFor', e.target.value.split(',').map(s => s.trim()))} />
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button disabled={step === 0} onClick={handleBack} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Back</button>
        <button onClick={handleNext} className="px-4 py-2 bg-blue-600 text-white rounded">{step === steps.length - 1 ? 'Finish' : 'Next'}</button>
      </div>
    </div>
  );
}
