import React, { useState } from "react";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { BookCarousel } from "@/components/landing/book-carousel";
import { Features } from "@/components/landing/features";
import { LoginModal } from "@/components/landing/login-modal";

export const Login: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-y-auto bg-gradient-to-br from-sky-100 via-white to-sky-50 text-slate-800 selection:bg-sky-600 selection:text-white font-sans">
      
      {/* Decorative Soft Ambient Sea-blue Glows */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-sky-200/30 blur-[130px] animate-pulse" />
      <div className="pointer-events-none absolute top-1/2 right-10 h-[600px] w-[600px] rounded-full bg-blue-100/20 blur-[150px] animate-pulse duration-[8000ms]" />

      {/* 1. Header (Fixed at the top) */}
      <Header onLoginClick={() => setShowLoginModal(true)} />
      
      {/* 2. Main Sections (Vertical flow containing horizontal scrolling carousel) */}
      <main className="pt-16 pb-20">
        <Hero onLoginClick={() => setShowLoginModal(true)} />
        <BookCarousel />
        <Features />
      </main>

      {/* 3. Footer */}
      <footer className="border-t border-slate-100 bg-white py-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 E-Book E-Commerce Portal. Tất cả quyền được bảo lưu.</p>
          <div className="flex gap-4">
            <span className="hover:text-sky-600 cursor-pointer transition-colors">Chính sách bảo mật</span>
            <span>•</span>
            <span className="hover:text-sky-600 cursor-pointer transition-colors">Điều khoản dịch vụ</span>
            <span>•</span>
            <span className="hover:text-sky-600 cursor-pointer transition-colors">Bảo mật SSL 256-bit</span>
          </div>
        </div>
      </footer>

      {/* 4. Glassmorphic Modal Overlay */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}

    </div>
  );
};
