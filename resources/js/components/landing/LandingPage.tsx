import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  Sparkles,
  CheckCircle2,
  Star,
  Play,
  BookOpen,
  Brain,
  Headphones,
  Award,
  ShieldCheck,
  Zap,
  Users,
  ArrowRight,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  LogIn,
  PenTool,
} from 'lucide-react';

interface LandingPageProps {
  onGoToAuth: (tab?: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToAuth }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const handleOpenAuth = (tab: 'login' | 'register' = 'login') => onGoToAuth(tab);
  const bannerImages = [
    { src: '/images/banner_main.jpg', alt: 'Luyện thi tiếng Đức chứng chỉ GOETHE - TELC - ÖSD tất cả các trình độ A1-C1' },
  ];

  // GSAP Animation Refs for Scroll Reveal
  const subBannerRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const whyChooseRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bannerImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [bannerImages.length]);

  // GSAP IntersectionObserver Stagger Scroll Effect
  useEffect(() => {
    const sections = [subBannerRef, featuresRef, whyChooseRef, testimonialsRef];
    const observers: IntersectionObserver[] = [];

    sections.forEach((ref) => {
      if (!ref.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const items = entry.target.querySelectorAll('.gsap-stagger-item');
              if (items.length > 0) {
                gsap.fromTo(
                  items,
                  { opacity: 0, y: 35 },
                  {
                    opacity: 1,
                    y: 0,
                    duration: 0.75,
                    stagger: 0.12,
                    ease: 'power2.out',
                    overwrite: 'auto',
                  }
                );
              }
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );

      observer.observe(ref.current);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] font-sans selection:bg-[#F97316] selection:text-white">
      {/* -------------------------------------------------------------
          HEADER / NAVBAR PUBLIC
      ------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-[2.5px] border-[#111827] px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white border-2 border-[#111827] flex items-center justify-center font-black text-lg brutal-shadow-sm">
              TD
            </div>
            <div>
              <h1 className="text-lg font-black text-[#111827] font-heading leading-tight tracking-tight">
                TRIEUVY DEUTSCH
              </h1>
              <span className="text-[10px] font-bold text-[#4b5563] block -mt-0.5">
                TELC B2 Prep & Exam Portal
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-[#111827]">
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-[#2563EB] transition-colors cursor-pointer"
            >
              Thông tin & Tính năng
            </button>
            <button
              onClick={() => scrollToSection('why-choose')}
              className="hover:text-[#2563EB] transition-colors cursor-pointer"
            >
              Tại sao chọn
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="hover:text-[#2563EB] transition-colors cursor-pointer"
            >
              Đánh giá học viên
            </button>
          </nav>

          {/* Login / Portal Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenAuth('login')}
              className="px-4 py-2.5 bg-[#2563EB] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-sm hover:bg-[#1d4ed8] hover:translate-y-[-1px] transition-all cursor-pointer flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Vào Portal Luyện Thi</span>
            </button>
          </div>
        </div>
      </header>

      {/* -------------------------------------------------------------
          1. BANNER CAROUSEL SECTION
      ------------------------------------------------------------- */}
      <section className="relative w-full border-b-[2.5px] border-[#111827] bg-[#111827]">
        <div className="relative w-full overflow-hidden group cursor-pointer" onClick={() => handleOpenAuth('login')}>
          {bannerImages.map((slide, index) => (
            <div
              key={index}
              className={`w-full transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? 'block opacity-100 z-10' : 'hidden opacity-0 z-0'
              }`}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-auto block"
              />
            </div>
          ))}

          {bannerImages.length > 1 && (
            <>
              {/* Navigation Arrow Buttons */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 text-[#111827] border-2 border-[#111827] rounded-2xl flex items-center justify-center brutal-shadow hover:bg-white hover:scale-105 transition-all cursor-pointer"
                aria-label="Previous Banner"
              >
                <ChevronLeft className="w-6 h-6 stroke-[3]" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 text-[#111827] border-2 border-[#111827] rounded-2xl flex items-center justify-center brutal-shadow hover:bg-white hover:scale-105 transition-all cursor-pointer"
                aria-label="Next Banner"
              >
                <ChevronRight className="w-6 h-6 stroke-[3]" />
              </button>

              {/* Banner Slide Indicator Dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-[#111827]/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                {bannerImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide(index);
                    }}
                    className={`transition-all cursor-pointer rounded-full ${
                      index === currentSlide
                        ? 'w-8 h-3 bg-[#F97316] border border-white'
                        : 'w-3 h-3 bg-white/60 hover:bg-white'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sub-Banner Highlight Bar */}
        <div ref={subBannerRef} className="bg-white border-t-[2.5px] border-[#111827] py-6 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="gsap-stagger-item px-4 py-2 bg-[#f8fafc] border-2 border-[#111827] rounded-2xl text-xs font-black brutal-shadow-xs flex items-center gap-2 hover:-translate-y-1.5 hover:shadow-[4px_4px_0px_#111827] hover:border-[#2563EB] hover:bg-white transition-all duration-300 cursor-pointer" onClick={() => handleOpenAuth('login')}>
                <div className="p-1 rounded-lg bg-emerald-100 border border-[#111827]">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                </div>
                <span>Kho Từ vựng B2</span>
              </div>

              <div className="gsap-stagger-item px-4 py-2 bg-[#f8fafc] border-2 border-[#111827] rounded-2xl text-xs font-black brutal-shadow-xs flex items-center gap-2 hover:-translate-y-1.5 hover:shadow-[4px_4px_0px_#111827] hover:border-[#2563EB] hover:bg-white transition-all duration-300 cursor-pointer" onClick={() => handleOpenAuth('login')}>
                <div className="p-1 rounded-lg bg-sky-100 border border-[#111827]">
                  <Brain className="w-4 h-4 text-sky-700" />
                </div>
                <span>Ngữ pháp Bẫy Đề</span>
              </div>

              <div className="gsap-stagger-item px-4 py-2 bg-[#f8fafc] border-2 border-[#111827] rounded-2xl text-xs font-black brutal-shadow-xs flex items-center gap-2 hover:-translate-y-1.5 hover:shadow-[4px_4px_0px_#111827] hover:border-[#2563EB] hover:bg-white transition-all duration-300 cursor-pointer" onClick={() => handleOpenAuth('login')}>
                <div className="p-1 rounded-lg bg-amber-100 border border-[#111827]">
                  <Headphones className="w-4 h-4 text-amber-700" />
                </div>
                <span>Luyện nghe TELC</span>
              </div>

              <div className="gsap-stagger-item px-4 py-2 bg-[#f8fafc] border-2 border-[#111827] rounded-2xl text-xs font-black brutal-shadow-xs flex items-center gap-2 hover:-translate-y-1.5 hover:shadow-[4px_4px_0px_#111827] hover:border-[#2563EB] hover:bg-white transition-all duration-300 cursor-pointer" onClick={() => handleOpenAuth('login')}>
                <div className="p-1 rounded-lg bg-purple-100 border border-[#111827]">
                  <Award className="w-4 h-4 text-purple-700" />
                </div>
                <span>Đáp án chuẩn TELC</span>
              </div>
            </div>

            <button
              onClick={() => handleOpenAuth('register')}
              className="gsap-stagger-item px-6 py-3 bg-[#F97316] text-[#ffffff] border-2 border-[#111827] rounded-2xl text-xs font-black brutal-shadow-sm hover:bg-[#ea580c] hover:-translate-y-1 hover:shadow-[5px_5px_0px_#111827] transition-all cursor-pointer flex items-center gap-2 uppercase tracking-wide shrink-0"
            >
              <span>VÀO PHÒNG THI THỬ NGAY</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          2. THÔNG TIN & TÍNH NĂNG NỔI BẬT SECTION
      ------------------------------------------------------------- */}
      <section id="features" ref={featuresRef} className="py-16 sm:py-24 px-4 sm:px-6 bg-white border-b-[2.5px] border-[#111827]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="px-3 py-1 rounded-md bg-[#2563EB]/10 text-[#2563EB] text-xs font-black border border-[#2563EB]/30 uppercase">
              TÍNH NĂNG HỆ THỐNG
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#111827] font-heading">
              Hệ Thống Luyện Thi TELC B2 Toàn Diện
            </h2>
            <p className="text-sm font-medium text-[#4b5563]">
              Tất cả công cụ bạn cần để đạt chứng chỉ tiếng Đức TELC B2 ngay trong lần thi đầu tiên.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div
              onClick={() => handleOpenAuth('login')}
              className="gsap-stagger-item group bg-[#fcf9f8] border-[2.5px] border-[#111827] rounded-2xl p-6 brutal-shadow space-y-4 flex flex-col justify-between hover:-translate-y-2.5 hover:shadow-[8px_8px_0px_#111827] hover:border-[#2563EB] hover:bg-white transition-all duration-300 cursor-pointer"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#2563EB] text-white border-2 border-[#111827] flex items-center justify-center font-black brutal-shadow-xs group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-6 h-6 fill-current" />
                </div>
                <h3 className="text-lg font-black text-[#111827] font-heading group-hover:text-[#2563EB] transition-colors duration-300">
                  Phòng Thi Thử Mô Phỏng TELC
                </h3>
                <p className="text-xs font-medium text-[#4b5563] leading-relaxed">
                  Thi thử với bộ đếm giờ thực tế, chống gian lận tab switch và chấm điểm tức thì chuẩn thang điểm 300 của TELC.
                </p>
              </div>
              <button
                onClick={() => handleOpenAuth('login')}
                className="text-xs font-black text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer pt-2"
              >
                <span>Thi thử ngay</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>
            </div>

            {/* Feature 2 */}
            <div
              onClick={() => handleOpenAuth('login')}
              className="gsap-stagger-item group bg-[#fcf9f8] border-[2.5px] border-[#111827] rounded-2xl p-6 brutal-shadow space-y-4 flex flex-col justify-between hover:-translate-y-2.5 hover:shadow-[8px_8px_0px_#111827] hover:border-[#F97316] hover:bg-white transition-all duration-300 cursor-pointer"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#F97316] text-white border-2 border-[#111827] flex items-center justify-center font-black brutal-shadow-xs group-hover:scale-110 transition-transform duration-300">
                  <PenTool className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-[#111827] font-heading group-hover:text-[#F97316] transition-colors duration-300">
                  Luyện Viết & Nói Schreiben / Sprechen
                </h3>
                <p className="text-xs font-medium text-[#4b5563] leading-relaxed">
                  Dàn ý bài viết chuẩn, bài mẫu điểm cao và hệ thống từ vựng Redewendungen B2 giúp tối ưu điểm số Modul Schreiben & Sprechen.
                </p>
              </div>
              <button
                onClick={() => handleOpenAuth('login')}
                className="text-xs font-black text-[#F97316] hover:underline flex items-center gap-1 cursor-pointer pt-2"
              >
                <span>Xem bài mẫu Viết/Nói</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>
            </div>

            {/* Feature 3 */}
            <div
              onClick={() => handleOpenAuth('login')}
              className="gsap-stagger-item group bg-[#fcf9f8] border-[2.5px] border-[#111827] rounded-2xl p-6 brutal-shadow space-y-4 flex flex-col justify-between hover:-translate-y-2.5 hover:shadow-[8px_8px_0px_#111827] hover:border-[#10B981] hover:bg-white transition-all duration-300 cursor-pointer"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#10B981] text-white border-2 border-[#111827] flex items-center justify-center font-black brutal-shadow-xs group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-[#111827] font-heading group-hover:text-[#10B981] transition-colors duration-300">
                  Flashcard 3D & Kho Từ Vựng
                </h3>
                <p className="text-xs font-medium text-[#4b5563] leading-relaxed">
                  5.000+ từ vựng phân loại theo chủ đề Y tế, Điều dưỡng, Công sở kèm lật thẻ 3D ghi nhớ phản xạ cực nhanh.
                </p>
              </div>
              <button
                onClick={() => handleOpenAuth('login')}
                className="text-xs font-black text-[#10B981] hover:underline flex items-center gap-1 cursor-pointer pt-2"
              >
                <span>Học từ vựng</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>
            </div>

            {/* Feature 4 */}
            <div
              onClick={() => handleOpenAuth('login')}
              className="gsap-stagger-item group bg-[#fcf9f8] border-[2.5px] border-[#111827] rounded-2xl p-6 brutal-shadow space-y-4 flex flex-col justify-between hover:-translate-y-2.5 hover:shadow-[8px_8px_0px_#111827] hover:border-[#8B5CF6] hover:bg-white transition-all duration-300 cursor-pointer"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#8B5CF6] text-white border-2 border-[#111827] flex items-center justify-center font-black brutal-shadow-xs group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-[#111827] font-heading group-hover:text-[#8B5CF6] transition-colors duration-300">
                  Chuyên Đề Bẫy Sprachbausteine
                </h3>
                <p className="text-xs font-medium text-[#4b5563] leading-relaxed">
                  Tổng hợp bẫy ngữ pháp B2 thường gặp (indem, sodass, Konjunktiv II, N-Deklination) kèm phân tích đáp án chi tiết.
                </p>
              </div>
              <button
                onClick={() => handleOpenAuth('login')}
                className="text-xs font-black text-[#8B5CF6] hover:underline flex items-center gap-1 cursor-pointer pt-2"
              >
                <span>Luyện bẫy đề thi</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          3. TẠI SAO NÊN CHỌN TRIEUVY DEUTSCH SECTION
      ------------------------------------------------------------- */}
      <section id="why-choose" ref={whyChooseRef} className="py-16 sm:py-24 px-4 sm:px-6 bg-[#fff8e7] border-b-[2.5px] border-[#111827]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="px-3 py-1 rounded-md bg-[#ffe082] text-[#3e2723] text-xs font-black border border-[#111827] uppercase">
              ƯU THẾ VƯỢT TRỘI
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#111827] font-heading">
              Tại Sao Hơn 12.000+ Học Viên Tin Chọn TRIEUVY DEUTSCH?
            </h2>
            <p className="text-sm font-medium text-[#4b5563]">
              So sánh hiệu quả học tập giữa phương pháp truyền thống và nền tảng thông minh TRIEUVY DEUTSCH.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Card: Traditional method */}
            <div className="gsap-stagger-item group bg-white border-[2.5px] border-[#111827] rounded-2xl p-6 sm:p-8 brutal-shadow space-y-6 hover:-translate-y-2 hover:shadow-[8px_8px_0px_#111827] hover:border-rose-500 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 border-2 border-[#111827] flex items-center justify-center font-black group-hover:scale-110 transition-transform duration-300">
                  ✕
                </div>
                <h3 className="text-xl font-black text-[#111827] font-heading group-hover:text-rose-600 transition-colors">
                  Cách Tự Học Truyền Thống
                </h3>
              </div>

              <ul className="space-y-4 text-xs font-bold text-[#4b5563]">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">✕</span>
                  <span>Thiếu bài thi thử chuẩn cấu trúc TELC thực tế, khó tự chấm điểm Đọc/Nghe.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">✕</span>
                  <span>Bài viết Schreiben không có dàn ý bài mẫu chi tiết, dễ lặp lại lỗi sai ngữ pháp.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">✕</span>
                  <span>Học từ vựng tràn lan không đúng trọng tâm chuyên ngành B2 (Y tế, Điều dưỡng).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">✕</span>
                  <span>Tốn kém chi phí ôn luyện trung tâm mà không chủ động thời gian.</span>
                </li>
              </ul>
            </div>

            {/* Right Card: TRIEUVY DEUTSCH solution */}
            <div
              onClick={() => handleOpenAuth('register')}
              className="gsap-stagger-item group bg-[#2563EB] text-white border-[2.5px] border-[#111827] rounded-2xl p-6 sm:p-8 brutal-shadow space-y-6 hover:-translate-y-2 hover:shadow-[8px_8px_0px_#111827] hover:bg-[#1d4ed8] transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-[#2563EB] border-2 border-[#111827] flex items-center justify-center font-black group-hover:scale-110 transition-transform duration-300">
                  ✓
                </div>
                <h3 className="text-xl font-black text-white font-heading">
                  Nền Tảng TRIEUVY DEUTSCH
                </h3>
              </div>

              <ul className="space-y-4 text-xs font-extrabold text-blue-50">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4ade80] shrink-0 mt-0.5" />
                  <span>Kho đề thi thử phong phú có bấm giờ, chống gian lận và chấm điểm ngay lập tức.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4ade80] shrink-0 mt-0.5" />
                  <span>Hệ thống bài mẫu Schreiben chuẩn TELC từng câu, gợi ý từ vựng và cấu trúc cao cấp.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4ade80] shrink-0 mt-0.5" />
                  <span>Bộ từ vựng B2 chuẩn xác kèm thẻ ghi nhớ 3D lật thông minh giúp nhớ nhanh x3 lần.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4ade80] shrink-0 mt-0.5" />
                  <span>Học mọi lúc mọi nơi 24/7 với chi phí tối ưu nhất cho học viên.</span>
                </li>
              </ul>

              <button
                onClick={() => handleOpenAuth('register')}
                className="w-full py-3.5 bg-[#F97316] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow-sm hover:bg-[#ea580c] transition-all cursor-pointer uppercase tracking-wider"
              >
                Trải nghiệm ngay bây giờ
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          4. ĐÁNH GIÁ HỌC VIÊN SECTION
      ------------------------------------------------------------- */}
      <section id="testimonials" ref={testimonialsRef} className="py-16 sm:py-24 px-4 sm:px-6 bg-white border-b-[2.5px] border-[#111827]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="px-3 py-1 rounded-md bg-emerald-100 text-emerald-950 text-xs font-black border border-[#111827] uppercase">
              CẢM NHẬN HỌC VIÊN
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#111827] font-heading">
              Học Viên Đã Thi Đỗ TELC B2 Nói Gì?
            </h2>
            <p className="text-sm font-medium text-[#4b5563]">
              Hơn 12,000 học viên đã tự tin chinh phục chứng chỉ B2 nhờ TRIEUVY DEUTSCH.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Review 1 */}
            <div className="gsap-stagger-item group bg-[#fcf9f8] border-[2.5px] border-[#111827] rounded-2xl p-6 brutal-shadow space-y-4 flex flex-col justify-between hover:-translate-y-2.5 hover:shadow-[8px_8px_0px_#111827] hover:border-[#F97316] hover:bg-white transition-all duration-300 cursor-pointer">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400 group-hover:scale-105 transition-transform duration-300">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs font-medium text-[#374151] leading-relaxed italic">
                  "Nhờ kho bài mẫu Schreiben và bộ bẫy đề thi mà điểm viết của mình tăng từ 14 lên 28 điểm. Các cấu trúc Redewendungen được hướng dẫn rất tỉ mỉ!"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t-2 border-[#111827]/10">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Student avatar"
                  className="w-10 h-10 rounded-full border-2 border-[#111827] object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div>
                  <h4 className="text-sm font-black text-[#111827] group-hover:text-[#F97316] transition-colors">Nguyễn Minh Huyền</h4>
                  <span className="text-[10px] font-bold text-[#059669] block">
                    ★ Đã đỗ TELC B2 (282/300)
                  </span>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="gsap-stagger-item group bg-[#fcf9f8] border-[2.5px] border-[#111827] rounded-2xl p-6 brutal-shadow space-y-4 flex flex-col justify-between hover:-translate-y-2.5 hover:shadow-[8px_8px_0px_#111827] hover:border-[#2563EB] hover:bg-white transition-all duration-300 cursor-pointer">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400 group-hover:scale-105 transition-transform duration-300">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs font-medium text-[#374151] leading-relaxed italic">
                  "Kho từ vựng flashcard 3D theo từng chủ đề y tế giúp mình thuộc từ vựng cực nhanh. Giao diện mô phỏng phòng thi thì quá sát đề thật luôn!"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t-2 border-[#111827]/10">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Student avatar"
                  className="w-10 h-10 rounded-full border-2 border-[#111827] object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div>
                  <h4 className="text-sm font-black text-[#111827] group-hover:text-[#2563EB] transition-colors">Trần Hoàng Nam</h4>
                  <span className="text-[10px] font-bold text-[#059669] block">
                    ★ Đã đỗ TELC B2 (275/300)
                  </span>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="gsap-stagger-item group bg-[#fcf9f8] border-[2.5px] border-[#111827] rounded-2xl p-6 brutal-shadow space-y-4 flex flex-col justify-between hover:-translate-y-2.5 hover:shadow-[8px_8px_0px_#111827] hover:border-[#10B981] hover:bg-white transition-all duration-300 cursor-pointer">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400 group-hover:scale-105 transition-transform duration-300">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs font-medium text-[#374151] leading-relaxed italic">
                  "Phần bẫy đề Sprachbausteine cực kỳ hữu ích. Nhờ làm quen với các dạng bẫy trên TRIEUVY DEUTSCH mà khi vào phòng thi thật mình đạt điểm tối đa bài đọc!"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t-2 border-[#111827]/10">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                  alt="Student avatar"
                  className="w-10 h-10 rounded-full border-2 border-[#111827] object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div>
                  <h4 className="text-sm font-black text-[#111827] group-hover:text-[#10B981] transition-colors">Phạm Khánh Linh</h4>
                  <span className="text-[10px] font-bold text-[#059669] block">
                    ★ Đã đỗ TELC B2 (290/300)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          FOOTER CTA & FOOTER
      ------------------------------------------------------------- */}
      <footer id="contact" className="bg-[#111827] text-white py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="bg-[#2563EB] border-2 border-white rounded-3xl p-8 sm:p-12 text-center space-y-6 brutal-shadow hover:-translate-y-2 hover:shadow-[10px_10px_0px_#ffffff] transition-all duration-300 cursor-pointer" onClick={() => handleOpenAuth('register')}>
            <h2 className="text-3xl sm:text-5xl font-black font-heading text-white">
              Sẵn Sàng Chinh Phục Chứng Chỉ B2?
            </h2>
            <p className="text-sm sm:text-base font-semibold text-blue-100 max-w-xl mx-auto">
              Tham gia ngay hôm nay để trải nghiệm phòng thi thử mô phỏng thời gian thực và bộ đề luyện thi chuẩn quốc tế.
            </p>
            <button
              onClick={() => onGoToAuth('register')}
              className="px-8 py-4 bg-[#F97316] text-white border-2 border-white rounded-2xl text-sm font-black brutal-shadow hover:bg-[#ea580c] transition-all cursor-pointer uppercase tracking-wider inline-flex items-center gap-2"
            >
              <span>VÀO PHÒNG THI THỬ NGAY</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-800 text-xs font-medium text-slate-400">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white border border-white flex items-center justify-center font-black">
                TD
              </div>
              <span className="font-bold text-white text-sm">TRIEUVY DEUTSCH</span>
            </div>
            <p>© 2026 TRIEUVY DEUTSCH. Nền tảng mô phỏng & luyện thi TELC B2 chuẩn quốc tế.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
