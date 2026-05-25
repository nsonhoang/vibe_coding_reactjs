import React, { memo } from "react";
import { Search, SlidersHorizontal, ArrowUpDown, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UsersFiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedRole: string;
  setSelectedRole: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  sortBy: "createdAt" | "name" | "email";
  setSortBy: (val: "createdAt" | "name" | "email") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (val: "asc" | "desc") => void;
  roles: { id: string; name: string }[];
  onOpenAdd: () => void;
  isLoadingRoles: boolean;
}

export const UsersFilters: React.FC<UsersFiltersProps> = memo(({
  searchTerm,
  setSearchTerm,
  selectedRole,
  setSelectedRole,
  selectedStatus,
  setSelectedStatus,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  roles,
  onOpenAdd,
  isLoadingRoles,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Search and Add User */}
      <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute inset-y-0 left-3 h-4 w-4 my-auto text-slate-400" />
          <Input
            placeholder="Tìm kiếm người dùng bằng họ tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-card border-slate-200 dark:border-slate-800 text-xs focus:ring-1 focus:ring-primary h-9.5 rounded-lg"
          />
        </div>
        <Button 
          onClick={onOpenAdd} 
          disabled={isLoadingRoles}
          className="bg-[#00288e] hover:bg-[#00288e]/95 text-white font-bold shadow-md shadow-[#00288e]/10 gap-2 h-9.5 text-xs cursor-pointer rounded-lg px-4.5 transition-transform active:scale-95"
        >
          <UserPlus className="h-4 w-4" />
          Tạo tài khoản mới
        </Button>
      </div>

      {/* Filter and Sort options Row */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-50/40 dark:bg-slate-850/10 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 shrink-0 select-none">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Bộ lọc & Sắp xếp:</span>
        </div>

        {/* Filter by Role */}
        <div className="flex items-center gap-1.5 min-w-[140px] flex-1 sm:flex-initial">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200 text-xs px-2.5 py-1.5 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer transition-colors"
          >
            <option value="">Tất cả vai trò</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Status */}
        <div className="flex items-center gap-1.5 min-w-[140px] flex-1 sm:flex-initial">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200 text-xs px-2.5 py-1.5 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer transition-colors"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang hoạt động</option>
            <option value="INACTIVE">Bị khóa</option>
          </select>
        </div>

        {/* Spacer on large screens */}
        <div className="hidden md:block flex-1"></div>

        {/* Sort By Field */}
        <div className="flex items-center gap-1.5 min-w-[140px] flex-1 sm:flex-initial">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider hidden lg:inline shrink-0 select-none">Xếp theo:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200 text-xs px-2.5 py-1.5 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer transition-colors"
          >
            <option value="createdAt">Ngày tạo tài khoản</option>
            <option value="name">Họ và tên</option>
            <option value="email">Địa chỉ Email</option>
          </select>
        </div>

        {/* Sort Order Direction Toggle */}
        <button
          type="button"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-slate-350 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200 text-xs px-3 py-1.5 rounded-lg shadow-sm font-semibold transition-all active:scale-95 cursor-pointer"
          title={sortOrder === "asc" ? "Sắp xếp tăng dần" : "Sắp xếp giảm dần"}
        >
          <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
          <span>{sortOrder === "asc" ? "Tăng dần" : "Giảm dần"}</span>
        </button>
      </div>
    </div>
  );
});

UsersFilters.displayName = "UsersFilters";
