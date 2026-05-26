import React from "react";

interface InventoryLogsPaginationProps {
  page: number;
  totalPages: number;
  totalLogs: number;
  onPageChange: (page: number) => void;
}

export const InventoryLogsPagination: React.FC<InventoryLogsPaginationProps> = ({
  page,
  totalPages,
  totalLogs,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="p-4 bg-slate-50/40 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
      <span>
        Hiển thị {Math.min(totalLogs, (page - 1) * 10 + 1)}-{Math.min(totalLogs, page * 10)} trên {totalLogs} bản ghi
      </span>
      <div className="flex gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-850 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-[9px] font-extrabold uppercase disabled:opacity-40 cursor-pointer"
        >
          Trước
        </button>
        <div className="flex items-center px-3 text-[10px] font-black font-mono text-slate-700 dark:text-slate-350">
          Trang {page} / {totalPages}
        </div>
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-850 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-[9px] font-extrabold uppercase disabled:opacity-40 cursor-pointer"
        >
          Sau
        </button>
      </div>
    </div>
  );
};
