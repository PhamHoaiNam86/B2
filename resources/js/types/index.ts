export type ActiveTab = 
  | 'dashboard'
  | 'exam'
  | 'exam-b1'
  | 'exam-a2'
  | 'exam-a1'
  | 'results'
  | 'vocab'
  | 'grammar'
  | 'schreiben'
  | 'students'
  | 'history';

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
  durationMinutes: number;
  totalQuestions: number;
  description: string;
  sections: Array<{ name: string; questionCount: number; duration: string }>;
  targetScore: number;
  passRate: string;
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
}

export interface Question {
  id: number;
  section: string;
  subSection: string;
  title: string;
  contextText?: string;
  audioUrl?: string;
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
}
