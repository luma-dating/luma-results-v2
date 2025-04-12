import { useRouter } from 'next/router'
import ResultCard from '../components/ResultCard'

const mockScores = {
  fluency: 0,
  maturity: 0,
  bs: 0,
  total: 0,
  flag: 'red'
};

export default function ResultPage() {
  const router = useRouter();
  const { profile } = router.query;

  // Mock API fallback (replace with real fetch in production)
  const scores = router.query.flag ? {
    fluency: parseInt(router.query.fluency),
    maturity: parseInt(router.query.maturity),
    bs: parseInt(router.query.bs),
    total: parseInt(router.query.total),
    flag: router.query.flag
  } : mockScores;

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <ResultCard profile={profile} flag={scores.flag} scores={scores} />
    </main>
  )
}
