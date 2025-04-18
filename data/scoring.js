// data/scoring.js

export function calculateAttachmentStyle(qs = []) {
  if (!Array.isArray(qs) || qs.length !== 6) return null;
  const total = qs.reduce((sum, val) => sum + (parseInt(val, 10) || 0), 0);
  return { score: total }; // placeholder logic, adjust to match your actual style calculation
}

export function scoreQuiz(responses = {}, gender = '', trauma = false) {
  let fluency = 0;
  let maturity = 0;
  let bs = 0;

  const attachment = {
    secure: 0,
    anxious: 0,
    avoidant: 0,
    disorganized: 0
  };

  // This is where your real logic goes
  // You can simplify or copy from your current implementation

  const total = fluency + maturity + bs;
  const attachmentStyle = 'anxious'; // placeholder result

  return { fluency, maturity, bs, total, attachmentStyle };
}

export function matchProfileWithWiggleRoom(fluency, maturity, bs, attachmentScore = 0, total = 0) {
  // Placeholder logic – replace with actual matching rules
  return {
    profile: 'The Curious Explorer',
    flag: 'lime green',
    topThree: [
      { name: 'The Curious Explorer', flag: 'lime green' },
      { name: 'The Soft Void', flag: 'brick red' },
      { name: 'Mystery Human', flag: 'gray' }
    ]
  };
}
