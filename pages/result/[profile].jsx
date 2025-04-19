import React from 'react'; // <-- Required for JSX
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import rawDescriptions from '@/data/profileDescriptions.json';
import ResultCard from '@/components/ResultCard';


const profileDescriptions = typeof rawDescriptions?.default === 'object'
  ? rawDescriptions.default
  : rawDescriptions;

export default function ProfileResult() {
  const router = useRouter();
  const [scores, setScores] = useState(null);
  const [attachmentStyle, setAttachmentStyle] = useState(null);
  const [resolvedProfile, setResolvedProfile] = useState(null);

  const {
    profile,
    flag,
    fluency,
    maturity,
    bs,
    total,
    attachment,
    alt1,
    alt1Flag,
    alt2,
    alt2Flag,
    alt3,
    alt3Flag
  } = router.query;

  useEffect(() => {
    if (!router.isReady) return;
    if (!fluency || !maturity || !bs || !total) return;

    const parsedFluency = parseInt(fluency, 10) || 0;
    const parsedMaturity = parseInt(maturity, 10) || 0;
    const parsedBS = parseInt(bs, 10) || 0;
    const parsedTotal = parseInt(total, 10) || (parsedFluency + parsedMaturity + parsedBS);
    
    setScores({
      fluency: parsedFluency,
      maturity: parsedMaturity,
      bs: parsedBS,
      total: parsedTotal,
    });

    if (attachment) {
      setAttachmentStyle(attachment);
    } else {
      const reverseIndexes = [13, 16, 18];
      const attValues = [...Array(6)].map((_, i) => {
        const index = 13 + i;
        const raw = parseInt(router.query[`Q${index}`] || '0', 10);
        const isReversed = reverseIndexes.includes(index);
        const final = isReversed ? Math.round((8 - raw) * 0.85) : raw;
        return final;
      });

      const attScore = attValues.reduce((a, b) => a + b, 0);
      const style = profileDescriptions.attachmentStyles?.find(
        (style) => style?.range && attScore >= style.range[0] && attScore <= style.range[1]
      );

      if (style) setAttachmentStyle(style.name);
    }

    if (profile) {
      setResolvedProfile(profile);
    } else {
      const fallback = profileDescriptions.fallbacks?.find(f => f.flag === flag);
      setResolvedProfile(fallback?.name || 'Unknown');
    }
  }, [router.isReady, profile, fluency, maturity, bs, total, attachment]);

  const topThree = [
    alt1 && { name: alt1, flag: alt1Flag },
    alt2 && { name: alt2, flag: alt2Flag },
    alt3 && { name: alt3, flag: alt3Flag }
  ].filter(Boolean);

  const profileData = profileDescriptions.profiles?.find(p => p.name === resolvedProfile);
  const fallback = profileDescriptions.fallbacks?.find(f => f.flag === flag) || {
    tagline: 'You defy classification.',
    description: 'Your results don’t fit a tidy box, and that’s not a bug—it’s a feature.'
  };

  const description = profileData?.description || fallback.description;
  const tagline = profileData?.tagline || fallback.tagline;
  const attachmentScore = parseInt(router.query.attachmentScore, 10) || 0;

  return scores && resolvedProfile ? (
    <main className="min-h-screen flex flex-col justify-center items-center px-6 py-12">
      <ResultCard
        profile={resolvedProfile}
        flag={flag}
        scores={scores}
        tagline={tagline}
        description={description}
        attachmentStyle={attachmentStyle}
        attachmentScore={attachmentScore}
        topThree={topThree}
      />
    </main>
  ) : (
    <main className="min-h-screen flex flex-col items-center justify-center text-center">
      <h2 className="text-xl font-semibold">Loading your result...</h2>
      <p className="text-gray-500">Please wait just a sec.</p>
    </main>
  );
}
