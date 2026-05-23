import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarDays, Percent, Edit3, Trash2 } from "lucide-react";
import type { Promotion } from "@/services/promotion-service";

interface PromotionsMetaCardProps {
  promotion: Promotion;
  onEditPromo: (promo: Promotion) => void;
  onRemovePromo: (id: string) => void;
  formatDate: (dateStr: string) => string;
  getPromoStatus: (promo: Promotion) => { text: string; class: string };
}

export const PromotionsMetaCard: React.FC<PromotionsMetaCardProps> = ({
  promotion,
  onEditPromo,
  onRemovePromo,
  formatDate,
  getPromoStatus,
}) => {
  const status = getPromoStatus(promotion);

  return (
    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/20">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-850 dark:text-slate-100 flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4 text-primary" />
          Cấu hình chương trình
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-5 text-xs">
        {/* Tên chương trình */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Tên chương trình
          </span>
          <p className="text-sm font-black text-slate-900 dark:text-white">
            {promotion.name}
          </p>
        </div>

        {/* Rate & Status grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Tỷ lệ chiết khấu
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-black border border-rose-500/25">
              <Percent className="h-3.5 w-3.5" />
              -{promotion.discountRate}% Giảm
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Trạng thái chạy
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded text-xs font-extrabold border ${status.class} border-slate-200/10`}>
              {status.text}
            </span>
          </div>
        </div>

        {/* Date constraints */}
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center font-semibold text-slate-650 dark:text-slate-450">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-slate-400" />
              Ngày bắt đầu:
            </span>
            <span className="font-mono text-slate-850 dark:text-slate-300">
              {formatDate(promotion.startDate)}
            </span>
          </div>
          <div className="flex justify-between items-center font-semibold text-slate-650 dark:text-slate-450">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-slate-400" />
              Ngày kết thúc:
            </span>
            <span className="font-mono text-slate-850 dark:text-slate-300">
              {formatDate(promotion.endDate)}
            </span>
          </div>
        </div>

        {/* Edit & Delete Action Panel */}
        <div className="pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
          <Button
            type="button"
            onClick={() => onEditPromo(promotion)}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs h-10 rounded-lg shadow-sm shadow-amber-500/10 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="h-4 w-4" />
            Chỉnh sửa chương trình
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => onRemovePromo(promotion.id)}
            className="w-full border-red-200/60 text-red-500 hover:text-white hover:bg-red-500 hover:border-red-500 font-bold text-xs h-10 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Gỡ bỏ chương trình
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
