import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight as ArrowIcon, Trash2 } from "lucide-react";
import type { Promotion } from "@/services/promotion-service";
import { PromotionsFilters } from "./promotions-filters";
import { PromotionsPagination } from "./promotions-pagination";

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

export const PromotionsListTable: React.FC<PromotionsListTableProps> = React.memo(({
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
      <label className="sr-only">Danh sách chương trình khuyến mãi</label>
      
      {/* Refactored Filters Subcomponent */}
      <PromotionsFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        startDateFilter={startDateFilter}
        setStartDateFilter={setStartDateFilter}
        endDateFilter={endDateFilter}
        setEndDateFilter={setEndDateFilter}
        onClearFilters={onClearFilters}
      />

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
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectPromo(promo);
                            }}
                            className="text-primary hover:bg-primary/10 cursor-pointer h-7 w-7 rounded-lg"
                            title="Xem chi tiết"
                          >
                            <ArrowIcon className="h-4.5 w-4.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            type="button"
                            onClick={(e) => {
                              console.log("promo.id", promo.id);
                              e.stopPropagation();
                              onRemovePromo(promo.id);
                            }}
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

          {/* Refactored Pagination Subcomponent using Shadcn UI */}
          <PromotionsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={onPageChange}
          />
        </CardContent>
      </Card>
    </div>
  );
});

PromotionsListTable.displayName = "PromotionsListTable";
