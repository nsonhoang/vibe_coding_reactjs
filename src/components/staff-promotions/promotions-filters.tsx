import React from "react";
import { Search, Calendar, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PromotionsFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  startDateFilter: string;
  setStartDateFilter: (date: string) => void;
  endDateFilter: string;
  setEndDateFilter: (date: string) => void;
  onClearFilters: () => void;
}

export const PromotionsFilters: React.FC<PromotionsFiltersProps> = React.memo(({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  startDateFilter,
  setStartDateFilter,
  endDateFilter,
  setEndDateFilter,
  onClearFilters,
}) => {
  const hasActiveFilters = !!(searchTerm || statusFilter !== "ALL" || startDateFilter || endDateFilter);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
      <label className="sr-only">Bộ lọc tìm kiếm chương trình khuyến mãi</label>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        {/* Keyword Search */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">
            Tên chương trình
          </label>
          <div className="relative">
            <Search className="absolute inset-y-0 left-2.5 h-3.5 w-3.5 my-auto text-slate-400" />
            <Input
              placeholder="E.g. Sale Hè Rực Rỡ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-slate-50 dark:bg-slate-855 border-slate-200 dark:border-slate-800 text-[11px] h-9 rounded-lg w-full outline-none"
            />
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">
            Trạng thái chạy
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-855 border border-slate-200 dark:border-slate-800 text-[11px] h-9 rounded-lg px-2.5 outline-none text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang hoạt động</option>
            <option value="INACTIVE">Ngưng hoạt động</option>
          </select>
        </div>

        {/* Start Date */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">
            Từ ngày
          </label>
          <div className="relative">
            <Calendar className="absolute inset-y-0 left-2.5 h-3.5 w-3.5 my-auto text-slate-400 pointer-events-none" />
            <Input
              type="date"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
              className="pl-8 bg-slate-50 dark:bg-slate-855 border-slate-200 dark:border-slate-800 text-[11px] h-9 rounded-lg w-full outline-none"
            />
          </div>
        </div>

        {/* End Date & Clear */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">
            Đến ngày
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Calendar className="absolute inset-y-0 left-2.5 h-3.5 w-3.5 my-auto text-slate-400 pointer-events-none" />
              <Input
                type="date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                className="pl-8 bg-slate-50 dark:bg-slate-855 border-slate-200 dark:border-slate-800 text-[11px] h-9 rounded-lg w-full outline-none"
              />
            </div>
            {hasActiveFilters && (
              <Button
                type="button"
                variant="outline"
                onClick={onClearFilters}
                title="Xóa bộ lọc"
                className="h-9 w-9 p-0 rounded-lg shrink-0 border-slate-250 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5 text-slate-550" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

PromotionsFilters.displayName = "PromotionsFilters";
