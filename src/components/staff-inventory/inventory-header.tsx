import React from "react";
import { Search, Plus } from "lucide-react";

interface InventoryHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAdjustClick: () => void;
  onCreateClick: () => void;
}

export const InventoryHeader: React.FC<InventoryHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onAdjustClick,
  onCreateClick,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 className="text-xl font-black text-slate-850 dark:text-slate-100 uppercase tracking-wider">
          Quản lý Kho hàng & Nhật ký
        </h2>
        <p className="text-xs text-slate-450 dark:text-slate-400 font-semibold mt-1">
          Theo dõi tồn kho thực tế và quản lý biến động hàng hóa trong kho NestJS Bookstore.
        </p>
      </div>
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Tìm kiếm sách, SKU, kệ vị trí..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-4 py-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
          />
        </div>
        <button
          onClick={onCreateClick}
          className="flex items-center gap-1.5 px-4 py-2 border border-primary text-primary hover:bg-primary/5 rounded-xl text-xs font-black shadow-sm transition-all uppercase tracking-wider bg-white dark:bg-slate-900 cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          Thêm kho mới
        </button>
        <button
          onClick={onAdjustClick}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-black shadow-md shadow-primary/10 hover:opacity-90 transition-all uppercase tracking-wider cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          Điều chỉnh kho
        </button>
      </div>
    </div>
  );
};
