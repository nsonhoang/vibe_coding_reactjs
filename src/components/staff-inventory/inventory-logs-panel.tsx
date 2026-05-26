import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, ArrowDown, RefreshCw, FileClock, Loader2, Filter, Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export interface InventoryLogItem {
  id: string;
  inventoryId: string;
  change: number;
  beforeQty: number;
  afterQty: number;
  reason?: string;
  type: "IN" | "OUT" | "ADJUST";
  createdAt: string;
  inventory?: {
    id: string;
    book?: {
      title: string;
    };
  };
}

interface InventoryLogsPanelProps {
  selectedBookTitle: string;
  onDeselectBook?: () => void;
  logs: InventoryLogItem[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  totalLogs: number;
  onPageChange: (page: number) => void;
  typeFilter: "IN" | "OUT" | "ADJUST" | "";
  onTypeFilterChange: (type: "IN" | "OUT" | "ADJUST" | "") => void;
  fromDate: string;
  onFromDateChange: (date: string) => void;
  toDate: string;
  onToDateChange: (date: string) => void;
  warehouseItems?: any[];
}

export const InventoryLogsPanel: React.FC<InventoryLogsPanelProps> = ({
  selectedBookTitle,
  onDeselectBook,
  logs,
  isLoading,
  page,
  totalPages,
  totalLogs,
  onPageChange,
  typeFilter,
  onTypeFilterChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  warehouseItems = [],
}) => {
  const [showDates, setShowDates] = useState(false);

  const handleResetFilters = () => {
    onTypeFilterChange("");
    onFromDateChange("");
    onToDateChange("");
    onPageChange(1);
  };

  const hasActiveFilters = typeFilter !== "" || fromDate !== "" || toDate !== "";

  return (
    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm h-full flex flex-col overflow-hidden">
      {/* Panel Header */}
      <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/20 flex flex-col gap-4">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-150 flex items-center gap-2">
            <FileClock className="h-4.5 w-4.5 text-primary" />
            Nhật ký Kho
          </CardTitle>

          <div className="flex items-center gap-3">
            <Link
              to="/staff/inventory/logs"
              className="text-[10px] text-primary hover:text-primary/80 font-bold transition-colors uppercase tracking-wider underline decoration-2 underline-offset-2 cursor-pointer"
            >
              Xem chi tiết
            </Link>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-[10px] text-red-500 hover:text-red-600 font-bold flex items-center gap-0.5 transition-colors uppercase tracking-wider"
              >
                <X className="h-3 w-3" />
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Filter by Type */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => {
                onTypeFilterChange(e.target.value as any);
                onPageChange(1);
              }}
              className="w-full text-[11px] font-bold py-1.5 pl-7 pr-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-850 dark:text-slate-200 shadow-sm focus:outline-none focus:border-primary/50 appearance-none cursor-pointer"
            >
              <option value="">Tất cả biến động</option>
              <option value="IN">Nhập kho (IN)</option>
              <option value="OUT">Xuất kho (OUT)</option>
              <option value="ADJUST">Kiểm kê (ADJUST)</option>
            </select>
            <Filter className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          </div>

          {/* Toggle Date Filters */}
          <button
            onClick={() => setShowDates(!showDates)}
            className={`w-full text-[11px] font-bold py-1.5 px-3 border rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm ${
              showDates || fromDate || toDate
                ? "border-primary/50 bg-primary/5 text-primary"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-200"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            Lọc theo ngày
          </button>
        </div>

        {/* Slide Down Date Filter Inputs */}
        {showDates && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 animate-in slide-in-from-top-2 duration-205">
            <div>
              <label className="block text-[8px] font-black uppercase text-slate-400 mb-1 pl-1">Từ ngày</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  onFromDateChange(e.target.value);
                  onPageChange(1);
                }}
                className="w-full text-[10px] py-1 px-2 border border-slate-250 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-[8px] font-black uppercase text-slate-400 mb-1 pl-1">Đến ngày</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  onToDateChange(e.target.value);
                  onPageChange(1);
                }}
                className="w-full text-[10px] py-1 px-2 border border-slate-250 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-200"
              />
            </div>
          </div>
        )}
      </CardHeader>

      {/* Logs Scrollable Content */}
      <CardContent className="p-4 flex-1 overflow-y-auto min-h-[350px] max-h-[460px] custom-scrollbar flex flex-col">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center my-auto py-20 space-y-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-[10px] text-slate-500 font-bold">Đang tải nhật ký...</p>
          </div>
        ) : !logs || logs.length === 0 ? (
          <div className="text-center my-auto py-20 text-slate-400 dark:text-slate-500 font-semibold text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
            Không tìm thấy giao dịch kho nào khớp với bộ lọc.
          </div>
        ) : (
          <div className="space-y-3 flex-1">
            <div className="flex justify-between items-center pl-1 mb-3">
              <p className="text-[9px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                {selectedBookTitle ? (
                  <>Lịch sử: <span className="text-primary font-extrabold normal-case">{selectedBookTitle}</span></>
                ) : (
                  "Biến động kho toàn hệ thống"
                )}
              </p>
              {selectedBookTitle && onDeselectBook && (
                <button
                  onClick={onDeselectBook}
                  className="text-[9px] text-primary hover:underline font-extrabold transition-colors uppercase tracking-wider animate-in fade-in duration-200"
                >
                  Xem tất cả
                </button>
              )}
            </div>

            <div className="space-y-3">
              {logs.map((log) => {
                const dateStr = log.createdAt
                  ? new Date(log.createdAt).toLocaleString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "Không rõ";

                const isImport = log.type === "IN";
                const isExport = log.type === "OUT";
                const matchedWarehouse = warehouseItems.find((w) => w.id === log.inventoryId);
                const logBookTitle = log.inventory?.book?.title || matchedWarehouse?.book?.title || "Sách chưa đặt tên";

                return (
                  <div
                    key={log.id}
                    className="p-3 border border-slate-105 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850/40 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 transition-all group"
                  >
                    {/* Top Row: Type Tag & Date */}
                    <div className="flex justify-between items-start mb-1.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                          isImport
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : isExport
                            ? "bg-red-500/10 text-red-600 dark:text-red-400"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {log.type === "IN"
                          ? "NHẬP KHO"
                          : log.type === "OUT"
                          ? "XUẤT KHO"
                          : "ĐIỀU CHỈNH"}
                      </span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold font-mono">
                        {dateStr}
                      </span>
                    </div>

                    {/* Book title if global mode */}
                    {!selectedBookTitle && logBookTitle && (
                      <p className="text-[10px] font-black text-slate-700 dark:text-slate-200 mb-1.5 line-clamp-1">
                        📖 {logBookTitle}
                      </p>
                    )}

                    {/* Middle Row: Quantity & Reason */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {isImport ? (
                          <ArrowUp className="h-3.5 w-3.5 text-emerald-500 animate-bounce-subtle" />
                        ) : isExport ? (
                          <ArrowDown className="h-3.5 w-3.5 text-red-500 animate-bounce-subtle" />
                        ) : (
                          <RefreshCw className="h-3 w-3 text-amber-500" />
                        )}
                        <span
                          className={`text-xs font-black ${
                            isImport
                              ? "text-emerald-600 dark:text-emerald-400"
                              : isExport
                              ? "text-red-600 dark:text-red-400"
                              : "text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {isImport ? "+" : isExport ? "-" : ""}{log.change} cuốn
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold max-w-[155px] truncate" title={log.reason || undefined}>
                        {log.reason || "Không ghi chú"}
                      </span>
                    </div>

                    {/* Bottom Row: Before & After Stock */}
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[9px] font-semibold text-slate-400 dark:text-slate-500">
                      <span>Tồn trước: {log.beforeQty ?? 0}</span>
                      <span>Tồn sau: {log.afterQty ?? 0}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="p-1 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold font-mono">
            Trang {page} / {totalPages} (Tổng {totalLogs})
          </span>

          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="p-1 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </Card>
  );
};
