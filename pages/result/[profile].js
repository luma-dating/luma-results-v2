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
    attachment,
    alt1,
    alt2,
    alt3
  } = router.query;

  const [scores, setScores] = useState(null);

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
    <main className="min-h-screen flex flex-col justify-center items-center px-6 py-12 space-y-8">
      <ResultCard
        profile={profile}
        flag={flag}
        scores={scores}
        tagline={tagline}
        description={description}
      />

      {attachment && (
        <div className="text-center max-w-xl">
          <h3 className="text-lg font-semibold mt-6">Attachment Style</h3>
          <p className="text-gray-600">You may lean toward: <span className="font-medium text-black">{attachment}</span></p>
        </div>
      )}

      {(alt1 || alt2 || alt3) && (
        <div className="text-center max-w-xl mt-8">
          <h3 className="text-lg font-semibold">Other patterns you resonate with:</h3>
          <ul className="list-disc list-inside text-left space-y-1 mt-2">
            {alt1 && <li><span className="font-medium">{alt1}</span></li>}
            {alt2 && <li><span className="font-medium">{alt2}</span></li>}
            {alt3 && <li><span className="font-medium">{alt3}</span></li>}
          </ul>
        </div>
      )}
    </main>
  );
}
