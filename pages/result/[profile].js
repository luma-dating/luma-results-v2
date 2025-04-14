import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import profileDescriptions from '@/data/profileDescriptions.json';
import ResultCard from '@/components/ResultCard';

export default function ProfileResult() {
  const router = useRouter();
  const { profile, flag, fluency, maturity, bs, total, attachmentStyle, alt1, alt1Flag, alt2, alt2Flag, alt3, alt3Flag } = router.query;

  const [ready, setReady] = useState(false);
  const [scores, setScores] = useState(null);

  useEffect(() => {
    if (!router.isReady || !profile) return;

    setScores({
      fluency: parseInt(fluency || 0, 10),
      maturity: parseInt(maturity || 0, 10),
      bs: parseInt(bs || 0, 10),
      total: parseInt(total || 0, 10)
    });

    setReady(true);
  }, [router.isReady, profile, fluency, maturity, bs, total]);

  if (!ready || !scores || !profileDescriptions[profile]) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-center p-10">
        <h2 className="text-xl font-semibold">Loading your result...</h2>
        <p className="text-gray-500 mt-2">Please wait just a sec.</p>
      </main>
    );
  }

  const { tagline, description } = profileDescriptions[profile];

  const altProfiles = [
    { name: alt1, flag: alt1Flag },
    { name: alt2, flag: alt2Flag },
    { name: alt3, flag: alt3Flag }
  ].filter(p => p.name);

  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-6 py-12">
      <ResultCard
        profile={profile}
        flag={flag}
        scores={scores}
        tagline={tagline}
        description={description}
        attachmentStyle={attachmentStyle}
        altProfiles={altProfiles}
      />
    </main>
  );
}
