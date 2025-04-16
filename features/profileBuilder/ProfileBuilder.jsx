import React, { useState, useEffect } from 'react';
import { userProfileSchema } from '@/models/userProfileSchema';
import ProfilePreviewCard from './ProfilePreviewCard';

const LOCAL_STORAGE_KEY = 'lumaProfileDraft';

const defaultProfile = (() => {
  const saved = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEY) : null;
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return { ...userProfileSchema };
    }
  }
  return { ...userProfileSchema };
})();

defaultProfile.createdAt = defaultProfile.createdAt || new Date().toISOString();
defaultProfile.updatedAt = new Date().toISOString();

const steps = [
  'Core Details',
  'Emotional Blueprint',
  'Relational Energy',
  'Compatibility Filters',
  'Visibility Settings',
  'Review'
];

const affirmations = [
  "You’re doing a beautiful job articulating who you are.",
  "Your emotional honesty is magnetic.",
  "You're putting words to parts of yourself others only sense.",
  "These preferences help ensure you’re seen fully.",
  "Your boundaries are valid. You’re showing up with clarity.",
  "Look at you building emotional clarity like a damn champion."
];

export default function ProfileBuilder() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState(defaultProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const handleNext = async () => {
    if (step === steps.length - 1) {
      await handleSaveProfile();
    } else {
      setStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString()
    }));
  };

  const handleBlueprintChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      emotionalBlueprint: {
        ...prev.emotionalBlueprint,
        [field]: value
      },
      updatedAt: new Date().toISOString()
    }));
  };

  const handleCompatibilityChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString()
    }));
  };

  const handleVisibilityChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      visibility: {
        ...prev.visibility,
        [field]: value
      },
      updatedAt: new Date().toISOString()
    }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const response = await fetch('/api/save-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (!response.ok) throw new Error('Failed to save');
      setSaveSuccess(true);
    } catch (err) {
      console.error('Save failed:', err);
      alert('Something went wrong while saving your profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">Build Your Profile</h1>
        <p className="text-gray-600 mb-2">
          Step {step + 1} of {steps.length}: <strong>{steps[step]}</strong>
        </p>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-[#A4DE02] h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>

        <p className="text-sm italic text-green-700 mb-6">
          {affirmations[step]}
        </p>

        {step === 0 && (
          <div className="space-y-4">
            <label className="block font-medium">Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={profile.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <label className="block font-medium">When I feel safe, I...</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              value={profile.emotionalBlueprint.whenIFeelSafe || ''}
              onChange={(e) => handleBlueprintChange('whenIFeelSafe', e.target.value)}
            />
            <label className="block font-medium">Attachment nuance</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. I show up as avoidant when I’m overwhelmed but usually secure"
              value={profile.attachmentStyleNotes || ''}
              onChange={(e) => handleChange('attachmentStyleNotes', e.target.value)}
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <label className="block font-medium">Public Profile</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={profile.visibility.publicProfileEnabled ? 'yes' : 'no'}
              onChange={(e) => handleVisibilityChange('publicProfileEnabled', e.target.value === 'yes')}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>

            <div>
              <label className="block font-medium">
                Would you consider someone who doesn’t meet your dealbreakers if they were emotionally exceptional?
              </label>
              <textarea
                className="w-full border rounded px-3 py-2"
                placeholder="Only if they show deep accountability and therapy receipts..."
                value={profile.dealbreakerOverride || ''}
                onChange={(e) => handleChange('dealbreakerOverride', e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold">Review Your Profile</h2>

            <pre className="bg-white border text-sm rounded p-4 overflow-auto">
              {JSON.stringify(profile, null, 2)}
            </pre>

            <div>
              <label className="block font-medium mb-2">
                What are you most proud of sharing in this profile?
              </label>
              <textarea
                className="w-full border rounded px-3 py-2"
                placeholder="Give yourself some love. You did this."
                value={profile.selfReflection || ''}
                onChange={(e) => handleChange('selfReflection', e.target.value)}
              />
            </div>

            <p className="text-sm text-gray-500 italic">
              (This is a preview of your full profile as it will be saved. You’ll be able to edit later.)
            </p>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            disabled={step === 0}
            onClick={handleBack}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {step === steps.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>

      <div>
        <ProfilePreviewCard profile={profile} />
      </div>
    </div>
  );
}
