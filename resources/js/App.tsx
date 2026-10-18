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
import { ExamHistoryView } from './components/exam/ExamHistoryView';
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
    'flashcards', 'grammar-lesson', 'exam-detail', 'create-item', 'leaderboard'
  ];

  // NẾU ĐÃ ĐĂNG NHẬP THÀNH CÔNG:
  if (isLoggedIn) {
    if (rawPath && validTabs.includes(rawPath as ActiveTab)) {
      return { viewMode: 'app' as const, authInitialTab: 'login' as const, activeTab: rawPath as ActiveTab };
    }
    const savedTab = sessionStorage.getItem('activeTab') || localStorage.getItem('activeTab');
    const tabToUse = savedTab && validTabs.includes(savedTab as ActiveTab) ? (savedTab as ActiveTab) : 'dashboard';
    return { viewMode: 'app' as const, authInitialTab: 'login' as const, activeTab: tabToUse };
  }

  // NẾU CHƯA ĐĂNG NHẬP (Chưa xác thực OTP / Chưa được Admin duyệt):
  // Bắt buộc chặn lại và yêu cầu Đăng Nhập / Đăng Ký OTP
  if (rawPath && validTabs.includes(rawPath as ActiveTab)) {
    sessionStorage.setItem('redirectAfterLogin', rawPath);
    return { viewMode: 'auth' as const, authInitialTab: 'login' as const, activeTab: rawPath as ActiveTab };
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
    sessionStorage.removeItem('activeTab');
    localStorage.removeItem('activeTab');
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
    localStorage.removeItem('isLoggedIn');
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
    sessionStorage.setItem('activeTab', tab);
    localStorage.setItem('activeTab', tab);
    setShowWelcomePopup(true);
    const targetPath = tab === 'dashboard' ? '/dashboard' : `/${tab}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  };

  const setActiveTab = (tab: ActiveTab) => {
    if (tab.startsWith('exam') && tab !== 'exam-detail') {
      setPreviousExamTab(tab);
    }
    setActiveTabState(tab);
    sessionStorage.setItem('activeTab', tab);
    localStorage.setItem('activeTab', tab);
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
  const [examState, setExamStateInternal] = useState<UserExamState>(() => {
    try {
      const saved = sessionStorage.getItem('activeExamState');
      if (saved) return JSON.parse(saved);
    } catch {}
    try {
      const lastCompleted = localStorage.getItem('lastCompletedExamState');
      if (lastCompleted) return JSON.parse(lastCompleted);
    } catch {}
    return INITIAL_EXAM_STATE;
  });

  const setExamState: React.Dispatch<React.SetStateAction<UserExamState>> = (action) => {
    setExamStateInternal((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      try {
        sessionStorage.setItem('activeExamState', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const [isExamRoomActive, setIsExamRoomActiveState] = useState<boolean>(() => {
    const rawPath = window.location.pathname.split('?')[0].replace(/^\/+|\/+$/g, '').toLowerCase();
    // Nếu người dùng truy cập trực tiếp các route khác (như /create-item, /exam-b1,...) thì thoát phòng thi
    if (rawPath && rawPath !== 'exam-room') {
      sessionStorage.removeItem('isExamRoomActive');
      return false;
    }
    return sessionStorage.getItem('isExamRoomActive') === 'true';
  });

  const setIsExamRoomActive = (active: boolean) => {
    if (active) {
      sessionStorage.setItem('isExamRoomActive', 'true');
    } else {
      sessionStorage.removeItem('isExamRoomActive');
    }
    setIsExamRoomActiveState(active);
  };

  const [isExamReviewMode, setIsExamReviewModeState] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('isExamReviewMode') === 'true';
    } catch {
      return false;
    }
  });

  const setIsExamReviewMode = (val: boolean) => {
    if (val) {
      sessionStorage.setItem('isExamReviewMode', 'true');
    } else {
      sessionStorage.removeItem('isExamReviewMode');
    }
    setIsExamReviewModeState(val);
  };
  const [tabSwitchAlert, setTabSwitchAlert] = useState<string | null>(null);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
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

  const [discussionComments, setDiscussionComments] = useState<DiscussionComment[]>([]);

  // Dynamic Leaderboard computed from MySQL CSDL records (students & liveFeed)
  const leaderboardUsers: LeaderboardUser[] = (students || []).map((st, idx) => {
    const stName = String(st.name || '').toLowerCase();
    const studentResults = (liveFeed || []).filter((f) => String(f.studentName || '').toLowerCase() === stName);
    const avgScore = studentResults.length > 0
      ? Math.round(studentResults.reduce((acc, r) => acc + (r.score || 0), 0) / studentResults.length)
      : Math.round(st.currentScore || 0);

    return {
      id: String(st.id || idx),
      rank: idx + 1,
      name: st.name || 'Học viên',
      avatarUrl: st.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      streakDays: 7,
      exp: avgScore * 5 + studentResults.length * 100,
      levelTitle: avgScore >= 270 ? 'Bậc Thầy B2' : avgScore >= 240 ? 'Cao Thủ' : 'Học Viên',
      avgExamScore: avgScore,
      passedExamsCount: studentResults.length,
    };
  }).sort((a, b) => b.exp - a.exp).map((u, idx) => ({ ...u, rank: idx + 1 }));

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

  // Fetch real data from Laravel MySQL Database API
  useEffect(() => {
    // 1. Fetch Exams from MySQL Database
    fetch('/api/v1/exams')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const mappedExams: ExamModel[] = res.data.map((item: any) => {
            const rawLevel = String(item.level || 'TELC B2').toUpperCase();
            const rawName = String(item.name || item.title || '').toUpperCase();
            const rawProvider = String(item.provider || '').toUpperCase();
            const isGoethe = rawProvider === 'GOETHE' || rawName.includes('GOETHE') || rawLevel.includes('GOETHE');
            const providerName: 'GOETHE' | 'TELC' = isGoethe ? 'GOETHE' : 'TELC';

            return {
              id: String(item.id || item.exam_code || `exam-${Date.now()}`),
              name: item.name || item.title || 'Bộ đề thi thử',
              examCode: item.exam_code || 'EXAM-CODE',
              level: item.level || 'TELC B2',
              provider: providerName,
              durationMinutes: item.duration_minutes || 90,
              totalQuestions: item.total_questions || 45,
              description: item.description || '',
              sections: item.sections_json
                ? (typeof item.sections_json === 'string' ? JSON.parse(item.sections_json) : item.sections_json)
                : [
                    { name: 'Leseverstehen', questionCount: 20, duration: '45 phút' },
                    { name: 'Sprachbausteine', questionCount: 10, duration: '15 phút' },
                    { name: 'Hörverstehen', questionCount: 10, duration: '20 phút' },
                    { name: 'Schriftlicher Ausdruck', questionCount: 1, duration: '30 phút' },
                  ],
              targetScore: item.target_score || ((item.provider === 'GOETHE' || String(item.exam_code || '').toUpperCase().includes('GOETHE')) ? 60 : 63),
              passRate: item.pass_rate || '88%',
            };
          });
          setExams(mappedExams);
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
            level: item.level || 'B2',
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
            targetScore: item.target_score || 80,
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
            maxScore: item.max_score || 105,
            statusText: item.status_text || 'Đạt chuẩn',
            timeAgo: item.time_ago || 'Vừa xong',
            description: item.description || '',
            readingScore: item.reading_score || 0,
            listeningScore: item.listening_score || 0,
            writingScore: item.writing_score || 0,
            speakingScore: item.speaking_score || 0,
            answers: item.answers
              ? (typeof item.answers === 'string' ? JSON.parse(item.answers) : item.answers)
              : undefined,
            submittedAt: item.submitted_at || item.created_at,
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
      if (saved) return JSON.parse(saved);
    } catch {}
    try {
      const lastCompleted = localStorage.getItem('lastCompletedExamModel');
      if (lastCompleted) return JSON.parse(lastCompleted);
    } catch {}
    return null;
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

  const [previousExamTab, setPreviousExamTab] = useState<ActiveTab>('exam');

  const getExamTabFromLevel = (levelStr?: string, defaultTab: ActiveTab = 'exam'): ActiveTab => {
    if (!levelStr) return defaultTab;
    const upper = String(levelStr).toUpperCase().trim();
    if (/\bB2\b/.test(upper) || upper === 'TELC B2' || upper === 'B2') return 'exam';
    if (/\bB1\b/.test(upper) || upper === 'TELC B1' || upper === 'B1') return 'exam-b1';
    if (/\bA2\b/.test(upper) || upper === 'TELC A2' || upper === 'A2') return 'exam-a2';
    if (/\bA1\b/.test(upper) || upper === 'TELC A1' || upper === 'A1') return 'exam-a1';
    if (/\bC1\b/.test(upper) || upper === 'TELC C1' || upper === 'C1') return 'exam-c1';
    return defaultTab;
  };

  const handleOpenCreateExam = (editing: ExamModel | null = null) => {
    const originTab = editing
      ? getExamTabFromLevel(editing.level, activeTab.startsWith('exam') ? activeTab : 'exam')
      : (activeTab.startsWith('exam') && activeTab !== 'exam-detail' ? activeTab : previousExamTab);
    setPreviousExamTab(originTab);
    setEditingItem(editing);
    setCreateItemType('exam');
    setActiveTab('create-item');
  };

  const getInitialExamLevelForTab = (tab: ActiveTab): string => {
    switch (tab) {
      case 'exam-a1': return 'TELC A1';
      case 'exam-a2': return 'TELC A2';
      case 'exam-b1': return 'TELC B1';
      case 'exam-c1': return 'TELC C1';
      case 'exam':
      default: return 'TELC B2';
    }
  };

  const handleBackFromCreateItem = (targetLevel?: string) => {
    let backTab: ActiveTab = 'exam';
    if (createItemType === 'vocab') {
      backTab = 'vocab';
    } else if (createItemType === 'grammar') {
      backTab = 'grammar';
    } else {
      backTab = getExamTabFromLevel(targetLevel, previousExamTab);
    }
    setEditingItem(null);
    setActiveTab(backTab);
  };

  // Anti-cheat tab switch monitoring
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isExamRoomActive) {
        setExamState((prev) => {
          const newCount = prev.tabSwitchCount + 1;
          return { ...prev, tabSwitchCount: newCount };
        });
        setTabSwitchAlert('⚠️ Cảnh báo bảo mật: Hệ thống ghi nhận bạn vừa rời khỏi cửa sổ thi thử tiếng Đức!');
        setTimeout(() => setTabSwitchAlert(null), 6000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isExamRoomActive]);

  // Live timer interval for exam room (paused in review mode)
  useEffect(() => {
    if (!isExamRoomActive || isExamReviewMode) return;

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
  }, [isExamRoomActive, isExamReviewMode]);

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
        level: newVocab.level || 'B2',
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
            level: res.data.level || 'B2',
            status: res.data.status || 'learning',
            isFavorite: Boolean(res.data.is_favorite),
          };
          setVocabs((prev) => prev.map((v) => (v.id === newVocab.id ? created : v)));
        }
      })
      .catch(() => {});
  };

  const handleAddBulkVocab = (items: VocabItem[], level: string, topic: string) => {
    setVocabs((prev) => [...items, ...prev]);
    fetch('/api/v1/vocabs/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level,
        topic,
        items: items.map((i) => ({
          word: i.word,
          article: i.article,
          plural: i.plural,
          pos: i.pos,
          phonetic: i.phonetic,
          meaning_vi: i.meaningVi,
          example_de: i.exampleDe,
          example_vi: i.exampleVi,
          topic: i.topic || topic,
          level: i.level || level,
        })),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const createdList: VocabItem[] = res.data.map((v: any) => ({
            id: String(v.id || v.vocab_id),
            word: v.word,
            article: v.article || '',
            plural: v.plural || '',
            pos: v.pos || 'Nomen',
            phonetic: v.phonetic || '',
            meaningVi: v.meaning_vi,
            exampleDe: v.example_de || '',
            exampleVi: v.example_vi || '',
            topic: v.topic || topic,
            level: v.level || level,
            status: v.status || 'learning',
            isFavorite: Boolean(v.is_favorite),
          }));
          setVocabs((prev) => {
            const tempIds = new Set(items.map((i) => i.id));
            const filtered = prev.filter((p) => !tempIds.has(p.id));
            return [...createdList, ...filtered];
          });
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
        level: updatedVocab.level || 'B2',
      }),
    }).catch(() => {});
  };

  const handleDeleteVocab = (id: string) => {
    setVocabs((prev) => prev.filter((v) => v.id !== id));
    fetch(`/api/v1/vocabs/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  // Handlers for Exams (Persisted to SQL DB)
  const fetchLatestExams = () => {
    fetch('/api/v1/exams')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const mappedExams: ExamModel[] = res.data.map((item: any) => {
            const rawLevel = String(item.level || 'TELC B2').toUpperCase();
            const rawName = String(item.name || item.title || '').toUpperCase();
            const rawProvider = String(item.provider || '').toUpperCase();
            const isGoethe = rawProvider === 'GOETHE' || rawName.includes('GOETHE') || rawLevel.includes('GOETHE');
            const providerName: 'GOETHE' | 'TELC' = isGoethe ? 'GOETHE' : 'TELC';

            return {
              id: String(item.id || item.exam_code || `exam-${Date.now()}`),
              name: item.name || item.title || 'Bộ đề thi thử',
              examCode: item.exam_code || 'EXAM-CODE',
              level: item.level || 'TELC B2',
              provider: providerName,
              durationMinutes: item.duration_minutes || 90,
              totalQuestions: item.total_questions || 45,
              description: item.description || '',
              sections: item.sections_json
                ? (typeof item.sections_json === 'string' ? JSON.parse(item.sections_json) : item.sections_json)
                : [
                    { name: 'Leseverstehen', questionCount: 20, duration: '45 phút' },
                    { name: 'Sprachbausteine', questionCount: 10, duration: '15 phút' },
                    { name: 'Hörverstehen', questionCount: 10, duration: '20 phút' },
                    { name: 'Schriftlicher Ausdruck', questionCount: 1, duration: '30 phút' },
                  ],
              targetScore: item.target_score || ((item.provider === 'GOETHE' || String(item.exam_code || '').toUpperCase().includes('GOETHE')) ? 60 : 63),
              passRate: item.pass_rate || '88%',
            };
          });
          setExams(mappedExams);
        }
      })
      .catch(() => {});
  };

  const handleAddExam = (newExam: ExamModel) => {
    setExams((prev) => [newExam, ...prev]);
    fetch('/api/v1/exams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        exam_code: newExam.examCode,
        name: newExam.name,
        level: newExam.level,
        provider: newExam.provider || 'TELC',
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
          showToast('Thành công', 'Bộ đề thi đã được lưu vĩnh viễn vào CSDL!', 'success');
          fetchLatestExams();
        } else {
          showToast('Cảnh báo lưu CSDL', res.message || 'Máy chủ không thể lưu đề thi vào CSDL!', 'warning');
          setExams((prev) => prev.filter((e) => e.id !== newExam.id));
        }
      })
      .catch((err) => {
        console.error('Create Exam Error:', err);
        showToast('Lỗi kết nối', 'Không thể gửi dữ liệu đề thi tới máy chủ!', 'warning');
        setExams((prev) => prev.filter((e) => e.id !== newExam.id));
      });
  };

  const handleUpdateExam = (updatedExam: ExamModel) => {
    setExams((prev) => prev.map((e) => (e.id === updatedExam.id ? updatedExam : e)));
    fetch(`/api/v1/exams/${encodeURIComponent(updatedExam.examCode || updatedExam.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        exam_code: updatedExam.examCode,
        name: updatedExam.name,
        level: updatedExam.level,
        provider: updatedExam.provider || 'TELC',
        duration_minutes: updatedExam.durationMinutes,
        description: updatedExam.description,
        total_questions: updatedExam.totalQuestions,
        sections: updatedExam.sections || [],
        questions: updatedExam.questions || [],
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          showToast('Cập nhật thành công', 'Đã lưu thay đổi bộ đề thi vào CSDL!', 'success');
          fetchLatestExams();
        } else {
          showToast('Lỗi cập nhật', res.message || 'Không thể lưu thay đổi vào CSDL!', 'warning');
          fetchLatestExams();
        }
      })
      .catch((err) => {
        console.error('Update Exam Error:', err);
        showToast('Lỗi kết nối', 'Không thể cập nhật bộ đề thi trên máy chủ!', 'warning');
      });
  };

  const handleDeleteExam = (id: string) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
    fetch(`/api/v1/exams/${id}`, { method: 'DELETE' })
      .then(() => fetchLatestExams())
      .catch(() => {});
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
    if (activeTab.startsWith('exam') && activeTab !== 'exam-detail') {
      setPreviousExamTab(activeTab);
    } else if (exam?.level) {
      setPreviousExamTab(getExamTabFromLevel(exam.level, previousExamTab));
    }

    if (exam) {
      setSelectedExam(exam);
      const newExamState: UserExamState = {
        ...INITIAL_EXAM_STATE,
        examCode: exam.examCode,
        studentName: currentUser === 'admin' ? 'Triệu Vỹ Admin' : 'Học Viên B2',
        timeRemainingSeconds: (exam.durationMinutes || 90) * 60,
        timeElapsedSeconds: 0,
        tabSwitchCount: 0,
        answers: {},
        isSubmitted: false,
      };
      setExamState(newExamState);
    }
    setIsExamReviewMode(false);
    setIsExamRoomActive(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Vào phòng thi', `Đã bắt đầu phiên thi thử ${exam ? exam.name : 'TELC B2'} với bộ đếm thời gian.`, 'info');
  };

  const computeExamScoresHelper = (
    exam: ExamModel | null | undefined,
    userAnswers: Record<string | number, string> = {},
    examCodeOverride?: string
  ) => {
    const code = examCodeOverride || exam?.examCode || '';
    const isWritingOrSpeakingExam =
      code.toUpperCase().includes('SCHREIBEN') ||
      code.toUpperCase().includes('SPRECHEN') ||
      code.toUpperCase().includes('VIẾT') ||
      code.toUpperCase().includes('NÓI') ||
      (exam?.name || '').toUpperCase().includes('SCHREIBEN') ||
      (exam?.name || '').toUpperCase().includes('SPRECHEN') ||
      (exam?.name || '').toUpperCase().includes('VIẾT') ||
      (exam?.name || '').toUpperCase().includes('NÓI');

    if (isWritingOrSpeakingExam) {
      return {
        score: 100,
        maxScore: 100,
        readingScore: 0,
        sprachScore: 100,
        listeningScore: 0,
        writingScore: 100,
        speakingScore: 100,
        statusText: 'Đã nộp bài thành công (Hoàn thành)',
        answeredCount: Object.keys(userAnswers).length,
        correctCount: 1,
      };
    }

    const isGoethe =
      code.toUpperCase().includes('GOETHE') ||
      (exam?.provider || '').toUpperCase().includes('GOETHE') ||
      (exam?.level || '').toUpperCase().includes('GOETHE') ||
      (exam?.name || '').toUpperCase().includes('GOETHE');

    const totalQuestionsCount = (exam?.questions && exam.questions.length > 0)
      ? exam.questions.length
      : 40;

    let totalCorrect = 0;
    let readingCorrect = 0;
    let readingTotal = 0;
    let sprachCorrect = 0;
    let sprachTotal = 0;

    if (exam?.questions && exam.questions.length > 0) {
      exam.questions.forEach((q: any, idx: number) => {
        const userAns = userAnswers[q.id];
        const correctChoice = String(q.correctOptionId || q.correct_option_id || 'A').trim().toUpperCase();
        const userStr = String(userAns || '').trim().toUpperCase();
        let isCorrect = false;

        if (userAns) {
          if (userStr === correctChoice) {
            isCorrect = true;
          } else if (Array.isArray(q.options)) {
            const optIdx = q.options.findIndex((o: any) => String(o.id).trim().toUpperCase() === userStr || o.id === userAns);
            if (optIdx >= 0) {
              const letter = String.fromCharCode(65 + optIdx).toUpperCase();
              isCorrect = letter === correctChoice || Boolean(q.options[optIdx]?.isCorrect);
            }
          }
        }

        if (isCorrect) totalCorrect += 1;

        if (idx < 20) {
          readingTotal += 1;
          if (isCorrect) readingCorrect += 1;
        } else {
          sprachTotal += 1;
          if (isCorrect) sprachCorrect += 1;
        }
      });
    } else {
      const answeredKeys = Object.keys(userAnswers);
      totalCorrect = answeredKeys.length;
      readingCorrect = Math.min(20, Math.round(totalCorrect * 0.5));
      sprachCorrect = Math.max(0, totalCorrect - readingCorrect);
      readingTotal = 20;
      sprachTotal = 20;
    }

    if (isGoethe) {
      const score = Math.round((totalCorrect / totalQuestionsCount) * 100 * 10) / 10;
      const isPassed = score >= 60;
      return {
        score,
        maxScore: 100,
        readingScore: score,
        sprachScore: 0,
        listeningScore: 0,
        writingScore: 0,
        speakingScore: 0,
        statusText: isPassed ? 'Đạt chuẩn GOETHE (Bestanden)' : 'Chưa đạt GOETHE (Nicht bestanden)',
        answeredCount: Object.keys(userAnswers).length,
        correctCount: totalCorrect,
      };
    } else {
      const rPts = readingTotal > 0 ? (readingCorrect * (75 / readingTotal)) : 0;
      const sPts = sprachTotal > 0 ? (sprachCorrect * (30 / sprachTotal)) : 0;
      const readingScore = Math.round(rPts * 10) / 10;
      const sprachScore = Math.round(sPts * 10) / 10;
      const score = Math.round((readingScore + sprachScore) * 10) / 10;
      const isPassed = score >= 63;
      return {
        score,
        maxScore: 105,
        readingScore,
        sprachScore,
        listeningScore: 0,
        writingScore: 0,
        speakingScore: 0,
        statusText: isPassed ? 'Đạt chuẩn TELC (Bestanden)' : 'Chưa đạt TELC (Nicht bestanden)',
        answeredCount: Object.keys(userAnswers).length,
        correctCount: totalCorrect,
      };
    }
  };

  const handleFinishExamSubmit = (computedResult?: any) => {
    const isWritingOrSpeakingExam =
      (computedResult?.writingScore === 100 && computedResult?.readingScore === 0) ||
      (examState.examCode || selectedExam?.examCode || '').toUpperCase().includes('SCHREIBEN') ||
      (selectedExam?.name || '').toUpperCase().includes('SCHREIBEN') ||
      (selectedExam?.name || '').toUpperCase().includes('VIẾT') ||
      (examState.examCode || selectedExam?.examCode || '').toUpperCase().includes('SPRECHEN') ||
      (selectedExam?.name || '').toUpperCase().includes('SPRECHEN') ||
      (selectedExam?.name || '').toUpperCase().includes('NÓI');

    const isGoethe = (
      (examState.examCode || selectedExam?.examCode || '').toUpperCase().includes('GOETHE') ||
      (selectedExam?.provider || '').toUpperCase().includes('GOETHE') ||
      (selectedExam?.level || '').toUpperCase().includes('GOETHE') ||
      (selectedExam?.name || '').toUpperCase().includes('GOETHE') ||
      computedResult?.maxScore === 100
    );
    const defaultMax = isGoethe ? 100 : 105;
    const providerLabel = isGoethe ? 'GOETHE' : 'TELC';

    const resolvedResult = computedResult || computeExamScoresHelper(selectedExam, examState.answers, examState.examCode);

    const score = isWritingOrSpeakingExam
      ? 100
      : (typeof resolvedResult?.score === 'number'
        ? resolvedResult.score
        : (isGoethe ? 75 : 82.5));
    const maxScore = isWritingOrSpeakingExam ? 100 : (resolvedResult?.maxScore || defaultMax);
    const readingScore = isWritingOrSpeakingExam
      ? 0
      : (typeof resolvedResult?.readingScore === 'number'
        ? resolvedResult.readingScore
        : (isGoethe ? score : Math.round(score * (75 / 105) * 10) / 10));
    const sprachScore = isWritingOrSpeakingExam
      ? 100
      : (typeof resolvedResult?.sprachScore === 'number'
        ? resolvedResult.sprachScore
        : (isGoethe ? 0 : Math.round((score - readingScore) * 10) / 10));
    const correctCount = isWritingOrSpeakingExam ? (resolvedResult?.correctCount ?? 1) : (resolvedResult?.correctCount ?? 0);
    const answeredCount = resolvedResult?.answeredCount ?? Object.keys(examState.answers || {}).length;

    const passThreshold = isGoethe ? 60 : 63;
    const statusText = isWritingOrSpeakingExam
      ? 'Đã nộp bài thành công (Hoàn thành)'
      : (resolvedResult?.statusText || (score >= passThreshold ? `Đạt chuẩn ${providerLabel}` : `Chưa đạt ${providerLabel}`));

    const finalExamState: UserExamState = {
      ...examState,
      score,
      maxScore,
      readingScore,
      sprachScore,
      statusText,
      answeredCount,
      correctCount,
      isSubmitted: true,
    };

    setExamState(finalExamState);

    try {
      localStorage.setItem('lastCompletedExamState', JSON.stringify(finalExamState));
      if (selectedExam) {
        localStorage.setItem('lastCompletedExamModel', JSON.stringify(selectedExam));
      }
    } catch {}

    fetch('/api/v1/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        exam_code: examState.examCode || selectedExam?.examCode || 'EXAM-MOCK',
        student_name: examState.studentName || (currentUser === 'admin' ? 'Triệu Vỹ Admin' : 'Học Viên B2'),
        score: score,
        max_score: maxScore,
        status_text: statusText,
        reading_score: readingScore,
        listening_score: 0,
        writing_score: sprachScore,
        speaking_score: 0,
        tab_switch_count: examState.tabSwitchCount || 0,
        ai_feedback: `Hoàn thành bài thi ${providerLabel}: đạt ${score}/${maxScore} điểm (${statusText}).`,
        description: `Hoàn thành bài thi ${examState.examCode || selectedExam?.name || 'mô phỏng'}`,
        answers: examState.answers || {},
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          const newItem: ExamFeedItem = {
            id: String(res.data.id || res.data.result_id),
            studentName: res.data.student_name,
            examCode: res.data.exam_code,
            score: res.data.score,
            maxScore: res.data.max_score || maxScore,
            statusText: res.data.status_text || statusText,
            timeAgo: 'Vừa xong',
            description: res.data.description || '',
            readingScore: res.data.reading_score || 0,
            listeningScore: res.data.listening_score || 0,
            writingScore: res.data.writing_score || 0,
            speakingScore: res.data.speaking_score || 0,
            answers: examState.answers || {},
            submittedAt: res.data.submitted_at || new Date().toISOString(),
          };
          setLiveFeed((prev) => [newItem, ...prev]);
        }
      })
      .catch((err) => console.error('Submit exam error:', err));

    setIsExamRoomActive(false);
    setIsExamReviewMode(false);
    setActiveTab('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Đã nộp bài thi', `Hệ thống đã ghi nhận kết quả: ${score}/${maxScore} điểm!`, 'success');
  };

  // Auto-submit when countdown timer reaches 00:00:00
  useEffect(() => {
    if (isExamRoomActive && !isExamReviewMode && examState.timeRemainingSeconds <= 0 && examState.timeElapsedSeconds > 0) {
      showToast('Hết giờ làm bài!', 'Đã hết thời gian thi quy định. Hệ thống tự động nộp bài thi của bạn.', 'warning');
      handleFinishExamSubmit();
    }
  }, [isExamRoomActive, isExamReviewMode, examState.timeRemainingSeconds, examState.timeElapsedSeconds]);

  const handleRetakeExam = () => {
    const currentCode = examState.examCode || selectedExam?.examCode || 'TELC-B2-MOCK-01';
    const duration = (selectedExam?.durationMinutes || 90) * 60;
    const retakeState: UserExamState = {
      ...INITIAL_EXAM_STATE,
      examCode: currentCode,
      studentName: currentUser === 'admin' ? 'Triệu Vỹ Admin' : 'Học Viên B2',
      timeRemainingSeconds: duration,
      timeElapsedSeconds: 0,
      answers: {},
      tabSwitchCount: 0,
      isSubmitted: false,
    };
    setExamState(retakeState);
    try {
      sessionStorage.setItem('activeExamState', JSON.stringify(retakeState));
    } catch {}
    setIsExamReviewMode(false);
    setIsExamRoomActive(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReviewExam = () => {
    let stateToUse = examState;
    if (!stateToUse.examCode) {
      try {
        const saved = localStorage.getItem('lastCompletedExamState');
        if (saved) {
          stateToUse = JSON.parse(saved);
          setExamState(stateToUse);
        }
      } catch {}
    }
    if (!selectedExam) {
      try {
        const savedModel = localStorage.getItem('lastCompletedExamModel');
        if (savedModel) {
          setSelectedExam(JSON.parse(savedModel));
        }
      } catch {}
    }
    setIsExamReviewMode(true);
    setIsExamRoomActive(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReviewHistoryExam = (item: ExamFeedItem) => {
    const matched = exams.find((e) => e.examCode === item.examCode);
    const examModelToUse: ExamModel = matched || {
      id: `history-exam-${item.examCode}`,
      name: item.description || `Đề thi ${item.examCode}`,
      examCode: item.examCode,
      level: item.examCode.includes('A1') ? 'A1' : (item.examCode.includes('A2') ? 'A2' : (item.examCode.includes('B1') ? 'B1' : (item.examCode.includes('C1') ? 'C1' : 'TELC B2'))),
      provider: item.examCode.toUpperCase().includes('GOETHE') ? 'GOETHE' : 'TELC',
      durationMinutes: 90,
      totalQuestions: 40,
      description: item.description || '',
    };
    setSelectedExam(examModelToUse);

    const restoredState: UserExamState = {
      examCode: item.examCode,
      studentName: item.studentName,
      score: item.score,
      maxScore: item.maxScore || (item.examCode.toUpperCase().includes('GOETHE') ? 100 : 105),
      readingScore: item.readingScore || 0,
      sprachScore: item.writingScore || 0,
      listeningScore: item.listeningScore || 0,
      writingScore: item.writingScore || 0,
      speakingScore: item.speakingScore || 0,
      statusText: item.statusText,
      timeRemainingSeconds: 0,
      timeElapsedSeconds: 5400,
      tabSwitchCount: 0,
      answers: item.answers || {},
      isSubmitted: true,
    };

    setExamState(restoredState);
    try {
      sessionStorage.setItem('activeExamState', JSON.stringify(restoredState));
      localStorage.setItem('lastCompletedExamState', JSON.stringify(restoredState));
      localStorage.setItem('lastCompletedExamModel', JSON.stringify(examModelToUse));
    } catch {}

    setIsExamReviewMode(true);
    setIsExamRoomActive(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Xem lại bài thi', `Đang mở bài làm ${item.examCode} (${item.score}/${item.maxScore}đ) với đáp án chi tiết.`, 'info');
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
            const targetRedirect = sessionStorage.getItem('redirectAfterLogin') as ActiveTab | null;
            if (targetRedirect) {
              sessionStorage.removeItem('redirectAfterLogin');
              navigateToApp(targetRedirect);
            } else {
              navigateToApp('dashboard');
            }
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
          selectedExam={selectedExam}
          vocabs={vocabs}
          onAnswerChange={handleAnswerChange}
          onFinishSection={handleFinishExamSubmit}
          onBackToDashboard={() => {
            setIsExamRoomActive(false);
            if (isExamReviewMode) {
              setIsExamReviewMode(false);
              setActiveTab('results');
            } else {
              const returnTab = previousExamTab || getExamTabFromLevel(selectedExam?.level, 'exam');
              setActiveTab(returnTab);
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
            previousExamTab={previousExamTab}
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
                  vocabsCount={vocabs.length}
                  grammarCount={grammarTopics.length}
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

              {/* TAB 2: EXAM REPOSITORY (B2, B1, A2, A1, C1) */}
              {activeTab === 'exam' && (
                <ExamsView
                  exams={exams}
                  levelLabel="B2"
                  initialLevelFilter="B2"
                  onSelectExam={(exam) => {
                    setPreviousExamTab('exam');
                    setSelectedExam(exam);
                    setActiveTab('exam-detail');
                  }}
                  onStartExam={(exam) => handleStartExamRoom(exam)}
                  onOpenNewExamModal={() => handleOpenCreateExam(null)}
                  onEditExam={(exam) => handleOpenCreateExam(exam)}
                  onDeleteExam={handleDeleteExam}
                  onShowToast={showToast}
                  currentUser={currentUser}
                />
              )}

              {activeTab === 'exam-c1' && (
                <ExamsView
                  exams={exams}
                  levelLabel="C1"
                  initialLevelFilter="C1"
                  onSelectExam={(exam) => {
                    setPreviousExamTab('exam-c1');
                    setSelectedExam(exam);
                    setActiveTab('exam-detail');
                  }}
                  onStartExam={(exam) => handleStartExamRoom(exam)}
                  onOpenNewExamModal={() => handleOpenCreateExam(null)}
                  onEditExam={(exam) => handleOpenCreateExam(exam)}
                  onDeleteExam={handleDeleteExam}
                  onShowToast={showToast}
                  currentUser={currentUser}
                />
              )}

              {activeTab === 'exam-b1' && (
                <ExamsView
                  exams={exams}
                  levelLabel="B1"
                  initialLevelFilter="B1"
                  onSelectExam={(exam) => {
                    setPreviousExamTab('exam-b1');
                    setSelectedExam(exam);
                    setActiveTab('exam-detail');
                  }}
                  onStartExam={(exam) => handleStartExamRoom(exam)}
                  onOpenNewExamModal={() => handleOpenCreateExam(null)}
                  onEditExam={(exam) => handleOpenCreateExam(exam)}
                  onDeleteExam={handleDeleteExam}
                  onShowToast={showToast}
                  currentUser={currentUser}
                />
              )}

              {activeTab === 'exam-a2' && (
                <ExamsView
                  exams={exams}
                  levelLabel="A2"
                  initialLevelFilter="A2"
                  onSelectExam={(exam) => {
                    setPreviousExamTab('exam-a2');
                    setSelectedExam(exam);
                    setActiveTab('exam-detail');
                  }}
                  onStartExam={(exam) => handleStartExamRoom(exam)}
                  onOpenNewExamModal={() => handleOpenCreateExam(null)}
                  onEditExam={(exam) => handleOpenCreateExam(exam)}
                  onDeleteExam={handleDeleteExam}
                  onShowToast={showToast}
                  currentUser={currentUser}
                />
              )}

              {activeTab === 'exam-a1' && (
                <ExamsView
                  exams={exams}
                  levelLabel="A1"
                  initialLevelFilter="A1"
                  onSelectExam={(exam) => {
                    setPreviousExamTab('exam-a1');
                    setSelectedExam(exam);
                    setActiveTab('exam-detail');
                  }}
                  onStartExam={(exam) => handleStartExamRoom(exam)}
                  onOpenNewExamModal={() => handleOpenCreateExam(null)}
                  onEditExam={(exam) => handleOpenCreateExam(exam)}
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
                  onBackToDashboard={() => {
                    const returnTab = previousExamTab || getExamTabFromLevel(selectedExam?.level, 'exam');
                    setActiveTab(returnTab);
                  }}
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
                    onEditTopic={(topic) => {
                      setEditingItem(topic);
                      setCreateItemType('grammar');
                      setActiveTab('create-item');
                    }}
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
                    onBack={() => setActiveTab(previousExamTab)}
                    onStartExam={() => handleStartExamRoom(selectedExam)}
                    onShowToast={showToast}
                    comments={discussionComments}
                    onAddComment={handleAddComment}
                    onToggleLikeComment={handleToggleLikeComment}
                  />
                ) : (
                  <ExamsView
                    exams={exams.filter((e) => String(e.level || '').includes('B2') || !e.level)}
                    levelLabel="B2"
                    onSelectExam={(exam) => {
                      setPreviousExamTab('exam');
                      setSelectedExam(exam);
                      setActiveTab('exam-detail');
                    }}
                    onStartExam={(exam) => handleStartExamRoom(exam)}
                    onOpenNewExamModal={() => handleOpenCreateExam(null)}
                    onEditExam={(exam) => handleOpenCreateExam(exam)}
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
                    initialLevel={createItemType === 'exam' ? (editingItem?.level || getInitialExamLevelForTab(previousExamTab)) : undefined}
                    onBack={(targetLevel) => handleBackFromCreateItem(targetLevel)}
                    onAddVocab={handleAddVocab}
                    onAddBulkVocab={handleAddBulkVocab}
                    onAddExam={handleAddExam}
                    onAddGrammar={handleAddGrammar}
                    onUpdateVocab={handleUpdateVocab}
                    onUpdateExam={handleUpdateExam}
                    onUpdateGrammar={handleUpdateGrammar}
                    onShowToast={showToast}
                  />
                ) : (
                  <ExamsView
                    exams={exams.filter((e) => String(e.level || '').includes('B2') || !e.level)}
                    levelLabel="B2"
                    onSelectExam={(exam) => {
                      setSelectedExam(exam);
                      setActiveTab('exam-detail');
                    }}
                    onStartExam={(exam) => handleStartExamRoom(exam)}
                    onOpenNewExamModal={() => handleOpenCreateExam(null)}
                    onEditExam={(exam) => handleOpenCreateExam(exam)}
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
                <ExamHistoryView
                  historyItems={liveFeed}
                  exams={exams}
                  onReviewExam={handleReviewHistoryExam}
                  onSelectExam={(ex) => {
                    setSelectedExam(ex);
                    handleStartExamRoom(ex);
                  }}
                />
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
