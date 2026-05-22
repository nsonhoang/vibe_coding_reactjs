import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
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
    <Card className="md:col-span-2 border-border bg-card/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xs font-bold uppercase tracking-wider">Danh sách giảm giá đang chạy</CardTitle>
        <CardDescription className="text-[11px]">Thông tin chi tiết giá niêm yết so với giá khuyến mãi hiện tại</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 text-muted-foreground pb-2 font-semibold">
                <th className="py-2.5">Tên chương trình</th>
                <th className="py-2.5">Sách áp dụng</th>
                <th className="py-2.5">Tỷ lệ giảm</th>
                <th className="py-2.5">Thời gian hoạt động</th>
                <th className="py-2.5 text-right">Gỡ bỏ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {promotions.map((promo) => {
                const bookNames = promo.books?.map((b) => b.title).join(", ") || "Tất cả sách";
                const startDateStr = new Date(promo.startDate).toLocaleDateString("vi-VN");
                const endDateStr = new Date(promo.endDate).toLocaleDateString("vi-VN");

                return (
                  <tr key={promo.id} className="hover:bg-accent/40 transition-colors">
                    <td className="py-3 font-bold text-foreground">{promo.name}</td>
                    <td className="py-3 text-muted-foreground max-w-xs truncate" title={bookNames}>{bookNames}</td>
                    <td className="py-3 font-bold">
                      <Badge className="bg-rose-500/10 border-rose-500/20 text-rose-600 font-bold hover:bg-rose-500/20 text-[9px] py-0.5 rounded px-2.5">
                        -{promo.discountRate}%
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground font-mono">{startDateStr} - {endDateStr}</td>
                    <td className="py-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        type="button"
                        onClick={() => onRemovePromo(promo.id)}
                        disabled={isSubmitting}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-40 cursor-pointer"
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
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
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
