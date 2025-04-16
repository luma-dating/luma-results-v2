import React from 'react';

export default function ProfilePreviewCard({ profile }) {
  if (!profile) return null;

  // 🎨 Flag-to-color themes
  const themeMap = {
    'forest green': {
      bg: 'bg-[#3E6B2F]',
      text: 'text-white',
      border: 'border-[#2C4D22]'
    },
    'lime green': {
      bg: 'bg-[#A4DE02]',
      text: 'text-[#2F2F2F]',
      border: 'border-[#89C702]'
    },
    'sunshine yellow': {
      bg: 'bg-[#F9D923]',
      text: 'text-[#2F2F2F]',
      border: 'border-[#F4C300]'
    },
    'hell boy red': {
      bg: 'bg-[#A10D0D]',
      text: 'text-white',
      border: 'border-[#6E0808]'
    },
    'brick red': {
      bg: 'bg-[#B33F3F]',
      text: 'text-white',
      border: 'border-[#8A2C2C]'
    },
    'orange': {
      bg: 'bg-[#F68C1F]',
      text: 'text-[#2F2F2F]',
      border: 'border-[#DA7815]'
    }
  };

  const theme = themeMap[profile.flag] || {
    bg: 'bg-gray-200',
    text: 'text-black',
    border: 'border-gray-400'
  };

  return (
    <div className={`rounded-2xl p-6 shadow-md border ${theme.bg} ${theme.text} ${theme.border} transition-all`}>
      <h2 className="text-xl font-semibold mb-2">Live Preview</h2>

      <div className="mb-4">
        <span className="text-sm uppercase tracking-wide font-semibold">Archetype</span>
        <p className="text-2xl font-bold mt-1">{profile.profile || 'Unknown Hero'}</p>
        <p className="italic text-sm opacity-90 mt-1">Flag: {profile.flag || '???'}</p>
      </div>

      <div className="mb-4">
        <span className="text-sm uppercase tracking-wide font-semibold">Attachment Style</span>
        <p className="mt-1 text-base">{profile.attachmentStyle || 'Not specified'}</p>
      </div>

      <div className="mb-4">
        <span className="text-sm uppercase tracking-wide font-semibold">How I love</span>
        <p className="mt-1 text-base italic">
          {profile.emotionalBlueprint?.howILove || '...still finding the words'}
        </p>
      </div>

      <div className="mb-4">
        <span className="text-sm uppercase tracking-wide font-semibold">Self-Reflection</span>
        <p className="mt-1 text-base">
          {profile.selfReflection || 'Nothing added yet — but it’s going to be beautiful.'}
        </p>
      </div>

      <div className="mt-6 text-xs opacity-70">
        Draft last updated: {new Date(profile.updatedAt).toLocaleString()}
      </div>
    </div>
  );
}
