import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit3, Gift, ChevronLeft, ChevronRight, Search, Calendar, RefreshCw } from "lucide-react";
import type { Promotion } from "@/services/promotion-service";

interface PromotionsTableProps {
  promotions: Promotion[];
  onRemovePromo: (id: string) => void;
  onEditPromo: (promo: Promotion) => void;
  editingPromoId: string | null;
  isSubmitting: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;

  // Search & Filter Props
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

export const PromotionsTable: React.FC<PromotionsTableProps> = ({
  promotions,
  onRemovePromo,
  onEditPromo,
  editingPromoId,
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
}) => {
  return (
    <Card className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm h-fit">
      <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-850 dark:text-slate-100 flex items-center gap-2">
              <Gift className="h-4.5 w-4.5 text-primary" />
              Danh sách giảm giá đang chạy
            </CardTitle>
            <CardDescription className="text-[11px] text-slate-500 mt-1">
              Thông tin chi tiết các chương trình chiết khấu trực tiếp trên từng đầu sách đang áp dụng
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      {/* Real-time Filters Panel inside the card */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/40 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        {/* Search */}
        <div className="relative">
          <Search className="absolute inset-y-0 left-2.5 h-3.5 w-3.5 my-auto text-slate-400" />
          <Input
            placeholder="Tìm theo tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-[11px] h-8 rounded-lg outline-none w-full"
          />
        </div>

        {/* Status Dropdown */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] h-8 rounded-lg px-2.5 outline-none text-slate-650 dark:text-slate-300 font-medium cursor-pointer"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang hoạt động</option>
            <option value="INACTIVE">Ngưng hoạt động</option>
          </select>
        </div>

        {/* Start Date */}
        <div className="relative">
          <Calendar className="absolute inset-y-0 left-2.5 h-3.5 w-3.5 my-auto text-slate-400 pointer-events-none" />
          <Input
            type="date"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
            title="Từ ngày"
            className="pl-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-[11px] h-8 rounded-lg outline-none w-full"
          />
        </div>

        {/* End Date & Clear */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Calendar className="absolute inset-y-0 left-2.5 h-3.5 w-3.5 my-auto text-slate-400 pointer-events-none" />
            <Input
              type="date"
              value={endDateFilter}
              onChange={(e) => setEndDateFilter(e.target.value)}
              title="Đến ngày"
              className="pl-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-[11px] h-8 rounded-lg outline-none w-full"
            />
          </div>
          {(searchTerm || statusFilter !== "ALL" || startDateFilter || endDateFilter) && (
            <Button
              type="button"
              variant="outline"
              onClick={onClearFilters}
              title="Xóa bộ lọc"
              className="h-8 w-8 p-0 rounded-lg shrink-0 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <RefreshCw className="h-3 w-3 text-slate-500" />
            </Button>
          )}
        </div>
      </div>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Tên chương trình</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Sách áp dụng</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Tỷ lệ giảm</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Thời gian hoạt động</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {promotions.map((promo) => {
                const bookNames = promo.books?.map((b) => b.title).join(", ") || "Không có sách";
                const startDateStr = new Date(promo.startDate).toLocaleDateString("vi-VN");
                const endDateStr = new Date(promo.endDate).toLocaleDateString("vi-VN");
                const isCurrentlyEditing = editingPromoId === promo.id;

                return (
                  <tr
                    key={promo.id}
                    className={`hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors group cursor-pointer ${
                      isCurrentlyEditing
                        ? "bg-amber-500/5 dark:bg-amber-500/10 border-l-2 border-amber-500"
                        : ""
                    }`}
                    onClick={() => onEditPromo(promo)}
                  >
                    <td className="px-6 py-4 font-bold text-slate-850 dark:text-slate-200 group-hover:text-primary transition-colors text-xs">
                      {promo.name}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 max-w-xs truncate text-[11px] font-semibold font-sans" title={bookNames}>
                      {bookNames}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-black border border-rose-500/20">
                        -{promo.discountRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono text-xs">
                      {startDateStr} - {endDateStr}
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          type="button"
                          onClick={() => onEditPromo(promo)}
                          disabled={isSubmitting}
                          className="text-amber-500 hover:text-amber-650 hover:bg-amber-500/10 disabled:opacity-40 cursor-pointer h-7 w-7 rounded-lg"
                          title="Sửa chương trình"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          type="button"
                          onClick={() => onRemovePromo(promo.id)}
                          disabled={isSubmitting}
                          className="text-red-500 hover:text-red-650 hover:bg-red-500/10 disabled:opacity-40 cursor-pointer h-7 w-7 rounded-lg"
                          title="Xóa chương trình"
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
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400 text-xs font-bold">
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
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
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
                className="p-1.5 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                <ChevronRight className="h-4 w-4 text-slate-650 dark:text-slate-400" />
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
