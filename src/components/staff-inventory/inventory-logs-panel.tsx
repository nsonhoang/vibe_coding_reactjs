import React from "react";
import { ArrowUp, ArrowDown, RefreshCw, FileClock, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface InventoryLogItem {
  id: string;
  inventoryId: string;
  change: number;
  beforeQty?: number;
  afterQty?: number;
  reason?: string;
  type: "IMPORT" | "EXPORT" | "ADJUST" | string;
  createdAt: string;
}

interface InventoryLogsPanelProps {
  selectedBookTitle: string;
  logs: InventoryLogItem[];
  isLoading: boolean;
}

export const InventoryLogsPanel: React.FC<InventoryLogsPanelProps> = ({
  selectedBookTitle,
  logs,
  isLoading,
}) => {
  return (
    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm h-full flex flex-col overflow-hidden">
      <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/20">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-850 dark:text-slate-100 flex items-center gap-2">
          <FileClock className="h-4.5 w-4.5 text-primary" />
          Nhật ký Kho gần đây
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-1 overflow-y-auto min-h-[380px] max-h-[460px] custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-20 space-y-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-[10px] text-slate-500 font-bold">Đang tải nhật ký...</p>
          </div>
        ) : !logs || logs.length === 0 ? (
          <div className="text-center py-20 text-slate-400 dark:text-slate-500 font-semibold text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
            Chưa có giao dịch kho nào được ghi nhận cho sách này.
          </div>
        ) : (
          <div className="space-y-3.5">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
              Lịch sử biến động: <span className="text-primary normal-case font-extrabold">{selectedBookTitle}</span>
            </p>
            {logs.map((log) => {
              const dateStr = log.createdAt
                ? new Date(log.createdAt).toLocaleString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                  })
                : "Không rõ";

              const isImport = log.type === "IMPORT" || log.change > 0;
              const isExport = log.type === "EXPORT" || log.change < 0;

              return (
                <div
                  key={log.id}
                  className="p-3 border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-850/40 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                        isImport
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : isExport
                          ? "bg-red-500/10 text-red-600 dark:text-red-400"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {log.type === "IMPORT"
                        ? "NHẬP KHO"
                        : log.type === "EXPORT"
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
                        {log.change > 0 ? `+${log.change}` : log.change} cuốn
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold max-w-[150px] truncate" title={log.reason}>
                      {log.reason || "Không có lý do"}
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[9px] font-semibold text-slate-400 dark:text-slate-500">
                    <span>Trước: {log.beforeQty ?? 0}</span>
                    <span>Sau: {log.afterQty ?? 0}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
