// lib/scoring.js

import attachmentProfiles from '@/data/attachmentProfiles';

export function calculateAttachmentStyle(qs = []) {
  if (!Array.isArray(qs) || qs.length !== 6) return null;

  const total = qs.reduce((sum, val) => sum + (parseInt(val, 10) || 0), 0);

  return attachmentProfiles.find(({ range }) => total >= range[0] && total <= range[1]) || null;
}

// Example usage:
// const style = calculateAttachmentStyle([5, 4, 6, 5, 6, 5]);
// console.log(style.name);
