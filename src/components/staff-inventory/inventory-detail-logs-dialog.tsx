import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUp, ArrowDown, RefreshCw, Loader2, ChevronLeft, ChevronRight, X, FileClock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { inventoryService } from "@/services/inventory-service";

interface InventoryDetailLogsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryId: string;
  bookTitle: string;
}

export const InventoryDetailLogsDialog: React.FC<InventoryDetailLogsDialogProps> = ({
  isOpen,
  onClose,
  inventoryId,
  bookTitle,
}) => {
  const [page, setPage] = useState(1);

  // Reset page to 1 when dialog is opened or inventoryId changes
  useEffect(() => {
    if (isOpen) {
      setPage(1);
    }
  }, [isOpen, inventoryId]);

  // Fetch paginated logs for this specific warehouse ID
  const { data: logsData, isLoading } = useQuery({
    queryKey: ["inventory-detail-logs-modal", inventoryId, page],
    queryFn: () =>
      inventoryService.getInventoryLogs({
        page,
        limit: 5,
        inventoryId: inventoryId || undefined,
      }),
    enabled: isOpen && !!inventoryId,
  });

  const logsResult = logsData?.data;
  const logs = logsResult?.data || [];
  const totalPages = logsResult?.meta?.totalPages || 1;
  const totalLogs = logsResult?.meta?.total || 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xl">
        <DialogHeader className="border-b border-slate-100 dark:border-slate-800 pb-3 flex flex-row items-center justify-between">
          <DialogTitle className="text-xs font-black uppercase tracking-wider text-slate-850 dark:text-slate-100 flex items-center gap-2">
            <FileClock className="h-4.5 w-4.5 text-primary animate-pulse" />
            Chi tiết Biến động Kho
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 flex-1 flex flex-col min-h-[380px] max-h-[500px]">
          {/* Header Info */}
          <div className="mb-4 bg-slate-50 dark:bg-slate-850 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
            <p className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
              Tên sách/Kho chứa
            </p>
            <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-1">
              📖 {bookTitle || "Không rõ"}
            </h4>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1.5 custom-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-2">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-[10px] text-slate-500 font-bold">Đang tải nhật ký...</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-16 text-slate-400 dark:text-slate-500 font-semibold text-xs border border-dashed border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                Không tìm thấy giao dịch nào.
              </div>
            ) : (
              logs.map((log) => {
                const isImport = log.type === "IN";
                const isExport = log.type === "OUT";
                const dateStr = log.createdAt
                  ? new Date(log.createdAt).toLocaleString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "Không rõ";

                return (
                  <div
                    key={log.id}
                    className="p-3 border border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-850/20 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 transition-all"
                  >
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

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {isImport ? (
                          <ArrowUp className="h-3.5 w-3.5 text-emerald-500" />
                        ) : isExport ? (
                          <ArrowDown className="h-3.5 w-3.5 text-red-500" />
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
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 font-semibold max-w-[170px] truncate" title={log.reason || undefined}>
                        {log.reason || "Không ghi chú"}
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[9px] font-semibold text-slate-400 dark:text-slate-500">
                      <span>Tồn trước: {log.beforeQty ?? 0}</span>
                      <span>Tồn sau: {log.afterQty ?? 0}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Modal Pagination Footer */}
        {totalPages > 1 && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold font-mono">
              Trang {page} / {totalPages} (Tổng {totalLogs})
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
