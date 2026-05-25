import React, { memo } from "react";
import { User, Lock, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LoginFormProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPasswordClick: () => void;
  isLoading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = memo(({
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  onForgotPasswordClick,
  isLoading,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 animate-in fade-in duration-150">
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Email đăng nhập</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <User className="h-3.5 w-3.5" />
          </span>
          <Input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus-visible:border-sky-500/80 focus-visible:ring-sky-500/20 text-xs h-9 rounded-lg"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Mật khẩu</label>
          <button 
            type="button"
            onClick={onForgotPasswordClick}
            className="text-[10px] font-extrabold text-sky-600 hover:text-sky-500 transition-colors focus:outline-none"
          >
            Quên mật khẩu?
          </button>
        </div>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Lock className="h-3.5 w-3.5" />
          </span>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus-visible:border-sky-500/80 focus-visible:ring-sky-500/20 text-xs h-9 rounded-lg"
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-sky-600 text-white hover:bg-sky-500 font-bold shadow-md shadow-sky-600/10 gap-2 h-9 text-xs mt-2 rounded-lg cursor-pointer"
        disabled={isLoading}
      >
        {isLoading ? "Đang xác thực..." : "Đăng nhập hệ thống"}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
});

LoginForm.displayName = "LoginForm";
