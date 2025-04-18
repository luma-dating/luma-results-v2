import { scoreQuiz, matchProfileWithWiggleRoom } from '@/data/scoring';
import rawQuestions from '@/data/questions';

const questions = Array.isArray(rawQuestions.default)
  ? rawQuestions.default
  : rawQuestions;


const mockResponses = {
  Q9: 5, Q10: 4, Q11: 2, Q12: 3, Q13: 2, Q14: 4, Q15: 3, Q16: 5,
  Q17: 4, Q18: 5, Q19: 4, Q20: 5, Q21: 3, Q22: 4, Q23: 5, Q24: 2,
  Q25: 1, Q26: 3, Q27: 4, Q28: 5, Q29: 4, Q30: 5, Q31: 4, Q32: 2,
  Q33: 5, Q34: 2, Q35: 5, Q36: 1, Q37: 4, Q38: 3, Q39: 4, Q40: 4,
  Q41: 2, Q42: 5, Q43: 3, Q44: 4, Q45: 2, Q46: 3, Q47: 2, Q48: 5,
  Q49: 1, Q50: 1, Q51: 2, Q52: 2, Q53: 1, Q54: 2, Q55: 2, Q56: 3,
  Q57: 2, Q58: 3, Q59: 3, Q60: 2, Q61: 1, Q62: 2, Q63: 2, Q64: 3,
  Q65: 2
};

describe('Scoring System', () => {
  it('should return valid score object with attachment style', () => {
    const result = scoreQuiz(mockResponses, 'female', true);

    expect(result).toHaveProperty('fluency');
    expect(result).toHaveProperty('maturity');
    expect(result).toHaveProperty('bs');
    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('attachmentStyle');

    console.log('Scoring result:', result);
  });

  it('should match a profile from scored results', () => {
    const result = scoreQuiz(mockResponses, 'female', true);
    const matched = matchProfileWithWiggleRoom(
      result.fluency,
      result.maturity,
      result.bs,
      25,
      result.total
    );

    expect(matched).toHaveProperty('profile');
    expect(matched).toHaveProperty('flag');
    expect(matched.topThree).toBeInstanceOf(Array);

    console.log('Matched profile:', matched);
  });
});
