export default function ResultCard({ profile, flag, scores }) {
  const descriptions = {
    "Steady Flame": "You’re emotionally grounded, accountable, and warm. The partner everyone *says* they want but few are ready for.",
    "Self-Aware Tornado": "You see your stuff. You own it. And sometimes it still wrecks a room.",
    "Ghost of Relationships Past": "Feelings? Discomfort? Can’t relate. You disappear faster than your emotional growth.",
    "Fix-Me Pick-Me": "You lead with wounds disguised as wisdom. You don’t want to be chosen—you want to be rescued.",
    "Soft Talker, Hard Avoider": "You talk boundaries, you post about vulnerability, and you haven’t actually expressed a need since 2019.",
    "Disorganized Seeker": "Love terrifies you. So does being alone. So here you are: yearning, running, texting exes."
  };

  const colors = {
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    red: 'bg-red-100 text-red-700'
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-xl shadow-md bg-white">
      <h2 className="text-3xl font-bold mb-4 text-center">{profile}</h2>
      <p className="mb-6 text-center italic">{descriptions[profile]}</p>

      <div className="flex flex-col gap-3 text-sm">
        <div className={`px-4 py-2 rounded ${colors[flag]}`}>Overall Flag: {flag}</div>
        <div className="flex justify-between"><span>Emotional Fluency:</span><span>{scores.fluency}</span></div>
        <div className="flex justify-between"><span>Relational Maturity:</span><span>{scores.maturity}</span></div>
        <div className="flex justify-between"><span>BS Detection:</span><span>{scores.bs}</span></div>
        <div className="flex justify-between border-t pt-2 mt-2 font-semibold"><span>Total Score:</span><span>{scores.total}</span></div>
      </div>

      <div className="mt-6 text-center">
        <a href="https://simpleempathykc.com" className="text-blue-600 underline">Back to Simple Empathy</a>
      </div>
    </div>
  );
}
