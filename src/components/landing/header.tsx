import React from "react";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onLoginClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  return (
    <header className="fixed top-0 right-0 left-0 z-40 flex h-16 items-center justify-between border-b border-sky-100/80 bg-white/75 backdrop-blur-md px-6 md:px-12 transition-all">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600 text-white shadow-md shadow-sky-600/20 animate-pulse-slow">
          <BookOpen className="h-5 w-5" />
        </div>
        <span className="text-sm font-extrabold tracking-wider uppercase text-sky-950">E-BOOK STORE</span>
      </div>
      
      <Button 
        onClick={onLoginClick}
        className="bg-sky-600 text-white hover:bg-sky-500 font-bold px-5 text-xs h-9 rounded-lg shadow-md shadow-sky-600/10 tracking-wide transition-all duration-300 active:scale-95"
      >
        Đăng nhập
      </Button>
    </header>
  );
};
