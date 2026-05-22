import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api-client";
import { 
  BookOpen, 
  User, 
  Lock, 
  AlertCircle, 
  ArrowRight, 
  X, 
  Info, 
  KeyRound,
  ShieldAlert,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";

interface LoginModalProps {
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  
  // Login form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // View state machine
  const [view, setView] = useState<"login" | "forgot-email" | "forgot-otp" | "forgot-new-password">("login");
  
  // Forgot password form states
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmNewPassword, setForgotConfirmNewPassword] = useState("");
  
  // Token state from APIs
  const [otpToken, setOtpToken] = useState<string | null>(null);
  const [resetPasswordConfirmToken, setResetPasswordConfirmToken] = useState<string | null>(null);
  
  // Status and Loading states
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  // Submit standard login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);

    if (!email || !password) {
      setError("Vui lòng điền đầy đủ email và mật khẩu.");
      return;
    }
    
    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/staff/dashboard");
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    }
  };

  // STEP 1: Request OTP
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setIsForgotLoading(true);

    if (!forgotEmail) {
      setError("Vui lòng nhập email của bạn.");
      setIsForgotLoading(false);
      return;
    }

    try {
      const response = await apiFetch<{ data: string }>("/v1/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email: forgotEmail }),
        skipAuth: true,
      });
      
      setOtpToken(response.data);
      setInfoMessage("Mã OTP khôi phục mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.");
      setView("forgot-otp");
    } catch (err: any) {
      setError(err?.message || "Yêu cầu khôi phục mật khẩu thất bại. Vui lòng kiểm tra lại email.");
    } finally {
      setIsForgotLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setIsForgotLoading(true);

    if (!forgotOtp) {
      setError("Vui lòng nhập mã OTP gồm 6 chữ số.");
      setIsForgotLoading(false);
      return;
    }

    try {
      const response = await apiFetch<{ data: string }>(`/v1/auth/reset-password/${otpToken}`, {
        method: "POST",
        body: JSON.stringify({ otp: forgotOtp }),
        skipAuth: true,
      });

      setResetPasswordConfirmToken(response.data);
      setInfoMessage("Xác thực mã OTP thành công! Vui lòng thiết lập mật khẩu bảo mật mới.");
      setView("forgot-new-password");
    } catch (err: any) {
      setError(err?.message || "Mã OTP không chính xác hoặc đã hết hạn.");
    } finally {
      setIsForgotLoading(false);
    }
  };

  // STEP 3: Confirm and set new password
  const handleConfirmNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setIsForgotLoading(true);

    if (!forgotNewPassword || !forgotConfirmNewPassword) {
      setError("Vui lòng nhập mật khẩu mới và xác nhận.");
      setIsForgotLoading(false);
      return;
    }

    if (forgotNewPassword !== forgotConfirmNewPassword) {
      setError("Mật khẩu xác nhận không trùng khớp.");
      setIsForgotLoading(false);
      return;
    }

    if (forgotNewPassword.length < 6) {
      setError("Mật khẩu mới phải có độ dài tối thiểu 6 ký tự.");
      setIsForgotLoading(false);
      return;
    }

    try {
      await apiFetch<{ data: string }>("/v1/auth/reset-password/confirm", {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${resetPasswordConfirmToken}`,
        },
        body: JSON.stringify({ newPassword: forgotNewPassword }),
        skipAuth: true,
      });

      setInfoMessage("Chúc mừng! Đặt lại mật khẩu thành công. Hãy dùng mật khẩu mới để đăng nhập.");
      setView("login");
      
      // Auto fill the email for user convenience
      setEmail(forgotEmail);
      setPassword("");
      
      // Clear flow states
      setForgotEmail("");
      setForgotOtp("");
      setForgotNewPassword("");
      setForgotConfirmNewPassword("");
      setOtpToken(null);
      setResetPasswordConfirmToken(null);
    } catch (err: any) {
      setError(err?.message || "Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
    } finally {
      setIsForgotLoading(false);
    }
  };

  // Reset back to main login view
  const handleResetToLogin = () => {
    setError(null);
    setInfoMessage(null);
    setForgotEmail("");
    setForgotOtp("");
    setForgotNewPassword("");
    setForgotConfirmNewPassword("");
    setOtpToken(null);
    setResetPasswordConfirmToken(null);
    setView("login");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop blur */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Box */}
      <div className="z-10 w-full max-w-md border border-sky-100 bg-white/95 backdrop-blur-2xl text-slate-800 shadow-2xl shadow-sky-600/10 rounded-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="relative p-6 pt-8">
          
          {/* Close Trigger */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full border border-slate-100 bg-slate-50 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* TITLE & LOGO BY VIEW */}
          <div className="text-center pb-6">
            <div className="flex justify-center mb-3">
              {view === "login" ? (
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600 text-white shadow-lg shadow-sky-600/20">
                  <BookOpen className="h-5.5 w-5.5" />
                </div>
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-500/20 animate-pulse">
                  <KeyRound className="h-5.5 w-5.5" />
                </div>
              )}
            </div>
            
            {view === "login" && (
              <>
                <h3 className="text-lg font-bold tracking-tight text-slate-950 uppercase">Chào mừng quay lại</h3>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-1">Cổng Quản trị hệ thống bán sách</p>
              </>
            )}

            {view === "forgot-email" && (
              <>
                <h3 className="text-lg font-bold tracking-tight text-slate-950 uppercase">Khôi phục mật khẩu</h3>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-1">Bước 1: Điền email để nhận mã OTP</p>
              </>
            )}

            {view === "forgot-otp" && (
              <>
                <h3 className="text-lg font-bold tracking-tight text-slate-950 uppercase">Xác thực mã OTP</h3>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-1">Bước 2: Nhập mã OTP gồm 6 chữ số</p>
              </>
            )}

            {view === "forgot-new-password" && (
              <>
                <h3 className="text-lg font-bold tracking-tight text-slate-950 uppercase">Mật khẩu bảo mật mới</h3>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-1">Bước 3: Thiết lập mật khẩu mới</p>
              </>
            )}
          </div>

          {/* ALERTS */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 p-3 text-xs text-red-600 mb-4 animate-in slide-in-from-top-1 duration-150">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {infoMessage && (
            <div className="flex items-start gap-2 rounded-lg bg-sky-50 border border-sky-100 p-3 text-xs text-sky-700 mb-4 animate-in slide-in-from-top-1 duration-150">
              {view === "login" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
              ) : (
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
              )}
              <span className="leading-normal font-medium">{infoMessage}</span>
            </div>
          )}

          {/* DYNAMIC FORMS */}
          {view === "login" && (
            <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-150">
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
                    onClick={() => {
                      setError(null);
                      setInfoMessage(null);
                      setView("forgot-email");
                    }}
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
          )}

          {view === "forgot-email" && (
            <form onSubmit={handleRequestReset} className="space-y-4 animate-in fade-in duration-150">
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
                onClick={handleResetToLogin}
                className="flex items-center justify-center gap-1.5 w-full text-[11px] font-bold text-slate-500 hover:text-slate-800 mt-2 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Quay lại Đăng nhập
              </button>
            </form>
          )}

          {view === "forgot-otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in duration-150">
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
          )}

          {view === "forgot-new-password" && (
            <form onSubmit={handleConfirmNewPassword} className="space-y-4 animate-in fade-in duration-150">
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
          )}

        </div>
        
        <div className="border-t border-slate-100 bg-slate-50 py-3.5 text-center">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
            © 2026 E-Book Store. Bảo mật cấp độ doanh nghiệp.
          </p>
        </div>
      </div>
    </div>
  );
};
