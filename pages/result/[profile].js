import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import profileDescriptions from '@/data/profileDescriptions';
import ResultCard from '@/components/ResultCard';

export default function ProfileResult() {
  const router = useRouter();
  const {
    profile,
    fluency,
    maturity,
    bs,
    total,
    flag,
    alt1,
    alt1Flag,
    alt2,
    alt2Flag,
    alt3,
    alt3Flag,
    attachment
  } = router.query;

  const [scores, setScores] = useState(null);
  const [description, setDescription] = useState('');
  const [tagline, setTagline] = useState('');

  useEffect(() => {
    if (!router.isReady || !profile) return;

    setScores({
      fluency: parseInt(fluency || 0, 10),
      maturity: parseInt(maturity || 0, 10),
      bs: parseInt(bs || 0, 10),
      total: parseInt(total || 0, 10)
    });

    const profileData = profileDescriptions[profile];
    if (profileData) {
      setDescription(profileData.description || '');
      setTagline(profileData.tagline || '');
    }
  }, [router.isReady, profile, fluency, maturity, bs, total]);

  if (!scores || !profileDescriptions[profile]) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-xl font-semibold">Loading your result...</h2>
        <p className="text-gray-500 text-sm">Please wait just a sec.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-6 py-12">
      <ResultCard
        profile={profile}
        flag={flag}
        scores={scores}
        tagline={tagline}
        description={description}
        attachment={attachment}
      />

      {(alt1 || alt2 || alt3) && (
        <div className="mt-8 max-w-lg">
          <h2 className="text-lg font-bold mb-2">You also had chemistry with...</h2>
          <ul className="list-disc list-inside space-y-2">
            {alt1 && (
              <li>
                <strong>{alt1}</strong> <span className="text-sm text-gray-500">(Flag: {alt1Flag})</span>
              </li>
            )}
            {alt2 && (
              <li>
                <strong>{alt2}</strong> <span className="text-sm text-gray-500">(Flag: {alt2Flag})</span>
              </li>
            )}
            {alt3 && (
              <li>
                <strong>{alt3}</strong> <span className="text-sm text-gray-500">(Flag: {alt3Flag})</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </main>
  );
}
