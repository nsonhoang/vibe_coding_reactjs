import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Calendar,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronRight as ArrowIcon,
  Trash2,
} from "lucide-react";
import type { Promotion } from "@/services/promotion-service";

interface PromotionsListTableProps {
  promotions: Promotion[];
  onSelectPromo: (promo: Promotion) => void;
  onRemovePromo: (id: string) => void;
  isSubmitting: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;

  // Filters State & Callbacks
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  startDateFilter: string;
  setStartDateFilter: (date: string) => void;
  endDateFilter: string;
  setEndDateFilter: (date: string) => void;
  onClearFilters: () => void;

  // Date Formatting Helper & Status badge helpers passed or declared locally
  formatDate: (dateStr: string) => string;
  getPromoStatus: (promo: Promotion) => { text: string; class: string };
}

export const PromotionsListTable: React.FC<PromotionsListTableProps> = ({
  promotions,
  onSelectPromo,
  onRemovePromo,
  isSubmitting,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  startDateFilter,
  setStartDateFilter,
  endDateFilter,
  setEndDateFilter,
  onClearFilters,
  formatDate,
  getPromoStatus,
}) => {
  return (
    <div className="space-y-6">
      {/* Filter panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
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
              {(searchTerm || statusFilter !== "ALL" || startDateFilter || endDateFilter) && (
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

      {/* Main Grid Table List of Promotions */}
      <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Tên chương trình</th>
                  <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Số sách áp dụng</th>
                  <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Chiết khấu</th>
                  <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Hạn chương trình</th>
                  <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Trạng thái hoạt động</th>
                  <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {promotions.map((promo) => {
                  const bookCount = promo.books?.length || 0;
                  const startStr = formatDate(promo.startDate);
                  const endStr = formatDate(promo.endDate);
                  const status = getPromoStatus(promo);

                  return (
                    <tr
                      key={promo.id}
                      onClick={() => onSelectPromo(promo)}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4.5 font-bold text-slate-850 dark:text-slate-200 group-hover:text-primary transition-colors text-xs">
                        {promo.name}
                      </td>
                      <td className="px-6 py-4.5 text-slate-500 dark:text-slate-400 text-xs font-mono font-bold">
                        {bookCount} đầu sách
                      </td>
                      <td className="px-6 py-4.5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-black border border-rose-500/20">
                          -{promo.discountRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4.5 text-slate-500 dark:text-slate-400 font-mono text-xs">
                        {startStr} - {endStr}
                      </td>
                      <td className="px-6 py-4.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${status.class} border-slate-200/10`}>
                          {status.text}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            type="button"
                            onClick={() => onSelectPromo(promo)}
                            className="text-primary hover:bg-primary/10 cursor-pointer h-7 w-7 rounded-lg"
                            title="Xem chi tiết"
                          >
                            <ArrowIcon className="h-4.5 w-4.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            type="button"
                            onClick={() => onRemovePromo(promo.id)}
                            disabled={isSubmitting}
                            className="text-red-500 hover:text-red-650 hover:bg-red-500/10 cursor-pointer h-7 w-7 rounded-lg"
                            title="Xóa ưu đãi"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {promotions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400 text-xs font-bold">
                      Không tìm thấy chương trình khuyến mãi nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginated Footer */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="text-xs text-slate-550 dark:text-slate-400 font-semibold">
                Đang hiển thị <span className="font-extrabold text-slate-700 dark:text-slate-350">{Math.min((currentPage - 1) * 10 + 1, totalItems)}</span>
                {" - "}
                <span className="font-extrabold text-slate-700 dark:text-slate-350">{Math.min(currentPage * 10, totalItems)}</span> trong tổng số{" "}
                <span className="font-extrabold text-primary">{totalItems}</span> ưu đãi
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="p-1.5 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4 text-slate-650 dark:text-slate-400" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => onPageChange(pg)}
                    className={`w-7.5 h-7.5 rounded text-xs font-extrabold transition-all cursor-pointer ${
                      currentPage === pg
                        ? "bg-primary text-white shadow-sm shadow-primary/20"
                        : "border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-605 dark:text-slate-400"
                    }`}
                  >
                    {pg}
                  </button>
                ))}

                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="p-1.5 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4 text-slate-650 dark:text-slate-400" />
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
