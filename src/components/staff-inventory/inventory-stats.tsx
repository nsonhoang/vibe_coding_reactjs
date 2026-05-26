import React from "react";
import { BookOpen, Layers, AlertTriangle, Activity } from "lucide-react";

interface InventoryStatsProps {
  totalBooks: number;
  totalStock: number;
  lowStockCount: number;
  totalLogsCount: number;
}

export const InventoryStats: React.FC<InventoryStatsProps> = ({
  totalBooks,
  totalStock,
  lowStockCount,
  totalLogsCount,
}) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Books */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-3">
          <span className="p-2 bg-primary/10 text-primary rounded-lg">
            <BookOpen className="h-5 w-5" />
          </span>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
            Đầu sách
          </span>
        </div>
        <p className="text-[10px] text-slate-450 dark:text-slate-500 font-extrabold uppercase tracking-wider">
          Tổng đầu sách
        </p>
        <h3 className="text-xl font-black mt-1 font-mono text-slate-850 dark:text-slate-100">
          {totalBooks}
        </h3>
      </div>

      {/* Total Stock */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-3">
          <span className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
            <Layers className="h-5 w-5" />
          </span>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            Tổng số lượng
          </span>
        </div>
        <p className="text-[10px] text-slate-450 dark:text-slate-500 font-extrabold uppercase tracking-wider">
          Tổng lượng tồn
        </p>
        <h3 className="text-xl font-black mt-1 font-mono text-slate-850 dark:text-slate-100">
          {totalStock}
        </h3>
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-3">
          <span className="p-2 bg-rose-500/10 text-rose-600 rounded-lg">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              lowStockCount > 0
                ? "text-rose-600 bg-rose-500/10 animate-pulse"
                : "text-emerald-600 bg-emerald-500/10"
            }`}
          >
            {lowStockCount > 0 ? "Cần nhập hàng" : "An toàn"}
          </span>
        </div>
        <p className="text-[10px] text-slate-450 dark:text-slate-500 font-extrabold uppercase tracking-wider">
          Sách sắp hết hàng
        </p>
        <h3 className="text-xl font-black mt-1 font-mono text-slate-850 dark:text-slate-100">
          {lowStockCount}
        </h3>
      </div>

      {/* Stock Logs Activity */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-3">
          <span className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg">
            <Activity className="h-5 w-5" />
          </span>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
            24 giờ qua
          </span>
        </div>
        <p className="text-[10px] text-slate-450 dark:text-slate-500 font-extrabold uppercase tracking-wider">
          Giao dịch kho
        </p>
        <h3 className="text-xl font-black mt-1 font-mono text-slate-850 dark:text-slate-100">
          {totalLogsCount}
        </h3>
      </div>
    </div>
  );
};
