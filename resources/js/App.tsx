import React, { useState, useEffect } from 'react';
import { ActiveTab, VocabItem, VocabStatus, GrammarTopic, ExamModel, UserExamState, Student, ExamFeedItem } from './types';
import { INITIAL_EXAM_STATE } from './data/mockData';
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
import { AlertTriangle, X } from 'lucide-react';

const getInitialViewState = () => {
  const path = window.location.pathname.replace(/^\//, '').toLowerCase();
  if (path === 'login') {
    return { viewMode: 'auth' as const, authInitialTab: 'login' as const, activeTab: 'dashboard' as ActiveTab };
  }
  if (path === 'register') {
    return { viewMode: 'auth' as const, authInitialTab: 'register' as const, activeTab: 'dashboard' as ActiveTab };
  }
  const validTabs: ActiveTab[] = [
    'dashboard', 'exam', 'exam-b1', 'exam-a2', 'exam-a1',
    'docs-b2', 'docs-schreiben', 'docs-sprechen',
    'results', 'vocab', 'grammar', 'schreiben', 'students', 'history', 'profile',
    'flashcards', 'grammar-lesson', 'exam-detail', 'create-item'
  ];
  if (path && validTabs.includes(path as ActiveTab)) {
    return { viewMode: 'app' as const, authInitialTab: 'login' as const, activeTab: path as ActiveTab };
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

  // Fetch real data from Laravel MySQL / SQLite Database API
  useEffect(() => {
    // 1. Fetch Exams
    fetch('/api/v1/exams')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const mappedExams: ExamModel[] = res.data.map((item: any) => ({
            id: String(item.id || item.exam_code),
            name: item.name || item.title,
            examCode: item.exam_code,
            level: item.level || 'TELC B2',
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

  // Selected Data States for Page Views
  const [selectedGrammarTopic, setSelectedGrammarTopic] = useState<GrammarTopic | null>(null);
  const [selectedExam, setSelectedExam] = useState<ExamModel | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [createItemType, setCreateItemType] = useState<'vocab' | 'exam' | 'grammar'>('vocab');

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

  const handleAddVocab = (newVocab: VocabItem) => {
    setVocabs((prev) => [newVocab, ...prev]);
  };

  const handleUpdateVocab = (updatedVocab: VocabItem) => {
    setVocabs((prev) => prev.map((v) => (v.id === updatedVocab.id ? updatedVocab : v)));
  };

  const handleDeleteVocab = (id: string) => {
    setVocabs((prev) => prev.filter((v) => v.id !== id));
  };

  // Handlers for Exams
  const handleAddExam = (newExam: ExamModel) => {
    setExams((prev) => [newExam, ...prev]);
  };

  const handleUpdateExam = (updatedExam: ExamModel) => {
    setExams((prev) => prev.map((e) => (e.id === updatedExam.id ? updatedExam : e)));
  };

  const handleDeleteExam = (id: string) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
  };

  // Handlers for Grammar
  const handleAddGrammar = (newTopic: GrammarTopic) => {
    setGrammarTopics((prev) => [newTopic, ...prev]);
  };

  const handleUpdateGrammar = (updatedTopic: GrammarTopic) => {
    setGrammarTopics((prev) => prev.map((t) => (t.id === updatedTopic.id ? updatedTopic : t)));
  };

  const handleDeleteGrammar = (id: string) => {
    setGrammarTopics((prev) => prev.filter((t) => t.id !== id));
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

  const handleStartExamRoom = () => {
    setIsExamRoomActive(true);
    setActiveTab('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Vào phòng thi', 'Đã bắt đầu phiên thi thử TELC B2 với bộ đếm thời gian.', 'info');
  };

  const handleFinishExamSubmit = () => {
    setIsExamRoomActive(false);
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
    setIsExamRoomActive(true);
    setActiveTab('exam');
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
            setActiveTab('dashboard');
          }}
          formattedCountdown={formatCountdown(examState.timeRemainingSeconds)}
        />
      ) : (
        /* STANDARD PORTAL LAYOUT: FIXED SIDEBAR (256px) + 7px GAP + TOP NAVBAR + MAIN CONTENT (p-5px) */
        <div className="min-h-screen flex flex-col bg-[#e2e8f0]">
          {/* Left Sidebar */}
          <Sidebar
            activeTab={activeTab}
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
                  currentUser={currentUser}
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
                  onStartExam={() => handleStartExamRoom()}
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
                  onStartExam={() => handleStartExamRoom()}
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
                  onStartExam={() => handleStartExamRoom()}
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
                  onStartExam={() => handleStartExamRoom()}
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
              {activeTab === 'grammar-lesson' && selectedGrammarTopic && (
                <GrammarLessonView
                  topic={selectedGrammarTopic}
                  onBack={() => setActiveTab('grammar')}
                  onCompleteTopic={handleCompleteGrammarTopic}
                />
              )}

              {/* PAGE VIEW: TRANG CHI TIẾT BỘ ĐỀ THI */}
              {activeTab === 'exam-detail' && selectedExam && (
                <ExamDetailView
                  exam={selectedExam}
                  onBack={() => setActiveTab('exam')}
                  onStartExam={handleStartExamRoom}
                  onShowToast={showToast}
                />
              )}

              {/* PAGE VIEW: TRANG THÊM MỚI & CHỈNH SỬA TỪ VỰNG / ĐỀ THI / NGỮ PHÁP */}
              {activeTab === 'create-item' && (
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
