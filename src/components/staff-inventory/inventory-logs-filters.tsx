import React from "react";
import { Filter, X, Calendar } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface InventoryLogsFiltersProps {
  selectedInventoryId: string;
  onSelectedInventoryIdChange: (id: string) => void;
  typeFilter: "IN" | "OUT" | "ADJUST" | "";
  onTypeFilterChange: (type: "IN" | "OUT" | "ADJUST" | "") => void;
  fromDate: string;
  onFromDateChange: (date: string) => void;
  toDate: string;
  onToDateChange: (date: string) => void;
  warehouseItems: any[];
  onReset: () => void;
  hasActiveFilters: boolean;
}

export const InventoryLogsFilters: React.FC<InventoryLogsFiltersProps> = ({
  selectedInventoryId,
  onSelectedInventoryIdChange,
  typeFilter,
  onTypeFilterChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  warehouseItems,
  onReset,
  hasActiveFilters,
}) => {
  return (
    <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/20 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-850 dark:text-slate-100 flex items-center gap-1.5">
          <Filter className="h-4 w-4 text-primary" />
          Bộ lọc nâng cao
        </CardTitle>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-[10px] text-red-500 hover:text-red-650 font-bold flex items-center gap-0.5 transition-colors uppercase tracking-wider cursor-pointer"
          >
            <X className="h-3 w-3" />
            Xóa tất cả bộ lọc
          </button>
        )}
      </div>

      {/* Filters Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Filter by Book */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[8px] font-black uppercase text-slate-400 pl-1">Chọn đầu sách</label>
          <select
            value={selectedInventoryId}
            onChange={(e) => onSelectedInventoryIdChange(e.target.value)}
            className="w-full text-[11px] font-bold py-2 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-850 dark:text-slate-200 shadow-sm focus:outline-none focus:border-primary/50 cursor-pointer"
          >
            <option value="">Tất cả sách</option>
            {warehouseItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.book?.title}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Type */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[8px] font-black uppercase text-slate-400 pl-1">Loại biến động</label>
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value as any)}
            className="w-full text-[11px] font-bold py-2 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-850 dark:text-slate-200 shadow-sm focus:outline-none focus:border-primary/50 cursor-pointer"
          >
            <option value="">Tất cả loại giao dịch</option>
            <option value="IN">Nhập kho (IN)</option>
            <option value="OUT">Xuất kho (OUT)</option>
            <option value="ADJUST">Kiểm kê (ADJUST)</option>
          </select>
        </div>

        {/* Filter by Start Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[8px] font-black uppercase text-slate-400 pl-1 flex items-center gap-1">
            <Calendar className="h-2.5 w-2.5 text-slate-400" />
            Từ ngày
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
            className="w-full text-[11px] font-bold py-2 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-850 dark:text-slate-200 shadow-sm focus:outline-none focus:border-primary/50"
          />
        </div>

        {/* Filter by End Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[8px] font-black uppercase text-slate-400 pl-1 flex items-center gap-1">
            <Calendar className="h-2.5 w-2.5 text-slate-400" />
            Đến ngày
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => onToDateChange(e.target.value)}
            className="w-full text-[11px] font-bold py-2 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-850 dark:text-slate-200 shadow-sm focus:outline-none focus:border-primary/50"
          />
        </div>
      </div>
    </CardHeader>
  );
};
