import React, { memo } from "react";
import { User, Lock, ShieldAlert, ArrowLeft, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ForgotPasswordFlowProps {
  view: "forgot-email" | "forgot-otp" | "forgot-new-password";
  setView: (val: "forgot-email" | "forgot-otp" | "forgot-new-password" | "login") => void;
  forgotEmail: string;
  setForgotEmail: (val: string) => void;
  forgotOtp: string;
  setForgotOtp: (val: string) => void;
  forgotNewPassword: string;
  setForgotNewPassword: (val: string) => void;
  forgotConfirmNewPassword: string;
  setForgotConfirmNewPassword: (val: string) => void;
  onRequestReset: (e: React.FormEvent) => void;
  onVerifyOtp: (e: React.FormEvent) => void;
  onConfirmNewPassword: (e: React.FormEvent) => void;
  onResetToLogin: () => void;
  isForgotLoading: boolean;
}

export const ForgotPasswordFlow: React.FC<ForgotPasswordFlowProps> = memo(({
  view,
  setView,
  forgotEmail,
  setForgotEmail,
  forgotOtp,
  setForgotOtp,
  forgotNewPassword,
  setForgotNewPassword,
  forgotConfirmNewPassword,
  setForgotConfirmNewPassword,
  onRequestReset,
  onVerifyOtp,
  onConfirmNewPassword,
  onResetToLogin,
  isForgotLoading,
}) => {
  if (view === "forgot-email") {
    return (
      <form onSubmit={onRequestReset} className="space-y-4 animate-in fade-in duration-150">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Email khôi phục tài khoản</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <User className="h-3.5 w-3.5" />
            </span>
            <Input
              type="email"
              placeholder="email@example.com"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="pl-10 border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus-visible:border-sky-500/80 focus-visible:ring-sky-500/20 text-xs h-9 rounded-lg"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-sky-600 text-white hover:bg-sky-500 font-bold shadow-md shadow-sky-600/10 gap-2 h-9 text-xs mt-2 rounded-lg cursor-pointer"
          disabled={isForgotLoading}
        >
          {isForgotLoading ? "Đang gửi mã OTP..." : "Gửi mã xác nhận OTP"}
          <ArrowRight className="h-4 w-4" />
        </Button>

        <button
          type="button"
          onClick={onResetToLogin}
          className="flex items-center justify-center gap-1.5 w-full text-[11px] font-bold text-slate-500 hover:text-slate-800 mt-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Quay lại Đăng nhập
        </button>
      </form>
    );
  }

  if (view === "forgot-otp") {
    return (
      <form onSubmit={onVerifyOtp} className="space-y-4 animate-in fade-in duration-150">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Nhập mã OTP</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <ShieldAlert className="h-3.5 w-3.5" />
            </span>
            <Input
              type="text"
              placeholder="Mã OTP gồm 6 chữ số"
              maxLength={6}
              value={forgotOtp}
              onChange={(e) => setForgotOtp(e.target.value)}
              className="pl-10 border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus-visible:border-sky-500/80 focus-visible:ring-sky-500/20 text-xs font-bold tracking-widest text-center h-9 rounded-lg"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-sky-600 text-white hover:bg-sky-500 font-bold shadow-md shadow-sky-600/10 gap-2 h-9 text-xs mt-2 rounded-lg cursor-pointer"
          disabled={isForgotLoading}
        >
          {isForgotLoading ? "Đang xác thực..." : "Xác nhận mã OTP"}
          <ArrowRight className="h-4 w-4" />
        </Button>

        <button
          type="button"
          onClick={() => setView("forgot-email")}
          className="flex items-center justify-center gap-1.5 w-full text-[11px] font-bold text-slate-500 hover:text-slate-800 mt-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Nhập lại Email
        </button>
      </form>
    );
  }

  if (view === "forgot-new-password") {
    return (
      <form onSubmit={onConfirmNewPassword} className="space-y-4 animate-in fade-in duration-150">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Mật khẩu mới</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Lock className="h-3.5 w-3.5" />
            </span>
            <Input
              type="password"
              placeholder="Tối thiểu 6 ký tự"
              value={forgotNewPassword}
              onChange={(e) => setForgotNewPassword(e.target.value)}
              className="pl-10 border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus-visible:border-sky-500/80 focus-visible:ring-sky-500/20 text-xs h-9 rounded-lg"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Xác nhận mật khẩu</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Lock className="h-3.5 w-3.5" />
            </span>
            <Input
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              value={forgotConfirmNewPassword}
              onChange={(e) => setForgotConfirmNewPassword(e.target.value)}
              className="pl-10 border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus-visible:border-sky-500/80 focus-visible:ring-sky-500/20 text-xs h-9 rounded-lg"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-sky-600 text-white hover:bg-sky-500 font-bold shadow-md shadow-sky-600/10 gap-2 h-9 text-xs mt-2 rounded-lg cursor-pointer"
          disabled={isForgotLoading}
        >
          {isForgotLoading ? "Đang cập nhật..." : "Cập nhật mật khẩu mới"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>
    );
  }

  return null;
});

ForgotPasswordFlow.displayName = "ForgotPasswordFlow";
