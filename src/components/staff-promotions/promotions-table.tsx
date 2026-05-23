import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Gift } from "lucide-react";
import type { Promotion } from "@/services/promotion-service";

interface PromotionsTableProps {
  promotions: Promotion[];
  onRemovePromo: (id: string) => void;
  isSubmitting: boolean;
}

export const PromotionsTable: React.FC<PromotionsTableProps> = ({
  promotions,
  onRemovePromo,
  isSubmitting,
}) => {
  return (
    <Card className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/80">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-850 dark:text-slate-100 flex items-center gap-2">
          <Gift className="h-4.5 w-4.5 text-primary" />
          Danh sách giảm giá đang chạy
        </CardTitle>
        <CardDescription className="text-[11px] text-slate-500 mt-1">
          Thông tin chi tiết các chương trình chiết khấu trực tiếp trên từng đầu sách đang áp dụng
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Tên chương trình</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Sách áp dụng</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Tỷ lệ giảm</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Thời gian hoạt động</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider text-right">Gỡ bỏ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {promotions.map((promo) => {
                const bookNames = promo.books?.map((b) => b.title).join(", ") || "Tất cả sách";
                const startDateStr = new Date(promo.startDate).toLocaleDateString("vi-VN");
                const endDateStr = new Date(promo.endDate).toLocaleDateString("vi-VN");

                return (
                  <tr key={promo.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-850 dark:text-slate-200 group-hover:text-primary transition-colors text-xs">
                      {promo.name}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 max-w-xs truncate text-xs" title={bookNames}>
                      {bookNames}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-extrabold border border-rose-500/20">
                        -{promo.discountRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono text-xs">
                      {startDateStr} - {endDateStr}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        type="button"
                        onClick={() => onRemovePromo(promo.id)}
                        disabled={isSubmitting}
                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10 disabled:opacity-40 cursor-pointer h-7 w-7 rounded-lg"
                        title="Xóa chương trình"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {promotions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400 text-xs font-medium">
                    Chưa có chương trình khuyến mãi nào được tạo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
