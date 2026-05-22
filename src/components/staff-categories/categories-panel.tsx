import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag, Trash2 } from "lucide-react";
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
    <Card className="border-border bg-card/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
          <Tag className="h-4.5 w-4.5 text-primary" />
          Quản lý Thể loại sách
        </CardTitle>
        <CardDescription className="text-[11px]">Thêm và phân loại các chủ đề sách bán trên app</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Add Form */}
        <form onSubmit={onAddCategory} className="flex gap-2">
          <Input
            placeholder="Nhập tên thể loại mới..."
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            className="bg-card border-border text-xs h-9"
          />
          <Button type="submit" size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-bold shrink-0 cursor-pointer">
            Thêm mới
          </Button>
        </form>

        {/* List */}
        <div className="divide-y divide-border/60 max-h-[400px] overflow-y-auto pr-1">
          {categories.map((cat) => {
            const count = cat._count?.books ?? 0;
            return (
              <div key={cat.id} className="flex items-center justify-between py-3 hover:bg-accent/30 rounded px-1.5 transition-colors">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-foreground">{cat.name}</span>
                  <span className="text-[9px] text-muted-foreground font-semibold">{count} đầu sách liên kết</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-muted-foreground bg-accent/20 px-1 py-0.5 rounded">ID: {cat.id.substring(0, 8)}</span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    type="button"
                    onClick={() => onDeleteCategory(cat.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
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
