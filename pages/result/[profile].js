import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import rawDescriptions from '@/data/profileDescriptions.json';

const profileDescriptions = typeof rawDescriptions?.default === 'object'
  ? rawDescriptions.default
  : rawDescriptions;

import ResultCard from '@/components/ResultCard';

export default function ProfileResult() {
  const router = useRouter();
  const [scores, setScores] = useState(null);
  const [attachmentStyle, setAttachmentStyle] = useState(null);

  const {
    profile,
    flag,
    fluency,
    maturity,
    bs,
    total,
    alt1,
    alt1Flag,
    alt2,
    alt2Flag,
    alt3,
    alt3Flag
  } = router.query;

  useEffect(() => {
    if (!router.isReady || !profile || !fluency || !maturity || !bs || !total) return;

    setScores({
      fluency: parseInt(fluency, 10),
      maturity: parseInt(maturity, 10),
      bs: parseInt(bs, 10),
      total: parseInt(total, 10)
    });

    const attScore = [...Array(6)]
      .map((_, i) => parseInt(router.query[`Q${13 + i}`] || 0, 10))
      .reduce((a, b) => a + b, 0);

    const style = profileDescriptions.attachmentStyles?.find((style) => style?.range && attScore >= style.range[0] && attScore <= style.range[1]
    );

    if (style) setAttachmentStyle(style.name);
  }, [router.isReady, profile, fluency, maturity, bs, total]);

  const topThree = [
    alt1 && { name: alt1, flag: alt1Flag },
    alt2 && { name: alt2, flag: alt2Flag },
    alt3 && { name: alt3, flag: alt3Flag }
  ].filter(Boolean);

  if (!scores || !profile) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold">Loading your result...</h2>
        <p className="text-gray-500">Please wait just a sec.</p>
      </main>
    );
  }

  const profileData = profileDescriptions.profiles?.[profile];
const fallback = {
  tagline: 'You defy classification.',
  description: 'Your results don’t fit a tidy box, and that’s not a bug—it’s a feature.'
};

const description = profileData?.description || fallback.description;
const tagline = profileData?.tagline || fallback.tagline;

  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-6 py-12">
      <ResultCard
        profile={profile}
        flag={flag}
        scores={scores}
        tagline={tagline}
        description={description}
        attachmentStyle={attachmentStyle}
        topThree={topThree}
      />
    </main>
  );
}
