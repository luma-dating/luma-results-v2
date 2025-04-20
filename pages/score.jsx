import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ResultCard from '@/components/ResultCard';

export default function ScorePage() {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      const { id } = router.query;
      if (!id) return;

      const { data, error } = await supabase
        .from('results')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error('Error fetching result:', error);
        setError('Could not find your results.');
        return;
      }

      setResult(data);
      setLoading(false);
    };

    if (router.isReady) fetchResult();
  }, [router.isReady, router.query]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-center p-6">
        <div>
          <h1 className="text-xl font-semibold">Scoring your results...</h1>
          <p className="text-gray-500 mt-2">Hang tight, this won't take long.</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center text-center p-6">
        <div>
          <h1 className="text-xl font-semibold text-red-500">Oops!</h1>
          <p className="text-gray-500 mt-2">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-6 py-12">
      <ResultCard
        profile={result.profile}
        flag={result.flag}
        scores={{
          fluency: result.fluency,
          maturity: result.maturity,
          bs: result.bs,
          total: result.total
        }}
        attachmentStyle={result.attachment_style}
        attachmentScore={result.attachment_score}
        topThree={result.alt_profiles}
        // Add tagline/description if you stored them in Supabase
      />
    </main>
  );
}
