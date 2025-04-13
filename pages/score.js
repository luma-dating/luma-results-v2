import { useEffect } from 'react';
import { useRouter } from 'next/router';

const profiles = [
  // Green / Greenish
  { name: 'Steady Flame', target: { fluency: 120, maturity: 105, bs: 120 }, baseFlag: 'green', useGTE: true },
  { name: 'Emotionally Ambidextrous', target: { fluency: 115, maturity: 100, bs: 115 }, baseFlag: 'green' },
  { name: 'Hopeful Realist', target: { fluency: 105, maturity: 105, bs: 110 }, baseFlag: 'green' },
  { name: 'Gentle Challenger', target: { fluency: 110, maturity: 100, bs: 100 }, baseFlag: 'green' },
  { name: 'Warm Cynic', target: { fluency: 95, maturity: 105, bs: 130 }, baseFlag: 'green' },
  { name: 'Quiet Flame', target: { fluency: 100, maturity: 110, bs: 105 }, baseFlag: 'green' },
  { name: 'Grounded Dreamer', target: { fluency: 110, maturity: 95, bs: 110 }, baseFlag: 'green' },
  { name: 'Earnest Explorer', target: { fluency: 100, maturity: 100, bs: 100 }, baseFlag: 'green' },

  // Yellow
  { name: 'Self-Aware Tornado', target: { fluency: 125, maturity: 90, bs: 95 }, baseFlag: 'yellow' },
  { name: 'Burnt Empath', target: { fluency: 125, maturity: 80, bs: 130 }, baseFlag: 'yellow' },
  { name: 'Almost Integrated', target: { fluency: 110, maturity: 90, bs: 110 }, baseFlag: 'yellow' },
  { name: 'Disorganized Seeker', target: { fluency: 110, maturity: 90, bs: 135 }, baseFlag: 'yellow' },
  { name: 'Hard-Learned Lover', target: { fluency: 105, maturity: 85, bs: 120 }, baseFlag: 'yellow' },
  { name: 'Introspective Firecracker', target: { fluency: 115, maturity: 85, bs: 100 }, baseFlag: 'yellow' },
  { name: 'Soft Talker, Hard Avoider', target: { fluency: 130, maturity: 80, bs: 120 }, baseFlag: 'yellow', useGTE: true },
  { name: 'Boundary Flirt', target: { fluency: 125, maturity: 90, bs: 85 }, baseFlag: 'yellow' },

  // Neutral
  { name: 'Fix-Me Pick-Me', target: { fluency: 115, maturity: 65, bs: 100 }, baseFlag: 'neutral' },
  { name: 'Overfunctioning Mystic', target: { fluency: 130, maturity: 80, bs: 85 }, baseFlag: 'neutral' },
  { name: 'Still Figuring It Out', target: { fluency: 90, maturity: 80, bs: 110 }, baseFlag: 'neutral' },
  { name: 'Curious-but-Cautious', target: { fluency: 95, maturity: 85, bs: 100 }, baseFlag: 'neutral' },
  { name: 'Boundary Newbie', target: { fluency: 90, maturity: 75, bs: 95 }, baseFlag: 'neutral' },
  { name: 'Nervous Negotiator', target: { fluency: 100, maturity: 80, bs: 85 }, baseFlag: 'neutral' },
  { name: 'Silent Integrator', target: { fluency: 105, maturity: 85, bs: 90 }, baseFlag: 'neutral' },
  { name: 'Earnest Mirror', target: { fluency: 110, maturity: 80, bs: 100 }, baseFlag: 'neutral' },

  // Red
  { name: 'Performer in Disguise', target: { fluency: 95, maturity: 60, bs: 90 }, baseFlag: 'red' },
  { name: 'Emotional Escape Artist', target: { fluency: 85, maturity: 70, bs: 100 }, baseFlag: 'red' },
  { name: 'Charm and Dodge', target: { fluency: 100, maturity: 60, bs: 85 }, baseFlag: 'red' },
  { name: 'Tornado with Teeth', target: { fluency: 110, maturity: 65, bs: 70 }, baseFlag: 'red' },
  { name: 'Boundary Bulldozer', target: { fluency: 90, maturity: 60, bs: 95 }, baseFlag: 'red' },
  { name: 'Gaslight-and-Grow', target: { fluency: 105, maturity: 50, bs: 90 }, baseFlag: 'red' },
  { name: 'Red Flag Romantic', target: { fluency: 100, maturity: 55, bs: 80 }, baseFlag: 'red' },
  { name: 'The Shape-Shifter', target: { fluency: 90, maturity: 50, bs: 85 }, baseFlag: 'red' }
];
