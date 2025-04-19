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
      const fallback = profileDescriptions.fallbacks?.find(f => f
