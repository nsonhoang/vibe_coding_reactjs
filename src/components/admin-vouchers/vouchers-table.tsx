import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Power, Trash2, Ticket } from "lucide-react";
import type { Voucher } from "@/services/voucher-service";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface VouchersTableProps {
  vouchers: Voucher[];
  onEdit: (voucher: Voucher) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  isSubmitting: boolean;
}

export const VouchersTable: React.FC<VouchersTableProps> = ({
  vouchers,
  onEdit,
  onToggleStatus,
  onDelete,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  isSubmitting,
}) => {
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const renderPages = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "ellipsis", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800">
              <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Mã Voucher</th>
              <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Giảm giá</th>
              <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Lượt dùng / Hạn mức</th>
              <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Thời hạn</th>
              <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {vouchers.map((v) => {
              const isExpired = new Date(v.endDate) < new Date();
              const isPercentage = v.discountType === "PERCENTAGE";
              const progressPercentage = v.usageLimit 
                ? Math.min((v.usedCount / v.usageLimit) * 100, 100) 
                : 0;

              return (
                <tr key={v.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-850/20 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-black text-primary bg-primary/10 dark:bg-primary/20 px-2.5 py-1 rounded select-all tracking-wider uppercase border border-primary/20">
                      {v.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200 text-xs">
                    {isPercentage ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/20">
                        Giảm {v.discountValue}%
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                        Giảm {v.discountValue.toLocaleString()} ₫
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {v.usageLimit ? (
                      <div className="space-y-1 max-w-[120px]">
                        <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              progressPercentage >= 100 ? "bg-rose-550" : "bg-primary"
                            }`}
                            style={{ width: `${progressPercentage}%` }} 
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold font-mono">
                          {v.usedCount} / {v.usageLimit} lượt
                        </p>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold font-mono">
                        {v.usedCount} / ∞ (Vô hạn)
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-450">
                    <p className="font-semibold text-slate-700 dark:text-slate-300 font-mono">
                      {formatDate(v.startDate)} - {formatDate(v.endDate)}
                    </p>
                    <p className={`text-[10px] font-bold mt-0.5 ${
                      v.isActive && !isExpired 
                        ? "text-emerald-600 dark:text-emerald-400" 
                        : "text-rose-605 dark:text-rose-400"
                    }`}>
                      {v.isActive && !isExpired ? "Đang diễn ra" : isExpired ? "Đã kết thúc" : "Tạm dừng"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                      v.isActive && !isExpired
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/5 dark:text-emerald-400"
                        : "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:bg-rose-500/5 dark:text-rose-400"
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${v.isActive && !isExpired ? "bg-emerald-500" : "bg-rose-500"}`} />
                      {v.isActive && !isExpired ? "Hoạt động" : "Tạm ngắt"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        type="button"
                        onClick={() => onEdit(v)}
                        disabled={isSubmitting}
                        title="Chỉnh sửa voucher"
                        className="h-7 w-7 p-0 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <Edit className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        type="button"
                        onClick={() => onToggleStatus(v.id, v.isActive)}
                        disabled={isSubmitting}
                        title={v.isActive ? "Tạm ngắt hoạt động" : "Kích hoạt hoạt động"}
                        className={`h-7 w-7 p-0 rounded-lg cursor-pointer ${
                          v.isActive 
                            ? "text-amber-500 hover:text-amber-600 hover:bg-amber-500/10" 
                            : "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"
                        }`}
                      >
                        <Power className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        type="button"
                        onClick={() => onDelete(v.id)}
                        disabled={isSubmitting}
                        title="Xóa voucher"
                        className="text-rose-500 hover:text-rose-650 hover:bg-rose-500/10 disabled:opacity-40 cursor-pointer h-7 w-7 rounded-lg"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {vouchers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-555 dark:text-slate-400 text-xs font-bold">
                  Không tìm thấy mã giảm giá nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginated Footer */}
      {totalPages > 0 && (
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <label className="sr-only">Phân trang danh sách voucher</label>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            Đang hiển thị <span className="font-extrabold text-slate-700 dark:text-slate-350">{Math.min((currentPage - 1) * 10 + 1, totalItems)}</span>
            {" - "}
            <span className="font-extrabold text-slate-700 dark:text-slate-350">{Math.min(currentPage * 10, totalItems)}</span> trong tổng số{" "}
            <span className="font-extrabold text-primary">{totalItems}</span> voucher
          </div>
          
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) onPageChange(currentPage - 1);
                  }}
                  aria-disabled={currentPage <= 1}
                  className={currentPage <= 1 ? "pointer-events-none opacity-40" : "cursor-pointer"}
                  text="Trước"
                />
              </PaginationItem>
              
              {renderPages().map((pg, idx) => (
                <PaginationItem key={idx}>
                  {pg === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(pg as number);
                      }}
                      isActive={currentPage === pg}
                      className="cursor-pointer font-bold text-xs"
                    >
                      {pg}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) onPageChange(currentPage + 1);
                  }}
                  aria-disabled={currentPage >= totalPages}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-40" : "cursor-pointer"}
                  text="Sau"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};
