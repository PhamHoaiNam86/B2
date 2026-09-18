import React, { useState, useEffect } from 'react';
import { ActiveTab, VocabItem, VocabStatus, GrammarTopic, ExamModel, UserExamState, Student, ExamFeedItem, DiscussionComment, LeaderboardUser, INITIAL_EXAM_STATE } from './types';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { ExamRoomScreen } from './components/exam/ExamRoomScreen';
import { ExamsView } from './components/exam/ExamsView';
import { ExamDetailView } from './components/exam/ExamDetailView';
import { ResultsScreen } from './components/results/ResultsScreen';
import { VocabView } from './components/vocab/VocabView';
import { FlashcardsView } from './components/vocab/FlashcardsView';
import { GrammarView } from './components/grammar/GrammarView';
import { GrammarLessonView } from './components/grammar/GrammarLessonView';
import { SchreibenView } from './components/schreiben/SchreibenView';
import { DocumentMaterialView } from './components/docs/DocumentMaterialView';
import { StudentsView } from './components/students/StudentsView';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { CreateItemView } from './components/common/CreateItemView';
import { LandingPage } from './components/landing/LandingPage';
import { AuthPage } from './components/auth/AuthPage';
import { ProfileView } from './components/profile/ProfileView';
import { LeaderboardView } from './components/gamification/LeaderboardView';
import { AlertTriangle, X } from 'lucide-react';

const getInitialViewState = () => {
  const rawPath = window.location.pathname.split('?')[0].replace(/^\/+|\/+$/g, '').toLowerCase();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (rawPath === 'login') {
    return { viewMode: 'auth' as const, authInitialTab: 'login' as const, activeTab: 'dashboard' as ActiveTab };
  }
  if (rawPath === 'register') {
    return { viewMode: 'auth' as const, authInitialTab: 'register' as const, activeTab: 'dashboard' as ActiveTab };
  }

  const validTabs: ActiveTab[] = [
    'dashboard', 'exam', 'exam-c1', 'exam-b1', 'exam-a2', 'exam-a1',
    'docs-b2', 'docs-schreiben', 'docs-sprechen',
    'results', 'vocab', 'grammar', 'schreiben', 'students', 'history', 'profile',
    'flashcards', 'grammar-lesson', 'exam-detail', 'create-item'
  ];

  if (rawPath && validTabs.includes(rawPath as ActiveTab)) {
    return { viewMode: 'app' as const, authInitialTab: 'login' as const, activeTab: rawPath as ActiveTab };
  }

  if (isLoggedIn) {
    return { viewMode: 'app' as const, authInitialTab: 'login' as const, activeTab: 'dashboard' as ActiveTab };
  }

  return { viewMode: 'landing' as const, authInitialTab: 'login' as const, activeTab: 'dashboard' as ActiveTab };
};

