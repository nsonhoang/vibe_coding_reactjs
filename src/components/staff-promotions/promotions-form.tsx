import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Percent } from "lucide-react";
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
    <Card className="border-border bg-card/20 backdrop-blur-sm h-fit">
      <CardHeader>
        <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
          <Percent className="h-4 w-4 text-primary" />
          Thiết lập giảm giá
        </CardTitle>
        <CardDescription className="text-[11px]">Chọn sách và cấu hình phần trăm chiết khấu</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onApplyPromo} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-muted-foreground">Tên chương trình khuyến mãi</label>
            <Input
              placeholder="E.g. Sale hè rực rỡ"
              value={promoName}
              onChange={(e) => setPromoName(e.target.value)}
              className="bg-card border-border text-xs"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-muted-foreground">Chọn đầu sách</label>
            <select
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary h-[34px]"
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
            <label className="font-bold text-muted-foreground">Phần trăm giảm giá (%)</label>
            <Input
              type="number"
              min="1"
              max="90"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="bg-card border-border text-xs"
              disabled={isSubmitting}
            />
          </div>

          <Button type="submit" disabled={isSubmitting || !selectedBookId} className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs h-9 cursor-pointer">
            {isSubmitting ? "Đang áp dụng..." : "Áp dụng chiết khấu"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
