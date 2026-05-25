import React, { memo } from "react";
import { UserCheck, Ticket, DollarSign, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface UsersStatsGridProps {
  onNavigateToVouchers: () => void;
}

export const UsersStatsGrid: React.FC<UsersStatsGridProps> = memo(({
  onNavigateToVouchers,
}) => {
  return (
    <div className="space-y-6">
      {/* Stats Bento Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg text-primary dark:text-primary-fixed-dim">
              <UserCheck className="h-5 w-5" />
            </div>
            <span className="text-emerald-500 font-bold text-xs flex items-center gap-0.5">
              <TrendingUp className="h-3.5 w-3.5" /> 12%
            </span>
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-wider">Người dùng mới (Tháng này)</p>
            <h3 className="font-extrabold text-2xl text-slate-800 dark:text-white mt-1">1,284</h3>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-lg text-amber-500">
              <Ticket className="h-5 w-5" />
            </div>
            <span className="text-amber-500 font-bold text-xs flex items-center gap-0.5">
              <Minus className="h-3.5 w-3.5" /> 0%
            </span>
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-wider">Voucher đang hoạt động</p>
            <h3 className="font-extrabold text-2xl text-slate-800 dark:text-white mt-1">24</h3>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg text-emerald-500">
              <DollarSign className="h-5 w-5" />
            </div>
            <span className="text-red-500 font-bold text-xs flex items-center gap-0.5">
              <TrendingDown className="h-3.5 w-3.5" /> 5%
            </span>
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-wider">Tổng chiết khấu (VNĐ)</p>
            <h3 className="font-extrabold text-2xl text-slate-800 dark:text-white mt-1">18.5M</h3>
          </div>
        </div>
      </div>

      {/* Marketing Campaign Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-850 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 group shadow-lg shadow-indigo-500/10">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="relative z-10 space-y-2.5 text-center sm:text-left">
          <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest inline-block">
            Chiến dịch mùa hè
          </span>
          <h2 className="text-white font-extrabold text-lg tracking-tight">
            Tăng tốc doanh số với Voucher Combo mới
          </h2>
          <p className="text-indigo-200 max-w-xl text-xs leading-relaxed">
            Thiết lập các chương trình giảm giá chéo giữa các thể loại sách để khuyến khích người dùng mua nhiều hơn trong mùa hè này.
          </p>
        </div>
        <div className="relative z-10 shrink-0">
          <button 
            onClick={onNavigateToVouchers}
            className="bg-white hover:bg-slate-50 text-indigo-700 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xl transition-all hover:scale-[1.03] active:scale-95 cursor-pointer"
          >
            Bắt đầu ngay
          </button>
        </div>
      </div>
    </div>
  );
});

UsersStatsGrid.displayName = "UsersStatsGrid";
