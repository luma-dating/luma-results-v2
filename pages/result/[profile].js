import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
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
    if (!router.isReady || !fluency || !maturity || !bs || !total) return;

    const fluencyInt = parseInt(fluency, 10);
    const maturityInt = parseInt(maturity, 10);
    const bsInt = parseInt(bs, 10);
    const totalInt = parseInt(total, 10);

    setScores({
      fluency: fluencyInt,
      maturity: maturityInt,
      bs: bsInt,
      total: totalInt
    });

    if (attachment) {
      setAttachmentStyle(attachment);
    } else {
      const attValues = [...Array(6)].map((_, i) => {
        const index = 13 + i;
        const raw = parseInt(router.query[`Q${index}`] || 0, 10);
        const reverseIndexes = [13, 16, 18];
        const isReversed = reverseIndexes.includes(index);
        return isReversed ? Math.round((8 - raw) * 0.85) : raw;
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

  return scores && resolvedProfile ? (
    <main className="min-h-screen flex flex-col justify-center items-center px-6 py-12">
      <ResultCard
        profile={resolvedProfile}
        flag={flag}
        scores={scores}
        tagline={tagline}
        description={description}
        attachmentStyle={attachmentStyle}
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
