import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag, Trash2, Layers } from "lucide-react";
import type { Category } from "@/services/category-service";

interface CategoriesPanelProps {
  categories: Category[];
  catName: string;
  setCatName: (val: string) => void;
  onAddCategory: (e: React.FormEvent) => void;
  onDeleteCategory: (id: string) => void;
}

export const CategoriesPanel: React.FC<CategoriesPanelProps> = ({
  categories,
  catName,
  setCatName,
  onAddCategory,
  onDeleteCategory,
}) => {
  return (
    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
      <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/80">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-850 dark:text-slate-100 flex items-center gap-2">
          <Layers className="h-4.5 w-4.5 text-primary" />
          Quản lý Thể loại sách
        </CardTitle>
        <CardDescription className="text-[11px] text-slate-500 mt-1">
          Định nghĩa danh mục các thể loại và nhóm chủ đề sách trong hệ thống bán lẻ
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        {/* Quick Add Form */}
        <form onSubmit={onAddCategory} className="flex gap-2">
          <Input
            placeholder="Nhập tên thể loại mới..."
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-850 text-xs h-10 px-3.5 focus:ring-1 focus:ring-primary focus:border-primary rounded-lg flex-1 outline-none"
          />
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary/95 text-white text-xs font-bold px-4 h-10 rounded-lg shrink-0 cursor-pointer shadow-sm shadow-primary/10"
          >
            Thêm mới
          </Button>
        </form>

        {/* List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
          {categories.map((cat) => {
            const count = cat._count?.books ?? 0;
            return (
              <div key={cat.id} className="flex items-center justify-between py-3 hover:bg-slate-50/80 dark:hover:bg-slate-850/40 rounded-lg px-2.5 transition-colors group">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-850 dark:text-slate-200 group-hover:text-primary transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {count} tác phẩm liên kết
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-850 dark:text-slate-500 px-2 py-0.5 rounded-full font-bold">
                    #{cat.id.substring(0, 8).toUpperCase()}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    type="button"
                    onClick={() => onDeleteCategory(cat.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10 cursor-pointer h-7 w-7 rounded-lg"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
