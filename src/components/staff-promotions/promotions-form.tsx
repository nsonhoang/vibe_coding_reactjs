import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Percent, Sparkles } from "lucide-react";
import type { Book } from "@/services/book-service";

interface PromotionsFormProps {
  books: Book[];
  selectedBookId: string;
  setSelectedBookId: (id: string) => void;
  rate: number;
  setRate: (rate: number) => void;
  promoName: string;
  setPromoName: (name: string) => void;
  onApplyPromo: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export const PromotionsForm: React.FC<PromotionsFormProps> = ({
  books,
  selectedBookId,
  setSelectedBookId,
  rate,
  setRate,
  promoName,
  setPromoName,
  onApplyPromo,
  isSubmitting,
}) => {
  return (
    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden h-fit">
      <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/80">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-850 dark:text-slate-100 flex items-center gap-2">
          <Percent className="h-4.5 w-4.5 text-primary" />
          Thiết lập giảm giá
        </CardTitle>
        <CardDescription className="text-[11px] text-slate-500 mt-1">
          Chọn sách và cấu hình phần trăm chiết khấu trực tiếp
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5">
        <form onSubmit={onApplyPromo} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">
              Tên chương trình khuyến mãi
            </label>
            <Input
              placeholder="E.g. Sale Hè Rực Rỡ 2026"
              value={promoName}
              onChange={(e) => setPromoName(e.target.value)}
              className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs h-10 px-3.5 focus:ring-1 focus:ring-primary focus:border-primary rounded-lg w-full outline-none"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">
              Chọn đầu sách
            </label>
            <select
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary h-10 outline-none"
              required
              disabled={isSubmitting}
            >
              <option value="" disabled>-- Chọn đầu sách --</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} ({b.price.toLocaleString()} ₫)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">
              Phần trăm giảm giá (%)
            </label>
            <Input
              type="number"
              min="1"
              max="90"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs h-10 px-3.5 focus:ring-1 focus:ring-primary focus:border-primary rounded-lg w-full outline-none"
              disabled={isSubmitting}
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting || !selectedBookId} 
            className="w-full bg-primary hover:bg-primary/95 text-white font-bold text-xs h-10 rounded-lg shadow-sm shadow-primary/10 cursor-pointer"
          >
            {isSubmitting ? "Đang áp dụng..." : "Áp dụng chiết khấu"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
