import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell, Send, Loader2, Smartphone } from "lucide-react";
import type { Promotion } from "@/services/promotion-service";

interface PromotionsNotifyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  promo: Promotion | null;
  notifyTitle: string;
  setNotifyTitle: (val: string) => void;
  notifyBody: string;
  setNotifyBody: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}

export const PromotionsNotifyDialog: React.FC<PromotionsNotifyDialogProps> = ({
  isOpen,
  onOpenChange,
  promo,
  notifyTitle,
  setNotifyTitle,
  notifyBody,
  setNotifyBody,
  onSubmit,
  isPending,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-2xl w-full bg-card border-border text-foreground p-5 rounded-xl shadow-2xl flex flex-col justify-between overflow-hidden transition-all duration-300">
        <DialogHeader className="pb-3 border-b border-border/40 shrink-0">
          <DialogTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-500 animate-swing" />
            Gửi thông báo chương trình ưu đãi
          </DialogTitle>
          <DialogDescription className="text-[11px] text-muted-foreground mt-0.5">
            Gửi tin nhắn đẩy (Push Notification) đến thiết bị di động của tất cả người dùng ứng dụng Bookstore.
          </DialogDescription>
        </DialogHeader>

        {/* Dialog body content */}
        <form onSubmit={onSubmit} className="space-y-4 my-2">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Form Inputs (7/12 width) */}
            <div className="md:col-span-7 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                  Tiêu đề thông báo
                </label>
                <input
                  type="text"
                  value={notifyTitle}
                  onChange={(e) => setNotifyTitle(e.target.value)}
                  placeholder="Nhập tiêu đề thông báo..."
                  className="w-full rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground shadow-xs focus:ring-1 focus:ring-primary focus:border-primary focus-visible:outline-none"
                  disabled={isPending}
                  required
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                  Nội dung tin nhắn
                </label>
                <textarea
                  rows={4}
                  value={notifyBody}
                  onChange={(e) => setNotifyBody(e.target.value)}
                  placeholder="Nhập nội dung bưu tin gửi đến thiết bị..."
                  className="w-full rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold leading-relaxed text-foreground shadow-xs focus:ring-1 focus:ring-primary focus:border-primary focus-visible:outline-none resize-none"
                  disabled={isPending}
                  required
                />
              </div>
            </div>

            {/* iOS Mobile lockscreen preview mockup (5/12 width) */}
            <div className="md:col-span-5 flex flex-col justify-center border border-border/80 bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-xl shadow-inner relative">
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest text-center mb-3 block">
                Xem trước trên di động
              </span>
              
              {/* Simulated lock screen banner */}
              <div className="bg-slate-900/90 dark:bg-slate-950/95 text-white rounded-2xl p-3.5 shadow-lg border border-white/10 select-none max-w-sm mx-auto w-full transition-all duration-300">
                <div className="flex items-center justify-between text-[9px] text-white/50 mb-1 font-semibold">
                  <div className="flex items-center gap-1">
                    <Smartphone className="h-3 w-3 text-sky-400" />
                    <span>BOOKSTORE APP</span>
                  </div>
                  <span>bây giờ</span>
                </div>
                <p className="font-extrabold text-[11.5px] text-white tracking-wide truncate">
                  {notifyTitle || "Tiêu đề thông báo..."}
                </p>
                <p className="text-[10px] text-white/80 font-semibold leading-relaxed line-clamp-3 mt-0.5 whitespace-pre-wrap">
                  {notifyBody || "Nội dung bưu tin chi tiết sẽ hiển thị ở đây..."}
                </p>
              </div>
            </div>
          </div>

          {/* Dialog Footer Actions */}
          <DialogFooter className="pt-3 border-t border-border/40 gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="text-[10px] font-black uppercase tracking-wider h-9 px-4 cursor-pointer"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-wider gap-1.5 cursor-pointer h-9 px-5 shadow-sm"
            >
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              Gửi thông báo ngay
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
