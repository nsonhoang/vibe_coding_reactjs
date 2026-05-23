import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit, Power, Trash2, Tag } from "lucide-react";
import type { Voucher } from "@/services/voucher-service";

interface VouchersGridProps {
  vouchers: Voucher[];
  onEdit: (voucher: Voucher) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}

export const VouchersGrid: React.FC<VouchersGridProps> = ({
  vouchers,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {vouchers.map((v) => {
        const isExpired = new Date(v.endDate) < new Date();
        const isPercentage = v.discountType === "PERCENTAGE";
        const progressPercentage = v.usageLimit 
          ? Math.min((v.usedCount / v.usageLimit) * 100, 100) 
          : 0;

        return (
          <Card 
            key={v.id} 
            className={`relative overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
              !v.isActive || isExpired ? "opacity-70 dark:opacity-60" : ""
            }`}
          >
            {/* Top brand color stripe */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${
              !v.isActive || isExpired ? "bg-slate-350 dark:bg-slate-700" : "bg-[#00288e]"
            }`} />
            
            <CardHeader className="pb-3 pt-5 px-5">
              <div className="flex items-center justify-between">
                <Badge className="bg-blue-500/10 border border-blue-500/20 text-[#00288e] dark:text-blue-300 font-mono font-bold hover:bg-blue-500/20 text-[10px] py-0.5 px-2.5 rounded-lg select-none">
                  {v.code}
                </Badge>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                  v.isActive && !isExpired
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/5 dark:text-emerald-400"
                    : "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:bg-rose-500/5 dark:text-rose-400"
                }`}>
                  <span className={`w-1 h-1 rounded-full ${v.isActive && !isExpired ? "bg-emerald-500" : "bg-rose-500"}`} />
                  {v.isActive && !isExpired ? "Đang chạy" : isExpired ? "Hết hạn" : "Tạm ngắt"}
                </span>
              </div>
              
              <CardTitle className="text-base font-black text-slate-850 dark:text-white mt-3.5 flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-[#00288e] shrink-0" />
                Giảm {isPercentage ? `${v.discountValue}%` : `${v.discountValue.toLocaleString()} ₫`}
              </CardTitle>
              
              <CardDescription className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed font-semibold mt-1">
                Đơn tối thiểu: <span className="text-slate-600 dark:text-slate-300 font-mono">{v.minOrderValue.toLocaleString()} ₫</span>
                {isPercentage && v.maxDiscount && (
                  <>
                    <br />
                    Giảm tối đa: <span className="text-slate-600 dark:text-slate-300 font-mono">{v.maxDiscount.toLocaleString()} ₫</span>
                  </>
                )}
              </CardDescription>
            </CardHeader>

            {/* Coupon dotted division line */}
            <div className="relative flex items-center justify-between px-5 py-0.5">
              <div className="absolute left-[-6px] w-3 h-3 bg-slate-50 dark:bg-[#0b1c30] border-r border-slate-200 dark:border-slate-800 rounded-full" />
              <div className="w-full border-t border-dashed border-slate-200 dark:border-slate-800" />
              <div className="absolute right-[-6px] w-3 h-3 bg-slate-50 dark:bg-[#0b1c30] border-l border-slate-200 dark:border-slate-800 rounded-full" />
            </div>

            <CardContent className="pb-4 pt-3 px-5 text-[10px] text-slate-400 dark:text-slate-500 space-y-3">
              {/* Progress limit */}
              {v.usageLimit ? (
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-500 dark:text-slate-400">
                    <span>Lượt sử dụng</span>
                    <span className="text-slate-700 dark:text-slate-300 font-mono">{v.usedCount} / {v.usageLimit}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        progressPercentage >= 100 ? "bg-rose-500" : "bg-[#00288e] dark:bg-blue-500"
                      }`}
                      style={{ width: `${progressPercentage}%` }} 
                    />
                  </div>
                </div>
              ) : (
                <div className="flex justify-between font-bold text-slate-500 dark:text-slate-400">
                  <span>Lượt sử dụng</span>
                  <span className="text-slate-700 dark:text-slate-300 font-mono">{v.usedCount} (Không giới hạn)</span>
                </div>
              )}
              
              {/* Time limits */}
              <div className="flex items-center gap-1.5 font-bold text-[9px] text-slate-400 dark:text-slate-500">
                <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span>{formatDate(v.startDate)} - {formatDate(v.endDate)}</span>
              </div>
            </CardContent>

            {/* Row Actions */}
            <div className="flex items-center justify-end border-t border-slate-100 dark:border-slate-850 px-4 py-2 gap-1.5 bg-slate-50/50 dark:bg-slate-850/20">
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onEdit(v)}
                title="Cập nhật mã"
                className="h-7 w-7 p-0 rounded-lg hover:bg-slate-150 dark:hover:bg-slate-800 cursor-pointer"
              >
                <Edit className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onToggleStatus(v.id, v.isActive)}
                className={`h-7 w-7 p-0 rounded-lg cursor-pointer ${
                  v.isActive 
                    ? "text-amber-500 hover:text-amber-600 hover:bg-amber-550/10" 
                    : "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-550/10"
                }`}
                title={v.isActive ? "Tạm ngắt hoạt động" : "Kích hoạt trở lại"}
              >
                <Power className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onDelete(v.id)}
                className="h-7 w-7 p-0 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-550/10 cursor-pointer"
                title="Xóa mã giảm giá"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
