// userProfileSchema.js

export const userProfileSchema = {
  id: '', // UUID or user ID

  // SECTION 1: Core Details
  name: '',
  pronouns: '',
  birthYear: null,
  location: '', // city or general area
  openTo: [], // [ 'Dating', 'Friendship', etc. ]
  relationshipStyle: '', // 'Monogamous', 'Poly', etc.
  lookingFor: [], // [ 'Women', 'Nonbinary people', etc. ]

  // SECTION 2: Emotional Blueprint
  emotionalBlueprint: {
    whenIFeelSafe: '',
    trustIsEarnedBy: '',
    howIHandleConflict: '',
    softRedFlag: '',
    iveOutgrown: '',
    iStillStruggleWith: '',
    howILove: '',
    northStar: '',
  },

  // SECTION 3: Relational Energy Snapshots
  relationshipHabits: [
    // e.g. "Brings up hard stuff first"
  ],
  whatIWantToBeMetWith: [],
  threeWordsOthersWouldUse: [],
  poeticRedFlag: '',

  // SECTION 4: Quiz Results (Auto-filled)
  attachmentStyle: '',
  profile: '',
  flag: '',
  altProfiles: [
    // { name: 'Sentimental Skeptic', flag: 'lime green' }
  ],
  scores: {
    fluency: 0,
    maturity: 0,
    bs: 0,
    total: 0
  },

  // SECTION 5: Compatibility Filters
  hasKids: false,
  numberOfKids: null,
  openToPartnerWithKids: false,
  maxPartnerKids: null,

  religionIsDealbreaker: false,
  preferredReligions: [],
  religiousVibe: '', // "Practicing", "Spiritual but not religious", etc.

  politicsIsDealbreaker: false,
  politicalAlignment: '',
  politicalNuance: '', // "Only if they’re also respectful..."

  substanceBoundaries: [],
  openToLongDistance: false,
  datingIntentions: [], // ['Dating with intention', 'Emotional connection', etc.]

  // SECTION 6: Visibility & Safety
  visibility: {
    matchRelationshipTypeOnly: true,
    matchGenderPreferencesOnly: true,
    matchSharedFlagsOnly: false,
    publicProfileEnabled: false
  },

  // Meta
  createdAt: '',
  updatedAt: '',
};
