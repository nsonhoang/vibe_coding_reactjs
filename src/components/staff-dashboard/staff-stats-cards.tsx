import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShoppingCart, AlertTriangle, Truck, Package } from "lucide-react";

interface StaffStatsCardsProps {
  pendingOrdersCount: number;
  lowStockCount: number;
  inTransitCount: number;
  totalBooksCount: number;
}

export const StaffStatsCards: React.FC<StaffStatsCardsProps> = ({
  pendingOrdersCount,
  lowStockCount,
  inTransitCount,
  totalBooksCount,
}) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
      <Card className="border-border bg-card/40 backdrop-blur-sm transition-all hover:translate-y-[-2px] hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Đơn chờ xử lý</CardTitle>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <ShoppingCart className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">{pendingOrdersCount} đơn hàng</div>
          <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
            <span>Cần xác thực & đóng gói sớm</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/40 backdrop-blur-sm transition-all hover:translate-y-[-2px] hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tồn kho cảnh báo</CardTitle>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">{lowStockCount} đầu sách</div>
          <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-rose-600 dark:text-rose-400">
            <span>Đã cạn hoặc dưới mức tối thiểu</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/40 backdrop-blur-sm transition-all hover:translate-y-[-2px] hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Đang vận chuyển</CardTitle>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Truck className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">{inTransitCount} bưu kiện</div>
          <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
            <span>Đang trung chuyển bưu cục</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/40 backdrop-blur-sm transition-all hover:translate-y-[-2px] hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Đầu sách mở bán</CardTitle>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Package className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">{totalBooksCount} đầu sách</div>
          <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            <span>Đang phát hành trong hệ thống</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
