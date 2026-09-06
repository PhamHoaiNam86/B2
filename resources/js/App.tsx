import React, { useState, useEffect } from 'react';
import { ActiveTab, VocabItem, VocabStatus, GrammarTopic, ExamModel, UserExamState } from './types';
import {
  INITIAL_EXAM_STATE,
  INITIAL_VOCABS,
  GRAMMAR_TOPICS,
  EXAM_MODELS,
  RECENT_STUDENTS,
  LIVE_EXAM_FEED,
} from './data/mockData';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { ExamRoomScreen } from './components/exam/ExamRoomScreen';
import { ExamsView } from './components/exam/ExamsView';
import { ExamDetailModal } from './components/exam/ExamDetailModal';
import { ExamModal } from './components/exam/ExamModal';
import { ResultsScreen } from './components/results/ResultsScreen';
import { VocabView } from './components/vocab/VocabView';
import { FlashcardsModal } from './components/vocab/FlashcardsModal';
import { GrammarView } from './components/grammar/GrammarView';
import { GrammarLessonModal } from './components/grammar/GrammarLessonModal';
import { SchreibenView } from './components/schreiben/SchreibenView';
import { DocumentMaterialView } from './components/docs/DocumentMaterialView';
import { StudentsView } from './components/students/StudentsView';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { NewItemModal } from './components/common/NewItemModal';
import { LandingPage } from './components/landing/LandingPage';
import { AuthPage } from './components/auth/AuthPage';
import { AlertTriangle, X } from 'lucide-react';

