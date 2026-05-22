import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit, Check, Trash2 } from "lucide-react";

export interface Voucher {
  id: string;
  code: string;
  isPercent: boolean;
  value: number;
  minOrderValue: number;
  maxDiscountValue: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface VouchersGridProps {
  vouchers: Voucher[];
  onEdit: (voucher: Voucher) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export const VouchersGrid: React.FC<VouchersGridProps> = ({
  vouchers,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {vouchers.map((v) => (
        <Card key={v.id} className={`relative overflow-hidden border-border bg-card/45 backdrop-blur-sm transition-all hover:shadow-lg ${!v.isActive ? "opacity-60" : ""}`}>
          {/* Sky Blue side accent bar */}
          <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-primary" />
          
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Badge className="bg-primary/10 border-primary/20 text-primary font-mono font-bold hover:bg-primary/20 text-[10px] py-0.5 px-2.5 rounded">
                {v.code}
              </Badge>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold ${
                v.isActive && new Date(v.endDate) >= new Date()
                  ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                  : "bg-destructive/10 text-destructive"
              }`}>
                {v.isActive && new Date(v.endDate) >= new Date() ? "Đang hiệu lực" : "Hết hạn/Tắt"}
              </span>
            </div>
            <CardTitle className="text-sm font-bold mt-2.5">
              Giảm {v.isPercent ? `${v.value}%` : `${v.value.toLocaleString()} ₫`}
            </CardTitle>
            <CardDescription className="text-[10px] leading-relaxed">
              Đơn tối thiểu: {v.minOrderValue.toLocaleString()} ₫ <br />
              {v.isPercent && `Giảm tối đa: ${v.maxDiscountValue.toLocaleString()} ₫`}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4 text-[10px] text-muted-foreground space-y-3">
            {/* Progress limit */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold">
                <span>Lượt sử dụng</span>
                <span className="text-foreground">{v.usedCount} / {v.usageLimit}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-accent overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${Math.min((v.usedCount / v.usageLimit) * 100, 100)}%` }} 
                />
              </div>
            </div>
            
            {/* Time limits */}
            <div className="flex items-center gap-1.5 font-semibold text-[9px] text-muted-foreground/80">
              <Calendar className="h-3 w-3 shrink-0" />
              <span>{v.startDate} đến {v.endDate}</span>
            </div>
          </CardContent>

          {/* Row Actions */}
          <div className="flex items-center justify-end border-t border-border/50 px-4 py-2 gap-2 bg-accent/20">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onEdit(v)}
              title="Sửa mã"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onToggleStatus(v.id)}
              className="text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
              title="Thay đổi trạng thái"
            >
              <Check className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onDelete(v.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              title="Xóa mã"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
