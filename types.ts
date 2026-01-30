
export enum LearningMode {
  FREE_CONVERSATION = 'Free Conversation',
  TOEFL_IBT = 'TOEFL iBT Practice',
  IELTS = 'IELTS Practice',
  DUOLINGO = 'Interactive Exercises'
}

export enum VoiceStyle {
  SLOW = 'Slow (Beginner)',
  PAKISTANI = 'Asian (Pakistani)',
  NEUTRAL = 'Neutral (Clear)',
  UK = 'Fluent UK',
  USA = 'Fluent USA'
}

export enum AvatarGender {
  FEMALE = 'Female',
  MALE = 'Male'
}

export enum AvatarAge {
  YOUNG_ADULT = 'Young Adult',
  ADULT = 'Adult',
  MATURE = 'Mature'
}

export interface Correction {
  original: string;
  corrected: string;
  explanation: string;
  naturalAlternative: string;
}

export interface ConversationTurn {
  id: string;
  userText: string;
  aiResponse: string;
  corrections: Correction[];
  timestamp: number;
}
