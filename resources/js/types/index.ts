export type ActiveTab = 
  | 'dashboard'
  | 'exam'
  | 'exam-c1'
  | 'exam-b1'
  | 'exam-a2'
  | 'exam-a1'
  | 'docs-b2'
  | 'docs-schreiben'
  | 'docs-sprechen'
  | 'results'
  | 'vocab'
  | 'grammar'
  | 'schreiben'
  | 'students'
  | 'history'
  | 'profile'
  | 'flashcards'
  | 'grammar-lesson'
  | 'exam-detail'
  | 'create-item'
  | 'leaderboard';

export type VocabStatus = 'learning' | 'mastered' | 'reviewing';

export interface VocabItem {
  id: string;
  word: string;
  article?: string;
  plural?: string;
  pos: string;
  phonetic?: string;
  meaningVi: string;
  exampleDe: string;
  exampleVi: string;
  topic: string;
  status: VocabStatus;
  isFavorite: boolean;
}

export interface GrammarTopic {
  id: string;
  title: string;
  level: string;
  category: string;
  summary: string;
  content?: string;
  rulePoints: string[];
  examples: Array<{ de: string; vi: string }>;
  status: 'completed' | 'in_progress' | 'not_started';
  progress: number;
  score: number;
  badgeLabel: string;
}

export interface ExamModel {
  id: string;
  name: string;
  examCode: string;
  level: string;
  provider?: 'TELC' | 'GOETHE';
  durationMinutes: number;
  totalQuestions: number;
  description: string;
  sections: Array<{ name: string; questionCount: number; duration: string; imageUrl?: string }>;
  targetScore: number;
  passRate: string;
  questions?: any[];
}

export interface Student {
  id: string;
  name: string;
  email: string;
  className: string;
  avatarUrl: string;
  targetScore: number;
  currentScore: number;
  status: string;
  targetExamDate: string;
}

export interface ExamFeedItem {
  id: string;
  studentName: string;
  examCode: string;
  score: number;
  maxScore: number;
  statusText: string;
  timeAgo: string;
  description: string;
  readingScore?: number;
  listeningScore?: number;
  writingScore?: number;
  speakingScore?: number;
}

export interface Question {
  id: number;
  section: string;
  subSection: string;
  type?: 'choice' | 'writing' | 'listening';
  title: string;
  contextText?: string;
  audioUrl?: string;
  imageUrl?: string;
  wordLimit?: number;
  options: Array<{ id: string; text: string }>;
  correctOptionId: string;
  explanation?: string;
}

export interface UserExamState {
  examCode: string;
  studentName: string;
  timeRemainingSeconds: number;
  timeElapsedSeconds: number;
  tabSwitchCount: number;
  answers: Record<number, string>;
  activeSection: string;
  isSubmitted: boolean;
  highlights?: Record<number, string[]>;
  notes?: Record<number, string>;
  lastAutoSavedAt?: string;
}

export interface DiscussionComment {
  id: string;
  examCode: string;
  studentName: string;
  avatarUrl: string;
  content: string;
  createdAt: string;
  likes: number;
  userLiked?: boolean;
}

export interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  avatarUrl: string;
  streakDays: number;
  exp: number;
  levelTitle: string;
  avgExamScore: number;
  passedExamsCount: number;
}

export const INITIAL_EXAM_STATE: UserExamState = {
  examCode: '',
  studentName: '',
  timeRemainingSeconds: 5400,
  timeElapsedSeconds: 0,
  tabSwitchCount: 0,
  answers: {},
  activeSection: '',
  isSubmitted: false,
  highlights: {},
  notes: {},
  lastAutoSavedAt: '',
};


