import { useRouter } from 'next/router'
import ResultCard from '../../components/ResultCard'

const mockScores = {
  fluency: 0,
  maturity: 0,
  bs: 0,
  total: 0,
  flag: 'red'
};

export default function ResultPage() {
  const router = useRouter();
  const { profile, fluency, maturity, bs, total, flag } = router.query;

  const scores = fluency ? {
    fluency: parseInt(fluency),
    maturity: parseInt(maturity),
    bs: parseInt(bs),
    total: parseInt(total),
    flag
  } : mockScores;

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <ResultCard profile={profile} flag={scores.flag} scores={scores} />
    </main>
  )
},
{
const profileName = decodeURIComponent(router.query.profile);
const attachmentData = await fetch('/data/attachmentProfiles.json').then(r => r.json());
const { attachment, description } = attachmentData.profiles[profileName];
}
