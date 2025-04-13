import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import profileDescriptions from '@/data/profileDescriptions';
import ResultCard from '@/components/ResultCard';

export default function ProfileResult() {
  const router = useRouter();
  const [scores, setScores] = useState(null);

  const { profile, fluency, maturity, bs, total, flag } = router.query;

  useEffect(() => {
    if (!router.isReady || !profile) return;

    setScores({
      fluency: parseInt(fluency || 0, 10),
      maturity: parseInt(maturity || 0, 10),
      bs: parseInt(bs || 0, 10),
      total: parseInt(total || 0, 10)
    });
  }, [router.isReady, profile, fluency, maturity, bs, total]);

  if (!scores || !profileDescriptions[profile]) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h2 className="text-xl">Loading your result...</h2>
        <p className="text-gray-500 text-sm">Please wait just a sec.</p>
      </div>
    );
  }

  const { tagline, description } = profileDescriptions[profile];

  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-6 py-12">
      <ResultCard
        profile={profile}
        flag={flag}
        scores={scores}
        tagline={tagline}
        description={description}
      />
    </main>
  );
}