const getTabFromUrl = (): ActiveTab => {
  const path = window.location.pathname.replace(/^\//, '').toLowerCase();
  const validTabs: ActiveTab[] = [
    'dashboard', 'exam', 'exam-b1', 'exam-a2', 'exam-a1',
    'docs-b2', 'docs-schreiben', 'docs-sprechen',
    'results', 'vocab', 'grammar', 'students', 'history'
  ];
  if (path && validTabs.includes(path as ActiveTab)) {
    return path as ActiveTab;
  }
  return 'dashboard';
};

export default function App() {
  // View mode: 'landing' for pre-login public page, 'auth' for full login/register page, 'app' for internal portal
  const [viewMode, setViewMode] = useState<'landing' | 'auth' | 'app'>('landing');
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'register'>('login');

  // Navigation & User role
  const [activeTab, setActiveTabState] = useState<ActiveTab>(getTabFromUrl);

  const setActiveTab = (tab: ActiveTab) => {
    setActiveTabState(tab);
    const targetPath = tab === 'dashboard' ? '/' : `/${tab}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ tab }, '', targetPath);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setActiveTabState(getTabFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [currentUser, setCurrentUser] = useState<'admin' | 'student'>('admin');
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

  // Core Data States
  const [vocabs, setVocabs] = useState<VocabItem[]>(INITIAL_VOCABS);
  const [grammarTopics, setGrammarTopics] = useState<GrammarTopic[]>(GRAMMAR_TOPICS);
  const [exams, setExams] = useState<ExamModel[]>(EXAM_MODELS);
  const [students] = useState(RECENT_STUDENTS);
  const [liveFeed, setLiveFeed] = useState(LIVE_EXAM_FEED);

  // Modals
  const [selectedGrammarTopic, setSelectedGrammarTopic] = useState<GrammarTopic | null>(null);
  const [selectedExam, setSelectedExam] = useState<ExamModel | null>(null);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isFlashcardModalOpen, setIsFlashcardModalOpen] = useState(false);
  const [newItemModal, setNewItemModal] = useState<{ isOpen: boolean; type: 'vocab' | 'exam' }>({
    isOpen: false,
    type: 'vocab',
  });
  const [examModalTitle, setExamModalTitle] = useState('Thi Thử Chuẩn TELC B2 - Mô Phỏng');

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

  // Handlers for Exams
  const handleAddExam = (newExam: ExamModel) => {
    setExams((prev) => [newExam, ...prev]);
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
          onGoToAuth={(tab = 'login') => {
            setAuthInitialTab(tab);
            setViewMode('auth');
          }}
        />
      ) : viewMode === 'auth' && !isExamRoomActive ? (
        <AuthPage
          initialTab={authInitialTab}
          onBackToHome={() => setViewMode('landing')}
          onSuccessLogin={(role) => {
            setCurrentUser(role);
            setViewMode('app');
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
        /* STANDARD PORTAL LAYOUT: FIXED SIDEBAR + TOP NAVBAR + MAIN CONTENT */
        <div className="min-h-screen flex flex-col">
          {/* Left Sidebar */}
          <Sidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            isOpenMobile={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
            tabSwitchCount={examState.tabSwitchCount}
            currentUser={currentUser}
          />

          {/* Main Wrapper Offset for Desktop Sidebar with 5px gap */}
          <div className="pl-0 md:pl-[261px] flex-1 flex flex-col min-w-0">
            <Navbar
              activeTab={activeTab}
              searchQuery={searchQuery}
              onSearch={setSearchQuery}
              currentUser={currentUser}
              onToggleUser={() => {
                const nextRole = currentUser === 'admin' ? 'student' : 'admin';
                setCurrentUser(nextRole);
                showToast(
                  'Chuyển đổi giao diện',
                  `Đã chuyển sang chế độ ${nextRole === 'admin' ? 'Giáo viên / Admin (Toàn quyền)' : 'Học viên B2 (Chỉ học)'}.`,
                  'info'
                );
              }}
              onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
              onGoToLanding={() => setViewMode('landing')}
            />

            {/* Main Workspace */}
            <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
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
                />
              )}

              {/* TAB 2: EXAM REPOSITORY (B2, B1, A2, A1) */}
              {activeTab === 'exam' && (
                <ExamsView
                  exams={exams.filter((e) => e.level.includes('B2') || !e.level)}
                  levelLabel="B2"
                  onSelectExam={(exam) => setSelectedExam(exam)}
                  onStartExam={() => handleStartExamRoom()}
                  onOpenNewExamModal={() => setNewItemModal({ isOpen: true, type: 'exam' })}
                  onShowToast={showToast}
                  currentUser={currentUser}
                />
              )}

              {activeTab === 'exam-b1' && (
                <ExamsView
                  exams={exams.filter((e) => e.level.includes('B1'))}
                  levelLabel="B1"
                  onSelectExam={(exam) => setSelectedExam(exam)}
                  onStartExam={() => handleStartExamRoom()}
                  onOpenNewExamModal={() => setNewItemModal({ isOpen: true, type: 'exam' })}
                  onShowToast={showToast}
                  currentUser={currentUser}
                />
              )}

              {activeTab === 'exam-a2' && (
                <ExamsView
                  exams={exams.filter((e) => e.level.includes('A2'))}
                  levelLabel="A2"
                  onSelectExam={(exam) => setSelectedExam(exam)}
                  onStartExam={() => handleStartExamRoom()}
                  onOpenNewExamModal={() => setNewItemModal({ isOpen: true, type: 'exam' })}
                  onShowToast={showToast}
                  currentUser={currentUser}
                />
              )}

              {activeTab === 'exam-a1' && (
                <ExamsView
                  exams={exams.filter((e) => e.level.includes('A1'))}
                  levelLabel="A1"
                  onSelectExam={(exam) => setSelectedExam(exam)}
                  onStartExam={() => handleStartExamRoom()}
                  onOpenNewExamModal={() => setNewItemModal({ isOpen: true, type: 'exam' })}
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
                  onOpenAddModal={() => setNewItemModal({ isOpen: true, type: 'vocab' })}
                  onOpenFlashcardModal={() => setIsFlashcardModalOpen(true)}
                  onShowToast={showToast}
                  currentUser={currentUser}
                />
              )}

              {/* TAB 5: GRAMMAR HUB */}
              {activeTab === 'grammar' && (
                <GrammarView
                  topics={grammarTopics}
                  onSelectTopic={(topic) => setSelectedGrammarTopic(topic)}
                  onOpenDiagnosticTest={() => {
                    setExamModalTitle('Bài Test Chẩn Đoán Ngữ Pháp TELC B2');
                    setIsExamModalOpen(true);
                  }}
                  onOpenTrapQuiz={() => {
                    setExamModalTitle('Luyện Bẫy Đề Thi: indem vs. sodass');
                    setIsExamModalOpen(true);
                  }}
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
                <div className="bg-white border-[2.5px] border-[#1c1b1b] rounded-2xl p-6 brutal-shadow space-y-4">
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
            </main>
          </div>
        </div>
      )}

      {/* MODALS */}
      <GrammarLessonModal
        topic={selectedGrammarTopic}
        onClose={() => setSelectedGrammarTopic(null)}
        onCompleteTopic={handleCompleteGrammarTopic}
      />

      <FlashcardsModal
        vocabs={vocabs}
        isOpen={isFlashcardModalOpen}
        onClose={() => setIsFlashcardModalOpen(false)}
        onToggleFavorite={handleToggleFavorite}
      />

      <ExamModal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        title={examModalTitle}
      />

      <ExamDetailModal
        exam={selectedExam}
        onClose={() => setSelectedExam(null)}
        onStartExam={() => handleStartExamRoom()}
        onShowToast={showToast}
      />

      <NewItemModal
        isOpen={newItemModal.isOpen}
        type={newItemModal.type}
        onClose={() => setNewItemModal((prev) => ({ ...prev, isOpen: false }))}
        onAddVocab={handleAddVocab}
        onAddExam={handleAddExam}
        onShowToast={showToast}
      />

      {/* TOAST SYSTEM */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
