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

  const handleSnapshotChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Build Your Profile</h1>
      <p className="text-gray-600 mb-6">Step {step + 1} of {steps.length}: <strong>{steps[step]}</strong></p>

      {step === 0 && (
        <div className="space-y-4">
          {/* Core Details Inputs */}
          {/* ... */}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          {/* Emotional Blueprint Inputs */}
          {/* ... */}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          {/* Relational Energy Snapshots */}
          {/* ... */}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="block font-medium">Do you have kids?</label>
            <select className="w-full border rounded px-3 py-2" value={profile.hasKids ? 'yes' : 'no'} onChange={(e) => handleCompatibilityChange('hasKids', e.target.value === 'yes')}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          {profile.hasKids && (
            <div>
              <label className="block font-medium">Number of kids</label>
              <input type="number" className="w-full border rounded px-3 py-2" value={profile.numberOfKids || ''} onChange={(e) => handleCompatibilityChange('numberOfKids', parseInt(e.target.value, 10))} />
            </div>
          )}

          <div>
            <label className="block font-medium">Are you open to dating someone with kids?</label>
            <select className="w-full border rounded px-3 py-2" value={profile.openToPartnerWithKids ? 'yes' : 'no'} onChange={(e) => handleCompatibilityChange('openToPartnerWithKids', e.target.value === 'yes')}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Maximum number of kids you're open to</label>
            <select className="w-full border rounded px-3 py-2" value={profile.maxPartnerKids || ''} onChange={(e) => handleCompatibilityChange('maxPartnerKids', parseInt(e.target.value, 10))}>
              <option value="">Select...</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Is religion a dealbreaker for you?</label>
            <select className="w-full border rounded px-3 py-2" value={profile.religionIsDealbreaker ? 'yes' : 'no'} onChange={(e) => handleCompatibilityChange('religionIsDealbreaker', e.target.value === 'yes')}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          {profile.religionIsDealbreaker && (
            <>
              <div>
                <label className="block font-medium">Preferred religion(s)</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={profile.preferredReligions.join(', ')} onChange={(e) => handleCompatibilityChange('preferredReligions', e.target.value.split(',').map(s => s.trim()))} />
              </div>
              <div>
                <label className="block font-medium">Religious vibe preference</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={profile.religiousVibe} onChange={(e) => handleCompatibilityChange('religiousVibe', e.target.value)} />
              </div>
            </>
          )}

          <div>
            <label className="block font-medium">Is politics a dealbreaker for you?</label>
            <select className="w-full border rounded px-3 py-2" value={profile.politicsIsDealbreaker ? 'yes' : 'no'} onChange={(e) => handleCompatibilityChange('politicsIsDealbreaker', e.target.value === 'yes')}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          {profile.politicsIsDealbreaker && (
            <>
              <div>
                <label className="block font-medium">Political alignment</label>
                <select className="w-full border rounded px-3 py-2" value={profile.politicalAlignment} onChange={(e) => handleCompatibilityChange('politicalAlignment', e.target.value)}>
                  <option value="">Select...</option>
                  <option value="Progressive">Progressive / Left</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Conservative">Conservative / Right</option>
                  <option value="Nuanced">Doesn’t fit a label</option>
                  <option value="Not political">Not political</option>
                </select>
              </div>
              <div>
                <label className="block font-medium">I could date someone with different politics if...</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={profile.politicalNuance} onChange={(e) => handleCompatibilityChange('politicalNuance', e.target.value)} />
              </div>
            </>
          )}

          <div>
            <label className="block font-medium">Substances I’m not okay with in a partner:</label>
            <input type="text" className="w-full border rounded px-3 py-2" placeholder="e.g., Alcohol, Weed, Psychedelics" value={profile.substanceBoundaries.join(', ')} onChange={(e) => handleCompatibilityChange('substanceBoundaries', e.target.value.split(',').map(s => s.trim()))} />
          </div>

          <div>
            <label className="block font-medium">Open to long distance?</label>
            <select className="w-full border rounded px-3 py-2" value={profile.openToLongDistance ? 'yes' : 'no'} onChange={(e) => handleCompatibilityChange('openToLongDistance', e.target.value === 'yes')}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Dating intentions</label>
            <input type="text" className="w-full border rounded px-3 py-2" placeholder="e.g., Dating with intention, Emotional connection" value={profile.datingIntentions.join(', ')} onChange={(e) => handleCompatibilityChange('datingIntentions', e.target.value.split(',').map(s => s.trim()))} />
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button disabled={step === 0} onClick={handleBack} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Back</button>
        <button onClick={handleNext} className="px-4 py-2 bg-blue-600 text-white rounded">{step === steps.length - 1 ? 'Finish' : 'Next'}</button>
      </div>
    </div>
    )}

    {step === 4 && (
        <div className="space-y-4">
          <div>
            <label className="block font-medium">Only show my profile to people with compatible relationship styles</label>
            <select className="w-full border rounded px-3 py-2" value={profile.visibility.matchRelationshipTypeOnly ? 'yes' : 'no'} onChange={(e) => handleVisibilityChange('matchRelationshipTypeOnly', e.target.value === 'yes')}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Only show my profile to people who are open to my gender</label>
            <select className="w-full border rounded px-3 py-2" value={profile.visibility.matchGenderPreferencesOnly ? 'yes' : 'no'} onChange={(e) => handleVisibilityChange('matchGenderPreferencesOnly', e.target.value === 'yes')}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Only show me to people who share at least 2 of my emotional flags</label>
            <select className="w-full border rounded px-3 py-2" value={profile.visibility.matchSharedFlagsOnly ? 'yes' : 'no'} onChange={(e) => handleVisibilityChange('matchSharedFlagsOnly', e.target.value === 'yes')}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Enable public link to my profile</label>
            <select className="w-full border rounded px-3 py-2" value={profile.visibility.publicProfileEnabled ? 'yes' : 'no'} onChange={(e) => handleVisibilityChange('publicProfileEnabled', e.target.value === 'yes')}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button disabled={step === 0} onClick={handleBack} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Back</button>
        <button onClick={handleNext} className="px-4 py-2 bg-blue-600 text-white rounded">{step === steps.length - 1 ? 'Finish' : 'Next'}</button>
      </div>
    </div>
)}

      {step === 5 && (
        <div className="space-y-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold">Review Your Profile</h2>
          <pre className="bg-white border text-sm rounded p-4 overflow-auto">
            {JSON.stringify(profile, null, 2)}
          </pre>
          <p className="text-sm text-gray-500 italic">(This is a preview of your full profile as it will be saved. You’ll be able to edit later.)</p>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button disabled={step === 0} onClick={handleBack} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Back</button>
        <button onClick={handleNext} className="px-4 py-2 bg-blue-600 text-white rounded">{step === steps.length - 1 ? 'Finish' : 'Next'}</button>
      </div>
    </div>
  );
}