export default function App() {
  const initialState = getInitialViewState();
  const [viewMode, setViewMode] = useState<'landing' | 'auth' | 'app'>(initialState.viewMode);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'register'>(initialState.authInitialTab);
  const [activeTab, setActiveTabState] = useState<ActiveTab>(initialState.activeTab);
  const [showWelcomePopup, setShowWelcomePopup] = useState<boolean>(initialState.viewMode === 'app');

  const navigateToLanding = () => {
    localStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('selectedExam');
    sessionStorage.removeItem('selectedGrammarTopic');
    sessionStorage.removeItem('editingItem');
    sessionStorage.removeItem('createItemType');
    setViewMode('landing');
    setShowWelcomePopup(false);
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
  };

  const navigateToAuth = (tab: 'login' | 'register' = 'login') => {
    setAuthInitialTab(tab);
    setViewMode('auth');
    setShowWelcomePopup(false);
    const targetPath = `/${tab}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  };

  const navigateToApp = (tab: ActiveTab = 'dashboard') => {
    setViewMode('app');
    setActiveTabState(tab);
    setShowWelcomePopup(true);
    const targetPath = tab === 'dashboard' ? '/dashboard' : `/${tab}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  };

  const setActiveTab = (tab: ActiveTab) => {
    setActiveTabState(tab);
    if (viewMode !== 'app') {
      setViewMode('app');
    }
    const targetPath = tab === 'dashboard' ? '/dashboard' : `/${tab}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ tab }, '', targetPath);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const state = getInitialViewState();
      setViewMode(state.viewMode);
      setAuthInitialTab(state.authInitialTab);
      setActiveTabState(state.activeTab);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [currentUser, setCurrentUser] = useState<'admin' | 'student'>(() => {
    const saved = localStorage.getItem('currentUserRole');
    return saved === 'admin' || saved === 'student' ? saved : 'student';
  });

  const handleSetCurrentUser = (role: 'admin' | 'student') => {
    setCurrentUser(role);
    localStorage.setItem('currentUserRole', role);
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Exam state & Anti-cheat
  const [examState, setExamState] = useState<UserExamState>(INITIAL_EXAM_STATE);
  const [isExamRoomActive, setIsExamRoomActive] = useState<boolean>(false);
  const [isExamReviewMode, setIsExamReviewMode] = useState<boolean>(false);
  const [tabSwitchAlert, setTabSwitchAlert] = useState<string | null>(null);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Core Data States (Dynamic DB Data from Laravel Backend API)
  const [vocabs, setVocabs] = useState<VocabItem[]>([]);
  const [grammarTopics, setGrammarTopics] = useState<GrammarTopic[]>([]);
  const [exams, setExams] = useState<ExamModel[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [liveFeed, setLiveFeed] = useState<ExamFeedItem[]>([]);

  // Gamification & Discussion States
  const [streakDays, setStreakDays] = useState<number>(7);
  const [expPoints, setExpPoints] = useState<number>(1450);

  const [discussionComments, setDiscussionComments] = useState<DiscussionComment[]>([
    {
      id: 'comm-1',
      examCode: 'TELC-B2-01',
      studentName: 'Nguyễn Hoàng Anh',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      content: 'Phần Sprachbausteine Teil 1 bẫy cấu trúc "in Bezug auf" + Genitiv. Các bạn chú ý chia đuôi tính từ nhé!',
      createdAt: '2 giờ trước',
      likes: 14,
      userLiked: true,
    },
    {
      id: 'comm-2',
      examCode: 'GOETHE-B2-01',
      studentName: 'Trần Lê Minh',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      content: 'Đề Goethe B2 phần Lesen Teil 3 khá dài, mẹo là gạch chân từ khóa trong 5 phát biểu trước rồi mới đọc bài.',
      createdAt: '5 giờ trước',
      likes: 9,
      userLiked: false,
    },
  ]);

  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>([
    {
      id: 'lb-1',
      rank: 1,
      name: 'Nguyễn Hoàng Anh',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      streakDays: 14,
      exp: 2850,
      levelTitle: 'Bậc Thầy B2',
      avgExamScore: 288,
      passedExamsCount: 18,
    },
    {
      id: 'lb-2',
      rank: 2,
      name: 'Trần Lê Minh',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      streakDays: 10,
      exp: 2340,
      levelTitle: 'Cao Thủ Goethe',
      avgExamScore: 275,
      passedExamsCount: 14,
    },
    {
      id: 'lb-3',
      rank: 3,
      name: 'Lê Phạm Khánh Linh',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      streakDays: 9,
      exp: 1980,
      levelTitle: 'Chuyên Gia TELC',
      avgExamScore: 268,
      passedExamsCount: 12,
    },
    {
      id: 'lb-4',
      rank: 4,
      name: 'Phạm Hoài Nam',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      streakDays: 7,
      exp: 1450,
      levelTitle: 'Chiến Binh B2',
      avgExamScore: 255,
      passedExamsCount: 8,
    },
    {
      id: 'lb-5',
      rank: 5,
      name: 'Vũ Thị Thanh Hằng',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      streakDays: 5,
      exp: 1220,
      levelTitle: 'Tập Sự A2-B1',
      avgExamScore: 240,
      passedExamsCount: 6,
    },
  ]);

  const handleAddComment = (examCode: string, content: string) => {
    const newComment: DiscussionComment = {
      id: `comm-${Date.now()}`,
      examCode,
      studentName: currentUser === 'admin' ? 'Triệu Vỹ Admin' : 'Học Viên B2',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      content,
      createdAt: 'Vừa xong',
      likes: 0,
      userLiked: false,
    };
    setDiscussionComments((prev) => [newComment, ...prev]);
    setExpPoints((prev) => prev + 5);
    showToast('Đóng góp thảo luận', 'Đã thêm bình luận và cộng +5 EXP!', 'success');
  };

  const handleToggleLikeComment = (commentId: string) => {
    setDiscussionComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              likes: c.userLiked ? c.likes - 1 : c.likes + 1,
              userLiked: !c.userLiked,
            }
          : c
      )
    );
  };

  // Fetch real data from Laravel MySQL / SQLite Database API
  useEffect(() => {
    // 1. Fetch Exams
    fetch('/api/v1/exams')
      .then((res) => res.json())
      .then((res) => {
        const GOETHE_SEEDS: ExamModel[] = [
          {
            id: 'goethe-b2-01',
            name: 'Goethe-Zertifikat B2 Deutsch Prüfung 01',
            examCode: 'GOETHE-B2-01',
            level: 'B2',
            provider: 'GOETHE',
            durationMinutes: 100,
            totalQuestions: 40,
            description: 'Đề thi thử Goethe B2 theo 4 kỹ năng Lesen (5 Teile), Hören (4 Teile), Schreiben (2 Aufgaben), Sprechen.',
            sections: [
              { name: 'Lesen', questionCount: 15, duration: '65 phút' },
              { name: 'Hören', questionCount: 15, duration: '40 phút' },
              { name: 'Schreiben', questionCount: 2, duration: '75 phút' },
              { name: 'Sprechen', questionCount: 2, duration: '15 phút' },
            ],
            targetScore: 240,
            passRate: '86%',
          },
          {
            id: 'goethe-b1-01',
            name: 'Goethe-Zertifikat B1 Deutsch Simulation',
            examCode: 'GOETHE-B1-01',
            level: 'B1',
            provider: 'GOETHE',
            durationMinutes: 90,
            totalQuestions: 35,
            description: 'Đề thi mô phỏng Goethe B1 4 Module độc lập cho người luyện thi tiếng Đức.',
            sections: [
              { name: 'Lesen', questionCount: 15, duration: '65 phút' },
              { name: 'Hören', questionCount: 10, duration: '40 phút' },
              { name: 'Schreiben', questionCount: 3, duration: '60 phút' },
            ],
            targetScore: 210,
            passRate: '92%',
          },
          {
            id: 'goethe-a2-01',
            name: 'Goethe-Zertifikat A2 Start Deutsch 2',
            examCode: 'GOETHE-A2-01',
            level: 'A2',
            provider: 'GOETHE',
            durationMinutes: 70,
            totalQuestions: 30,
            description: 'Đề thi thử trình độ A2 tiêu chuẩn Viện Goethe cho học viên trình độ sơ cấp.',
            sections: [
              { name: 'Lesen', questionCount: 10, duration: '30 phút' },
              { name: 'Hören', questionCount: 10, duration: '30 phút' },
              { name: 'Schreiben', questionCount: 1, duration: '30 phút' },
            ],
            targetScore: 180,
            passRate: '95%',
          },
          {
            id: 'goethe-a1-01',
            name: 'Start Deutsch 1 (Goethe-Zertifikat A1)',
            examCode: 'GOETHE-A1-01',
            level: 'A1',
            provider: 'GOETHE',
            durationMinutes: 60,
            totalQuestions: 25,
            description: 'Đề thi tiếng Đức A1 nền tảng cho người mới bắt đầu.',
            sections: [
              { name: 'Lesen', questionCount: 10, duration: '25 phút' },
              { name: 'Hören', questionCount: 10, duration: '20 phút' },
              { name: 'Schreiben', questionCount: 1, duration: '15 phút' },
            ],
            targetScore: 160,
            passRate: '98%',
          },
          {
            id: 'goethe-c1-01',
            name: 'Goethe-Zertifikat C1 Oberstufe Prüfung',
            examCode: 'GOETHE-C1-01',
            level: 'C1',
            provider: 'GOETHE',
            durationMinutes: 120,
            totalQuestions: 45,
            description: 'Đề thi thử cao cấp C1 Goethe rèn luyện học thuật và học văn bằng đại học Đức.',
            sections: [
              { name: 'Lesen', questionCount: 20, duration: '70 phút' },
              { name: 'Hören', questionCount: 15, duration: '40 phút' },
              { name: 'Schreiben', questionCount: 2, duration: '80 phút' },
            ],
            targetScore: 250,
            passRate: '80%',
          },
        ];

        if (res.success && Array.isArray(res.data)) {
          const mappedExams: ExamModel[] = res.data.map((item: any) => ({
            id: String(item.id || item.exam_code),
            name: item.name || item.title,
            examCode: item.exam_code,
            level: item.level || 'B2',
            provider: item.provider || (item.name?.toUpperCase().includes('GOETHE') ? 'GOETHE' : 'TELC'),
            durationMinutes: item.duration_minutes || 90,
            totalQuestions: item.total_questions || 45,
            description: item.description || '',
            sections: item.sections_json ? (typeof item.sections_json === 'string' ? JSON.parse(item.sections_json) : item.sections_json) : [
              { name: 'Leseverstehen', questionCount: 20, duration: '45 phút' },
              { name: 'Sprachbausteine', questionCount: 10, duration: '15 phút' },
              { name: 'Hörverstehen', questionCount: 10, duration: '20 phút' },
              { name: 'Schriftlicher Ausdruck', questionCount: 1, duration: '30 phút' },
            ],
            targetScore: item.target_score || 225,
            passRate: item.pass_rate || '88%',
          }));

          // Merge DB exams with Goethe Seeds if not present
          const existingCodes = new Set(mappedExams.map((e) => e.examCode));
          const missingSeeds = GOETHE_SEEDS.filter((s) => !existingCodes.has(s.examCode));
          setExams([...mappedExams, ...missingSeeds]);
        } else {
          setExams(GOETHE_SEEDS);
        }
      })
      .catch(() => {});

    // 2. Fetch Vocabularies
    fetch('/api/v1/vocabs')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const mappedVocabs: VocabItem[] = res.data.map((item: any) => ({
            id: String(item.id || item.vocab_id),
            word: item.word,
            article: item.article || '',
            plural: item.plural || '',
            pos: item.pos || 'Nomen',
            phonetic: item.phonetic || '',
            meaningVi: item.meaning_vi,
            exampleDe: item.example_de || '',
            exampleVi: item.example_vi || '',
            topic: item.topic || 'Arbeit & Beruf',
            status: item.status || 'learning',
            isFavorite: Boolean(item.is_favorite),
          }));
          setVocabs(mappedVocabs);
        }
      })
      .catch(() => {});

    // 3. Fetch Grammar Topics
    fetch('/api/v1/grammar')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const mappedGrammar: GrammarTopic[] = res.data.map((item: any) => ({
            id: String(item.id || item.topic_id),
            title: item.title,
            level: item.level || 'B2',
            category: item.category || 'Verben & Modi',
            summary: item.summary || '',
            content: item.content || '',
            rulePoints: item.rule_points ? (typeof item.rule_points === 'string' ? JSON.parse(item.rule_points) : item.rule_points) : [],
            examples: item.examples ? (typeof item.examples === 'string' ? JSON.parse(item.examples) : item.examples) : [],
            status: item.status || 'in_progress',
            progress: item.progress || 0,
            score: item.score || 0,
            badgeLabel: item.badge_label || 'CẦN LUYỆN',
          }));
          setGrammarTopics(mappedGrammar);
        }
      })
      .catch(() => {});

    // 4. Fetch Students
    fetch('/api/v1/students')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const mappedStudents: Student[] = res.data.map((item: any) => ({
            id: String(item.id || item.student_id),
            name: item.name,
            email: item.email || '',
            avatarUrl: item.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
            currentScore: item.current_score || 0,
            targetScore: item.target_score || 270,
            className: item.class_name || 'B2-K38',
            targetExamDate: item.target_exam_date || '15/10/2026',
            status: item.status || 'Đang Học',
          }));
          setStudents(mappedStudents);
        }
      })
      .catch(() => {});

    // 5. Fetch Exam Results / Live Feed
    fetch('/api/v1/results')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const mappedFeed: ExamFeedItem[] = res.data.map((item: any) => ({
            id: String(item.id || item.result_id),
            studentName: item.student_name,
            examCode: item.exam_code,
            score: item.score,
            maxScore: item.max_score || 300,
            statusText: item.status_text || 'Đạt chuẩn TELC B2',
            timeAgo: item.time_ago || 'Vừa xong',
            description: item.description || '',
          }));
          setLiveFeed(mappedFeed);
        }
      })
      .catch(() => {});
  }, []);

  // Selected Data States for Page Views (persisted in sessionStorage across browser reloads)
  const [selectedGrammarTopic, setSelectedGrammarTopicState] = useState<GrammarTopic | null>(() => {
    try {
      const saved = sessionStorage.getItem('selectedGrammarTopic');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const setSelectedGrammarTopic = (topic: GrammarTopic | null) => {
    if (topic) {
      sessionStorage.setItem('selectedGrammarTopic', JSON.stringify(topic));
    } else {
      sessionStorage.removeItem('selectedGrammarTopic');
    }
    setSelectedGrammarTopicState(topic);
  };

  const [selectedExam, setSelectedExamState] = useState<ExamModel | null>(() => {
    try {
      const saved = sessionStorage.getItem('selectedExam');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const setSelectedExam = (exam: ExamModel | null) => {
    if (exam) {
      sessionStorage.setItem('selectedExam', JSON.stringify(exam));
    } else {
      sessionStorage.removeItem('selectedExam');
    }
    setSelectedExamState(exam);
  };

  const [editingItem, setEditingItemState] = useState<any | null>(() => {
    try {
      const saved = sessionStorage.getItem('editingItem');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const setEditingItem = (item: any | null) => {
    if (item) {
      sessionStorage.setItem('editingItem', JSON.stringify(item));
    } else {
      sessionStorage.removeItem('editingItem');
    }
    setEditingItemState(item);
  };

  const [createItemType, setCreateItemTypeState] = useState<'vocab' | 'exam' | 'grammar'>(() => {
    const saved = sessionStorage.getItem('createItemType');
    return saved === 'vocab' || saved === 'exam' || saved === 'grammar' ? saved : 'vocab';
  });

  const setCreateItemType = (type: 'vocab' | 'exam' | 'grammar') => {
    sessionStorage.setItem('createItemType', type);
    setCreateItemTypeState(type);
  };

  // Anti-cheat tab switch monitoring
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isExamRoomActive) {
        setExamState((prev) => {
          const newCount = prev.tabSwitchCount + 1;
          return { ...prev, tabSwitchCount: newCount };
        });
        setTabSwitchAlert('⚠️ Cảnh báo bảo mật: Hệ thống ghi nhận bạn vừa rời khỏi cửa sở thi thử TELC B2!');
        setTimeout(() => setTabSwitchAlert(null), 6000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isExamRoomActive]);

  // Live timer interval for exam room
  useEffect(() => {
    if (!isExamRoomActive) return;

    const timer = setInterval(() => {
      setExamState((prev) => {
        if (prev.timeRemainingSeconds <= 0) {
          clearInterval(timer);
          return prev;
        }
        return {
          ...prev,
          timeRemainingSeconds: prev.timeRemainingSeconds - 1,
          timeElapsedSeconds: prev.timeElapsedSeconds + 1,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamRoomActive]);

  // Format countdown HH:MM:SS
  const formatCountdown = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handlers for Vocab
  const handleToggleFavorite = (id: string) => {
    setVocabs((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isFavorite: !v.isFavorite } : v))
    );
  };

  const handleChangeVocabStatus = (id: string, status: VocabStatus) => {
    setVocabs((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status } : v))
    );
  };

  // Handlers for Vocabs (Persisted to SQL DB)
  const handleAddVocab = (newVocab: VocabItem) => {
    setVocabs((prev) => [newVocab, ...prev]);
    fetch('/api/v1/vocabs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        word: newVocab.word,
        article: newVocab.article,
        plural: newVocab.plural,
        pos: newVocab.pos,
        phonetic: newVocab.phonetic,
        meaning_vi: newVocab.meaningVi,
        example_de: newVocab.exampleDe,
        example_vi: newVocab.exampleVi,
        topic: newVocab.topic,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          const created: VocabItem = {
            id: String(res.data.id || res.data.vocab_id),
            word: res.data.word,
            article: res.data.article || '',
            plural: res.data.plural || '',
            pos: res.data.pos || 'Nomen',
            phonetic: res.data.phonetic || '',
            meaningVi: res.data.meaning_vi,
            exampleDe: res.data.example_de || '',
            exampleVi: res.data.example_vi || '',
            topic: res.data.topic || 'Arbeit & Beruf',
            status: res.data.status || 'learning',
            isFavorite: Boolean(res.data.is_favorite),
          };
          setVocabs((prev) => prev.map((v) => (v.id === newVocab.id ? created : v)));
        }
      })
      .catch(() => {});
  };

  const handleUpdateVocab = (updatedVocab: VocabItem) => {
    setVocabs((prev) => prev.map((v) => (v.id === updatedVocab.id ? updatedVocab : v)));
    fetch(`/api/v1/vocabs/${updatedVocab.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        word: updatedVocab.word,
        article: updatedVocab.article,
        plural: updatedVocab.plural,
        pos: updatedVocab.pos,
        phonetic: updatedVocab.phonetic,
        meaning_vi: updatedVocab.meaningVi,
        example_de: updatedVocab.exampleDe,
        example_vi: updatedVocab.exampleVi,
        topic: updatedVocab.topic,
      }),
    }).catch(() => {});
  };

  const handleDeleteVocab = (id: string) => {
    setVocabs((prev) => prev.filter((v) => v.id !== id));
    fetch(`/api/v1/vocabs/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  // Handlers for Exams (Persisted to SQL DB)
  const handleAddExam = (newExam: ExamModel) => {
    setExams((prev) => [newExam, ...prev]);
    fetch('/api/v1/exams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        exam_code: newExam.examCode,
        name: newExam.name,
        level: newExam.level,
        duration_minutes: newExam.durationMinutes,
        description: newExam.description,
        total_questions: newExam.totalQuestions,
        sections: newExam.sections || [],
        questions: newExam.questions || [],
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          const created: ExamModel = {
            id: String(res.data.id || res.data.exam_code),
            name: res.data.name || res.data.title,
            examCode: res.data.exam_code,
            level: res.data.level || 'TELC B2',
            durationMinutes: res.data.duration_minutes || 90,
            totalQuestions: res.data.total_questions || (newExam.questions ? newExam.questions.length : 0),
            description: res.data.description || '',
            sections: res.data.sections_json
              ? (typeof res.data.sections_json === 'string' ? JSON.parse(res.data.sections_json) : res.data.sections_json)
              : newExam.sections,
            targetScore: res.data.target_score || 225,
            passRate: '88%',
          };
          setExams((prev) => prev.map((e) => (e.id === newExam.id || e.examCode === newExam.examCode ? created : e)));
        }
      })
      .catch((err) => console.error('Create Exam Error:', err));
  };

  const handleUpdateExam = (updatedExam: ExamModel) => {
    setExams((prev) => prev.map((e) => (e.id === updatedExam.id ? updatedExam : e)));
    fetch(`/api/v1/exams/${updatedExam.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: updatedExam.name,
        level: updatedExam.level,
        duration_minutes: updatedExam.durationMinutes,
        description: updatedExam.description,
        total_questions: updatedExam.totalQuestions,
        sections: updatedExam.sections || [],
        questions: updatedExam.questions || [],
      }),
    }).catch((err) => console.error('Update Exam Error:', err));
  };

  const handleDeleteExam = (id: string) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
    fetch(`/api/v1/exams/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  // Handlers for Grammar (Persisted to SQL DB)
  const handleAddGrammar = (newTopic: GrammarTopic) => {
    setGrammarTopics((prev) => [newTopic, ...prev]);
    fetch('/api/v1/grammar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTopic.title,
        level: newTopic.level,
        category: newTopic.category,
        summary: newTopic.summary,
        content: newTopic.content,
        rule_points: newTopic.rulePoints,
        examples: newTopic.examples,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          const created: GrammarTopic = {
            id: String(res.data.id || res.data.topic_id),
            title: res.data.title,
            level: res.data.level || 'B2',
            category: res.data.category,
            summary: res.data.summary,
            content: res.data.content,
            rulePoints: res.data.rule_points || [],
            examples: res.data.examples || [],
            status: res.data.status || 'in_progress',
            progress: res.data.progress || 0,
            score: res.data.score || 0,
            badgeLabel: res.data.badge_label || 'CẦN LUYỆN',
          };
          setGrammarTopics((prev) => prev.map((t) => (t.id === newTopic.id ? created : t)));
        }
      })
      .catch(() => {});
  };

  const handleUpdateGrammar = (updatedTopic: GrammarTopic) => {
    setGrammarTopics((prev) => prev.map((t) => (t.id === updatedTopic.id ? updatedTopic : t)));
    fetch(`/api/v1/grammar/${updatedTopic.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: updatedTopic.title,
        level: updatedTopic.level,
        category: updatedTopic.category,
        summary: updatedTopic.summary,
        content: updatedTopic.content,
        rule_points: updatedTopic.rulePoints,
        examples: updatedTopic.examples,
      }),
    }).catch(() => {});
  };

  const handleDeleteGrammar = (id: string) => {
    setGrammarTopics((prev) => prev.filter((t) => t.id !== id));
    fetch(`/api/v1/grammar/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const handleAnswerChange = (questionId: number, optionId: string) => {
    setExamState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: optionId,
      },
    }));
  };

  const handleStartExamRoom = (exam?: ExamModel) => {
    if (exam) {
      setExamState((prev) => ({
        ...prev,
        examCode: exam.examCode,
        timeRemainingSeconds: (exam.durationMinutes || 90) * 60,
        timeElapsedSeconds: 0,
        tabSwitchCount: 0,
        answers: {},
        isSubmitted: false,
      }));
    }
    setIsExamReviewMode(false);
    setIsExamRoomActive(true);
    setActiveTab('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Vào phòng thi', `Đã bắt đầu phiên thi thử ${exam ? exam.name : 'TELC B2'} với bộ đếm thời gian.`, 'info');
  };

  const handleFinishExamSubmit = () => {
    setIsExamRoomActive(false);
    setIsExamReviewMode(false);
    setActiveTab('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Đã nộp bài thi', 'Hệ thống đã ghi nhận và phân tích điểm thi thử của bạn.', 'success');
  };

  const handleRetakeExam = () => {
    setExamState({
      ...INITIAL_EXAM_STATE,
      answers: {},
      tabSwitchCount: 0,
    });
    setIsExamReviewMode(false);
    setIsExamRoomActive(true);
    setActiveTab('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReviewExam = () => {
    setIsExamReviewMode(true);
    setIsExamRoomActive(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteGrammarTopic = (id: string) => {
    setGrammarTopics((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: 'completed',
              badgeLabel: 'HOÀN THÀNH',
              score: 9.5,
              progress: 100,
            }
          : t
      )
    );
    showToast('Hoàn thành chuyên đề', 'Đã lưu tiến độ và điểm số bài học ngữ pháp B2.', 'success');
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] flex flex-col font-sans">
      {/* Real-time Anti-cheat Toast Warning */}
      {tabSwitchAlert && (
        <div className="fixed top-20 right-6 z-50 p-4 bg-[#ba1a1a] text-white border-[2.5px] border-[#1c1b1b] rounded-xl brutal-shadow-lg text-xs font-bold flex items-center gap-3 animate-bounce">
          <AlertTriangle className="w-5 h-5 text-[#FFED4A] shrink-0" />
          <span>{tabSwitchAlert}</span>
          <button onClick={() => setTabSwitchAlert(null)} className="p-1 hover:bg-[#93000a] rounded cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* VIEW MODES */}
      {viewMode === 'landing' && !isExamRoomActive ? (
        <LandingPage
          onGoToAuth={(tab = 'login') => navigateToAuth(tab)}
        />
      ) : viewMode === 'auth' && !isExamRoomActive ? (
        <AuthPage
          initialTab={authInitialTab}
          onBackToHome={() => navigateToLanding()}
          onSuccessLogin={(role) => {
            handleSetCurrentUser(role);
            localStorage.setItem('isLoggedIn', 'true');
            navigateToApp('dashboard');
            showToast(
              'Đăng nhập thành công',
              `Chào mừng bạn vào portal với vai trò ${role === 'admin' ? '👑 Quản trị viên (Admin)' : '🎓 Học viên B2'}.`,
              'success'
            );
          }}
        />
      ) : isExamRoomActive ? (
        /* FULL SCREEN EXAM ROOM MODE */
        <ExamRoomScreen
          examState={examState}
          onAnswerChange={handleAnswerChange}
          onFinishSection={handleFinishExamSubmit}
          onBackToDashboard={() => {
            setIsExamRoomActive(false);
            if (isExamReviewMode) {
              setIsExamReviewMode(false);
              setActiveTab('results');
            } else {
              setActiveTab('dashboard');
            }
          }}
          formattedCountdown={formatCountdown(examState.timeRemainingSeconds)}
          isReviewMode={isExamReviewMode}
          onExitReviewMode={() => {
            setIsExamRoomActive(false);
            setIsExamReviewMode(false);
            setActiveTab('results');
          }}
        />
      ) : (
        /* STANDARD PORTAL LAYOUT: FIXED SIDEBAR (256px) + 7px GAP + TOP NAVBAR + MAIN CONTENT (p-5px) */
        <div className="min-h-screen flex flex-col bg-[#e2e8f0]">
          {/* Left Sidebar */}
          <Sidebar
            activeTab={activeTab}
            createItemType={createItemType}
            onSelectTab={setActiveTab}
            isOpenMobile={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
            tabSwitchCount={examState.tabSwitchCount}
            currentUser={currentUser}
            onLogout={() => navigateToAuth('login')}
          />

          {/* Main Wrapper Offset for Desktop Sidebar with exact 12px gap (256px + 12px = 268px) */}
          <div className="pl-0 md:pl-[268px] flex-1 flex flex-col min-w-0">
            <Navbar
              activeTab={activeTab}
              searchQuery={searchQuery}
              onSearch={setSearchQuery}
              currentUser={currentUser}
              onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
              onLogout={() => navigateToLanding()}
              streakDays={streakDays}
              expPoints={expPoints}
            />

            {/* Main Workspace: Full width with 10px padding and left border for 12px visual separation */}
            <main className="flex-1 p-[10px] w-full bg-white border-l-[2.5px] border-[#111827] shadow-xs">
              {/* TAB 1: DASHBOARD */}
              {activeTab === 'dashboard' && (
                <DashboardView
                  exams={exams}
                  students={students}
                  liveFeed={liveFeed}
                  onSelectExam={(exam) => setSelectedExam(exam)}
                  onStartExamRoom={handleStartExamRoom}
                  onNavigateToVocab={() => setActiveTab('vocab')}
                  onNavigateToGrammar={() => setActiveTab('grammar')}
                  onNavigateToSchreiben={() => setActiveTab('docs-schreiben')}
                  onNavigateToLeaderboard={() => setActiveTab('leaderboard')}
                  currentUser={currentUser}
                />
              )}

              {/* TAB LEADERBOARD: BẢNG XẾP HẠNG */}
              {activeTab === 'leaderboard' && (
                <LeaderboardView
                  users={leaderboardUsers}
                  currentUserExp={expPoints}
                  currentUserStreak={streakDays}
                />
              )}

              {/* TAB 2: EXAM REPOSITORY (B2, B1, A2, A1) */}
              {activeTab === 'exam' && (
                <ExamsView
                  exams={exams.filter((e) => e.level.includes('B2') || !e.level)}
                  levelLabel="B2"
                  onSelectExam={(exam) => {
                    setSelectedExam(exam);
                    setActiveTab('exam-detail');
                  }}
                  onStartExam={(exam) => handleStartExamRoom(exam)}
                  onOpenNewExamModal={() => {
                    setEditingItem(null);
                    setCreateItemType('exam');
                    setActiveTab('create-item');
                  }}
                  onEditExam={(exam) => {
                    setEditingItem(exam);
                    setCreateItemType('exam');
                    setActiveTab('create-item');
                  }}
                  onDeleteExam={handleDeleteExam}
                  onShowToast={showToast}
                  currentUser={currentUser}
                />
              )}

              {activeTab === 'exam-c1' && (
                <ExamsView
                  exams={exams.filter((e) => e.level.includes('C1'))}
                  levelLabel="C1"
                  onSelectExam={(exam) => {
                    setSelectedExam(exam);
                    setActiveTab('exam-detail');
                  }}
                  onStartExam={(exam) => handleStartExamRoom(exam)}
                  onOpenNewExamModal={() => {
                    setEditingItem(null);
                    setCreateItemType('exam');
                    setActiveTab('create-item');
                  }}
                  onEditExam={(exam) => {
                    setEditingItem(exam);
                    setCreateItemType('exam');
                    setActiveTab('create-item');
                  }}
                  onDeleteExam={handleDeleteExam}
                  onShowToast={showToast}
                  currentUser={currentUser}
                />
              )}

              {activeTab === 'exam-b1' && (
                <ExamsView
                  exams={exams.filter((e) => e.level.includes('B1'))}
                  levelLabel="B1"
                  onSelectExam={(exam) => {
                    setSelectedExam(exam);
                    setActiveTab('exam-detail');
                  }}
                  onStartExam={(exam) => handleStartExamRoom(exam)}
                  onOpenNewExamModal={() => {
                    setEditingItem(null);
                    setCreateItemType('exam');
                    setActiveTab('create-item');
                  }}
                  onEditExam={(exam) => {
                    setEditingItem(exam);
                    setCreateItemType('exam');
                    setActiveTab('create-item');
                  }}
                  onDeleteExam={handleDeleteExam}
                  onShowToast={showToast}
                  currentUser={currentUser}
                />
              )}

              {activeTab === 'exam-a2' && (
                <ExamsView
                  exams={exams.filter((e) => e.level.includes('A2'))}
                  levelLabel="A2"
                  onSelectExam={(exam) => {
                    setSelectedExam(exam);
                    setActiveTab('exam-detail');
                  }}
                  onStartExam={(exam) => handleStartExamRoom(exam)}
                  onOpenNewExamModal={() => {
                    setEditingItem(null);
                    setCreateItemType('exam');
                    setActiveTab('create-item');
                  }}
                  onEditExam={(exam) => {
                    setEditingItem(exam);
                    setCreateItemType('exam');
                    setActiveTab('create-item');
                  }}
                  onDeleteExam={handleDeleteExam}
                  onShowToast={showToast}
                  currentUser={currentUser}
                />
              )}

              {activeTab === 'exam-a1' && (
                <ExamsView
                  exams={exams.filter((e) => e.level.includes('A1'))}
                  levelLabel="A1"
                  onSelectExam={(exam) => {
                    setSelectedExam(exam);
                    setActiveTab('exam-detail');
                  }}
                  onStartExam={(exam) => handleStartExamRoom(exam)}
                  onOpenNewExamModal={() => {
                    setEditingItem(null);
                    setCreateItemType('exam');
                    setActiveTab('create-item');
                  }}
                  onEditExam={(exam) => {
                    setEditingItem(exam);
                    setCreateItemType('exam');
                    setActiveTab('create-item');
                  }}
                  onDeleteExam={handleDeleteExam}
                  onShowToast={showToast}
                  currentUser={currentUser}
                />
              )}

              {/* THƯ VIỆN TÀI LIỆU B2 */}
              {activeTab === 'docs-b2' && (
                <DocumentMaterialView type="b2" onShowToast={showToast} currentUser={currentUser} />
              )}

              {/* TÀI LIỆU SCHREIBEN */}
              {activeTab === 'docs-schreiben' && (
                <DocumentMaterialView type="schreiben" onShowToast={showToast} currentUser={currentUser} />
              )}

              {/* TÀI LIỆU SPRECHEN */}
              {activeTab === 'docs-sprechen' && (
                <DocumentMaterialView type="sprechen" onShowToast={showToast} currentUser={currentUser} />
              )}

              {/* TAB 3: EXAM RESULTS */}
              {activeTab === 'results' && (
                <ResultsScreen
                  examState={examState}
                  onRetakeExam={handleRetakeExam}
                  onBackToDashboard={() => setActiveTab('dashboard')}
                  onReviewExam={handleReviewExam}
                />
              )}

              {/* TAB 4: VOCABULARY BANK */}
              {activeTab === 'vocab' && (
                <VocabView
                  vocabs={vocabs}
                  onToggleFavorite={handleToggleFavorite}
                  onChangeStatus={handleChangeVocabStatus}
                  onOpenAddModal={() => {
                    setEditingItem(null);
                    setCreateItemType('vocab');
                    setActiveTab('create-item');
                  }}
                  onEditVocab={(vocab) => {
                    setEditingItem(vocab);
                    setCreateItemType('vocab');
                    setActiveTab('create-item');
                  }}
                  onDeleteVocab={handleDeleteVocab}
                  onOpenFlashcardModal={() => setActiveTab('flashcards')}
                  onShowToast={showToast}
                  currentUser={currentUser}
                />
              )}

              {/* PAGE VIEW: TRANG LUYỆN THẺ FLASHCARD 3D */}
              {activeTab === 'flashcards' && (
                <FlashcardsView
                  vocabs={vocabs}
                  onBack={() => setActiveTab('vocab')}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}

              {/* TAB 5: GRAMMAR HUB */}
              {activeTab === 'grammar' && (
                <GrammarView
                  topics={grammarTopics}
                  onSelectTopic={(topic) => {
                    setSelectedGrammarTopic(topic);
                    setActiveTab('grammar-lesson');
                  }}
                  onAddNewTopic={() => {
                    setEditingItem(null);
                    setCreateItemType('grammar');
                    setActiveTab('create-item');
                  }}
                  onEditTopic={(topic) => {
                    setEditingItem(topic);
                    setCreateItemType('grammar');
                    setActiveTab('create-item');
                  }}
                  onDeleteTopic={handleDeleteGrammar}
                  onOpenDiagnosticTest={() => handleStartExamRoom()}
                  onOpenTrapQuiz={() => handleStartExamRoom()}
                  onShowToast={showToast}
                  currentUser={currentUser}
                />
              )}

              {/* PAGE VIEW: TRANG BÀI HỌC NGỮ PHÁP CHI TIẾT */}
              {activeTab === 'grammar-lesson' && (
                selectedGrammarTopic ? (
                  <GrammarLessonView
                    topic={selectedGrammarTopic}
                    onBack={() => setActiveTab('grammar')}
                    onCompleteTopic={handleCompleteGrammarTopic}
                  />
                ) : (
                  <GrammarView
                    topics={grammarTopics}
                    onSelectTopic={(topic) => {
                      setSelectedGrammarTopic(topic);
                      setActiveTab('grammar-lesson');
                    }}
                    onAddNewTopic={() => {
                      setEditingItem(null);
                      setCreateItemType('grammar');
                      setActiveTab('create-item');
                    }}
                    onEditTopic={(topic) => {
                      setEditingItem(topic);
                      setCreateItemType('grammar');
                      setActiveTab('create-item');
                    }}
                    onDeleteTopic={handleDeleteGrammar}
                    onOpenDiagnosticTest={() => handleStartExamRoom()}
                    onOpenTrapQuiz={() => handleStartExamRoom()}
                    onShowToast={showToast}
                    currentUser={currentUser}
                  />
                )
              )}

              {/* PAGE VIEW: TRANG CHI TIẾT BỘ ĐỀ THI */}
              {activeTab === 'exam-detail' && (
                selectedExam ? (
                  <ExamDetailView
                    exam={selectedExam}
                    onBack={() => setActiveTab('exam')}
                    onStartExam={() => handleStartExamRoom(selectedExam)}
                    onShowToast={showToast}
                    comments={discussionComments}
                    onAddComment={handleAddComment}
                    onToggleLikeComment={handleToggleLikeComment}
                  />
                ) : (
                  <ExamsView
                    exams={exams.filter((e) => e.level.includes('B2') || !e.level)}
                    levelLabel="B2"
                    onSelectExam={(exam) => {
                      setSelectedExam(exam);
                      setActiveTab('exam-detail');
                    }}
                    onStartExam={(exam) => handleStartExamRoom(exam)}
                    onOpenNewExamModal={() => {
                      setEditingItem(null);
                      setCreateItemType('exam');
                      setActiveTab('create-item');
                    }}
                    onEditExam={(exam) => {
                      setEditingItem(exam);
                      setCreateItemType('exam');
                      setActiveTab('create-item');
                    }}
                    onDeleteExam={handleDeleteExam}
                    onShowToast={showToast}
                    currentUser={currentUser}
                  />
                )
              )}

              {/* PAGE VIEW: TRANG THÊM MỚI & CHỈNH SỬA TỪ VỰNG / ĐỀ THI / NGỮ PHÁP */}
              {activeTab === 'create-item' && (
                currentUser === 'admin' ? (
                  <CreateItemView
                    type={createItemType}
                    editingItem={editingItem}
                    onBack={() => {
                      const backTab = createItemType === 'vocab' ? 'vocab' : createItemType === 'grammar' ? 'grammar' : 'exam';
                      setEditingItem(null);
                      setActiveTab(backTab);
                    }}
                    onAddVocab={handleAddVocab}
                    onAddExam={handleAddExam}
                    onAddGrammar={handleAddGrammar}
                    onUpdateVocab={handleUpdateVocab}
                    onUpdateExam={handleUpdateExam}
                    onUpdateGrammar={handleUpdateGrammar}
                    onShowToast={showToast}
                  />
                ) : (
                  <ExamsView
                    exams={exams.filter((e) => e.level.includes('B2') || !e.level)}
                    levelLabel="B2"
                    onSelectExam={(exam) => {
                      setSelectedExam(exam);
                      setActiveTab('exam-detail');
                    }}
                    onStartExam={(exam) => handleStartExamRoom(exam)}
                    onOpenNewExamModal={() => {
                      setEditingItem(null);
                      setCreateItemType('exam');
                      setActiveTab('create-item');
                    }}
                    onEditExam={(exam) => {
                      setEditingItem(exam);
                      setCreateItemType('exam');
                      setActiveTab('create-item');
                    }}
                    onDeleteExam={handleDeleteExam}
                    onShowToast={showToast}
                    currentUser={currentUser}
                  />
                )
              )}

              {/* TAB 6: MODUL SCHREIBEN (WRITING) */}
              {activeTab === 'schreiben' && (
                <SchreibenView onShowToast={showToast} />
              )}

              {/* TAB 7: STUDENT MANAGEMENT */}
              {activeTab === 'students' && (
                <StudentsView students={students} onShowToast={showToast} currentUser={currentUser} />
              )}

              {/* TAB 8: HISTORY & LEADERBOARDS */}
              {activeTab === 'history' && (
                <div className="bg-[#ffffff] border-[2.5px] border-[#1c1b1b] rounded-2xl p-6 brutal-shadow space-y-4">
                  <h2 className="text-xl font-black text-[#1c1b1b] font-heading">
                    Lịch Sử Làm Bài & Bảng Điểm TELC B2 Toàn Hệ Thống
                  </h2>
                  <div className="divide-y divide-[#1c1b1b]/10 border-2 border-[#1c1b1b] rounded-xl overflow-hidden text-xs">
                    {liveFeed.map((item) => (
                      <div key={item.id} className="p-4 bg-white hover:bg-[#fcf9f8] flex items-center justify-between">
                        <div>
                          <b className="text-[#1c1b1b] text-sm">{item.studentName}</b>
                          <p className="text-[#564145] text-xs mt-0.5">{item.description}</p>
                          <span className="text-[10px] text-[#897175]">{item.timeAgo}</span>
                        </div>
                        <span className="text-sm font-black text-[#f36b92]">{item.score} / {item.maxScore}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 9: DEDICATED PROFILE VIEW */}
              {activeTab === 'profile' && (
                <ProfileView currentUser={currentUser} onShowToast={showToast} />
              )}
            </main>
          </div>
        </div>
      )}

      {/* TOAST SYSTEM */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
