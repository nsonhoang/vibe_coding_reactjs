import React from "react";
import { Loader2, Layers } from "lucide-react";
import type { InventoryLogItem } from "@/components/staff-inventory/inventory-logs-panel";

interface InventoryLogsTableProps {
  logs: InventoryLogItem[];
  isLoading: boolean;
  warehouseItems?: any[];
}

export const InventoryLogsTable: React.FC<InventoryLogsTableProps> = ({ logs, isLoading, warehouseItems = [] }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-24 space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Đang tải nhật ký giao dịch...</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-24 text-slate-400 dark:text-slate-500 font-bold text-xs border-b border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/20 dark:bg-slate-900/20">
        📭 Không tìm thấy bản ghi biến động nào phù hợp với bộ lọc đã chọn.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/40 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800">
            <th className="px-5 py-3 font-extrabold text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-wider">
              Thời gian
            </th>
            <th className="px-5 py-3 font-extrabold text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-wider">
              Đầu sách / Kho chứa
            </th>
            <th className="px-5 py-3 font-extrabold text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-wider">
              Loại giao dịch
            </th>
            <th className="px-5 py-3 font-extrabold text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-wider text-right">
              Lượng biến động
            </th>
            <th className="px-5 py-3 font-extrabold text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-wider">
              Tồn trước / sau
            </th>
            <th className="px-5 py-3 font-extrabold text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-wider">
              Ghi chú / Lý do
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {logs.map((log) => {
            const isImport = log.type === "IN";
            const isExport = log.type === "OUT";
            const matchedWarehouse = warehouseItems.find((w) => w.id === log.inventoryId);
            const logBookTitle = log.inventory?.book?.title || matchedWarehouse?.book?.title || "Sách chưa đặt tên";

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
              <tr key={log.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-850/20 transition-all">
                <td className="px-5 py-3.5 text-[11px] text-slate-400 dark:text-slate-500 font-bold font-mono">
                  {dateStr}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-md">
                      <Layers className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-xs font-extrabold text-slate-880 dark:text-slate-200 line-clamp-1 max-w-[280px]">
                      {logBookTitle}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex items-center rounded px-2 py-0.5 text-[8px] font-black uppercase tracking-wider ${
                      isImport
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : isExport
                        ? "bg-red-500/10 text-red-600 dark:text-red-400"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {log.type === "IN" ? "NHẬP KHO" : log.type === "OUT" ? "XUẤT KHO" : "ĐIỀU CHỈNH"}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right font-black font-mono text-xs">
                  <span
                    className={
                      isImport
                        ? "text-emerald-600 dark:text-emerald-400"
                        : isExport
                        ? "text-red-600 dark:text-red-400"
                        : "text-amber-600 dark:text-amber-400"
                    }
                  >
                    {isImport ? "+" : isExport ? "-" : ""}
                    {log.change} cuốn
                  </span>
                </td>
                <td className="px-5 py-3.5 text-[10px] text-slate-500 dark:text-slate-400 font-bold font-mono">
                  {log.beforeQty ?? 0} → {log.afterQty ?? 0}
                </td>
                <td
                  className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400 font-semibold max-w-[200px] truncate"
                  title={log.reason || undefined}
                >
                  {log.reason || <span className="text-slate-350 dark:text-slate-650 italic">Không ghi chú</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
