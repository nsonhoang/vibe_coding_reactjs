import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, AlertTriangle, Truck, BookOpen, TrendingUp, TrendingDown, Minus } from "lucide-react";

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
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-xs">
      {/* Pending Orders Card */}
      <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl transition-all hover:bg-slate-50/50 dark:hover:bg-slate-850/50 hover:shadow-md cursor-default group relative overflow-hidden">
        {/* Subtle accent top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500 opacity-60" />
        
        <CardContent className="p-0 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <span className="text-emerald-500 dark:text-emerald-400 font-bold flex items-center gap-0.5 text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <TrendingUp className="h-3 w-3" /> +12.5%
            </span>
          </div>
          <div>
            <p className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">Đơn chờ xử lý</p>
            <h2 className="text-3xl font-extrabold text-slate-850 dark:text-white mt-1 tracking-tight">{pendingOrdersCount} đơn</h2>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-2.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              Cần xác thực & đóng gói sớm
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Warning/Alert Stock Card */}
      <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl transition-all hover:bg-slate-50/50 dark:hover:bg-slate-850/50 hover:shadow-md cursor-default group relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500 opacity-60" />
        
        <CardContent className="p-0 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span className="text-rose-500 dark:text-rose-400 font-bold flex items-center gap-0.5 text-[11px] bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
              <TrendingUp className="h-3 w-3" /> +8.2%
            </span>
          </div>
          <div>
            <p className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">Tồn kho cảnh báo</p>
            <h2 className="text-3xl font-extrabold text-slate-850 dark:text-white mt-1 tracking-tight">{lowStockCount} đầu sách</h2>
            <p className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold mt-2.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              Đã cạn hoặc dưới mức an toàn
            </p>
          </div>
        </CardContent>
      </Card>

      {/* In Transit/Shipped Card */}
      <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl transition-all hover:bg-slate-50/50 dark:hover:bg-slate-850/50 hover:shadow-md cursor-default group relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 opacity-60" />
        
        <CardContent className="p-0 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
              <Truck className="h-5 w-5" />
            </div>
            <span className="text-slate-400 dark:text-slate-500 font-bold flex items-center gap-0.5 text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              <Minus className="h-3 w-3" /> 0%
            </span>
          </div>
          <div>
            <p className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">Đang vận chuyển</p>
            <h2 className="text-3xl font-extrabold text-slate-850 dark:text-white mt-1 tracking-tight">{inTransitCount} kiện</h2>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-2.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              Đang trung chuyển bưu cục
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Active Books Count Card */}
      <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl transition-all hover:bg-slate-50/50 dark:hover:bg-slate-850/50 hover:shadow-md cursor-default group relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500 opacity-60" />
        
        <CardContent className="p-0 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="text-rose-500 dark:text-rose-400 font-bold flex items-center gap-0.5 text-[11px] bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
              <TrendingDown className="h-3 w-3" /> -2.4%
            </span>
          </div>
          <div>
            <p className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">Đầu sách mở bán</p>
            <h2 className="text-3xl font-extrabold text-slate-850 dark:text-white mt-1 tracking-tight">{totalBooksCount} đầu</h2>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-2.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Đang hoạt động trong hệ thống
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
