import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ResultCard from '../../components/ResultCard';

export default function ResultPage() {
  const router = useRouter();
  const { profile, fluency, maturity, bs, total, flag } = router.query;
  const [description, setDescription] = useState(null);

  useEffect(() => {
    if (!profile) return;

    fetch('/data/profileDescriptions.json')
      .then(res => res.json())
      .then(data => {
        const profileData = data[decodeURIComponent(profile)];
        setDescription(profileData);
      });
  }, [profile]);

  const scores = {
    fluency: Number(fluency),
    maturity: Number(maturity),
    bs: Number(bs),
    total: Number(total),
    flag: flag
  };

  return (
    <main className="min-h-screen p-4">
      <ResultCard profile={profile} flag={flag} scores={scores} />
      {description && (
        <div className="mt-6 text-left max-w-xl mx-auto bg-gray-50 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold">{description.tagline}</h2>
          <p className="mt-2 text-gray-700">{description.description}</p>
        </div>
      )}
    </main>
  );
}
