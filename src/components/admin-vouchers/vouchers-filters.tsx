import React, { memo } from "react";
import { Search, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface VouchersFiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  sortBy: "createdAt" | "code" | "startDate" | "endDate" | "usedCount";
  setSortBy: (val: "createdAt" | "code" | "startDate" | "endDate" | "usedCount") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (val: "asc" | "desc") => void;
  onOpenAdd: () => void;
}

export const VouchersFilters: React.FC<VouchersFiltersProps> = memo(({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  onOpenAdd,
}) => {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-3 flex-1">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute inset-y-0 left-3 h-4 w-4 my-auto text-slate-400" />
          <Input
            placeholder="Tìm kiếm voucher bằng Code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-card border-slate-200 dark:border-slate-800 text-xs focus:ring-1 focus:ring-primary h-9 rounded-lg"
          />
        </div>
        
        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs h-9 rounded-lg px-3 focus:ring-1 focus:ring-primary focus:border-primary text-slate-600 dark:text-slate-350 cursor-pointer font-medium outline-none"
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="ACTIVE">Đang hoạt động</option>
          <option value="INACTIVE">Tạm dừng hoạt động</option>
        </select>

        {/* Sort By Field */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs h-9 rounded-lg px-3 focus:ring-1 focus:ring-primary focus:border-primary text-slate-600 dark:text-slate-350 cursor-pointer font-medium outline-none"
        >
          <option value="createdAt">Sắp xếp: Ngày tạo</option>
          <option value="code">Sắp xếp: Mã code</option>
          <option value="startDate">Sắp xếp: Ngày bắt đầu</option>
          <option value="endDate">Sắp xếp: Ngày hết hạn</option>
          <option value="usedCount">Sắp xếp: Lượt sử dụng</option>
        </select>

        {/* Sort Order Direction */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as any)}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs h-9 rounded-lg px-3 focus:ring-1 focus:ring-primary focus:border-primary text-slate-600 dark:text-slate-350 cursor-pointer font-medium outline-none"
        >
          <option value="desc">Giảm dần (Mới nhất/Lớn nhất)</option>
          <option value="asc">Tăng dần (Cũ nhất/Nhỏ nhất)</option>
        </select>
      </div>
      <Button 
        onClick={onOpenAdd} 
        className="bg-[#00288e] hover:bg-[#00288e]/95 text-white font-bold shadow-md shadow-[#00288e]/10 gap-2 h-9 text-xs cursor-pointer rounded-lg px-4 self-start lg:self-auto shrink-0"
      >
        <PlusCircle className="h-3.5 w-3.5" />
        Tạo Voucher mới
      </Button>
    </div>
  );
});

VouchersFilters.displayName = "VouchersFilters";
