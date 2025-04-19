import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import rawDescriptions from '@/data/profileDescriptions.json';
import ResultCard from '@/components/ResultCard';

// Load profiles cleanly
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
    attachmentScore,
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
    const parsedAttachmentScore = parseInt(attachmentScore, 10) || 0;

    setScores({
      fluency: parsedFluency,
      maturity: parsedMaturity,
      bs: parsedBS,
      total: parsedTotal
    });

    if (attachment) {
      setAttachmentStyle({
        name: attachment,
        score: parsedAttachmentScore
      });
    }

    if (profile) {
      setResolvedProfile(profile);
      console.log('Resolved Profile:', profile);
    } else {
      const fallback = profileDescriptions.fallbacks?.find(f => f.flag === flag);
      setResolvedProfile(fallback?.name || 'Unknown');
    }
  }, [router.isReady, profile, fluency, maturity, bs, total, attachment, attachmentScore]);

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

  return scores && resolvedProfile ? (
    <main className="min-h-screen flex flex-col justify-center items-center px-6 py-12">
      <ResultCard
        profile={resolvedProfile}
        flag={flag}
        scores={scores}
        tagline={tagline}
        description={description}
        attachmentStyle={attachmentStyle?.name}
        attachmentScore={attachmentStyle?.score}
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
