import React, { memo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface BooksFiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  selectedAuthor: string;
  setSelectedAuthor: (val: string) => void;
  selectedStatus: "ALL" | "ACTIVE" | "HIDDEN" | "DRAFT" | "ARCHIVED";
  setSelectedStatus: (val: "ALL" | "ACTIVE" | "HIDDEN" | "DRAFT" | "ARCHIVED") => void;
  categories: any[];
  authors: any[];
  onClearFilters: () => void;
}

export const BooksFilters: React.FC<BooksFiltersProps> = memo(({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedAuthor,
  setSelectedAuthor,
  selectedStatus,
  setSelectedStatus,
  categories,
  authors,
  onClearFilters,
}) => {
  const showClear = searchTerm || selectedCategory || selectedAuthor || selectedStatus !== "ALL";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Keyword Search */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Từ khóa</label>
          <div className="relative">
            <Search className="absolute inset-y-0 left-3 h-3.5 w-3.5 my-auto text-slate-400" />
            <Input
              placeholder="Tên sách, tác giả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs font-semibold rounded-lg h-9 w-full focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary outline-none"
            />
          </div>
        </div>

        {/* Category Dropdown */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Thể loại</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-350 focus:outline-none focus:ring-1 focus:ring-primary h-9 transition-all cursor-pointer"
          >
            <option value="">Tất cả thể loại</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Author Dropdown */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Tác giả</label>
          <select
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-350 focus:outline-none focus:ring-1 focus:ring-primary h-9 transition-all cursor-pointer"
          >
            <option value="">Tất cả tác giả</option>
            {authors.map((aut: any) => (
              <option key={aut.id} value={aut.id}>
                {aut.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Switcher Toggle pills */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Trạng thái</label>
          <div className="flex gap-1 p-1 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-800 h-9">
            {(["ALL", "ACTIVE", "HIDDEN", "DRAFT"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={`flex-1 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  selectedStatus === st
                    ? "bg-primary text-white shadow-sm shadow-primary/10"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                {st === "ALL" ? "Tất cả" : st === "ACTIVE" ? "Mở bán" : st === "HIDDEN" ? "Ẩn" : "Nháp"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clear Filters Button */}
      {showClear && (
        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            onClick={onClearFilters}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-lg text-xs font-extrabold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            Xóa bộ lọc
          </button>
        </div>
      )}
    </div>
  );
});

BooksFilters.displayName = "BooksFilters";
