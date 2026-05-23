import React from "react";
import { Check } from "lucide-react";
import type { Category } from "@/services/category-service";
import type { Author } from "@/services/author-service";

interface RelationSelectorsProps {
  categories: Category[];
  selectedCategories: string[];
  onToggleCategory: (id: string) => void;
  authors: Author[];
  selectedAuthors: string[];
  onToggleAuthor: (id: string) => void;
  isSaving: boolean;
}

export const RelationSelectors: React.FC<RelationSelectorsProps> = ({
  categories,
  selectedCategories,
  onToggleCategory,
  authors,
  selectedAuthors,
  onToggleAuthor,
  isSaving,
}) => {
  return (
    <div className="space-y-4">
      {/* Category Box */}
      <div className="space-y-1.5">
        <label className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider block">
          Thể loại tuyển tập ({selectedCategories.length} đã chọn)
        </label>
        <div className="grid grid-cols-2 gap-1.5 max-h-[135px] overflow-y-auto p-2 border border-border/80 rounded-lg bg-accent/5 shadow-inner scrollbar-thin">
          {categories.map((cat) => {
            const isChecked = selectedCategories.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onToggleCategory(cat.id)}
                className={`flex items-center justify-between p-2 rounded border text-left text-[9px] font-bold transition-all duration-150 cursor-pointer ${
                  isChecked
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/60 hover:bg-accent/40 text-foreground/80"
                }`}
                disabled={isSaving}
              >
                <span className="truncate pr-1">{cat.name}</span>
                {isChecked && <Check className="h-2.5 w-2.5 shrink-0 text-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Author Box */}
      <div className="space-y-1.5">
        <label className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider block">
          Tác giả biên soạn ({selectedAuthors.length} đã chọn)
        </label>
        <div className="grid grid-cols-2 gap-1.5 max-h-[135px] overflow-y-auto p-2 border border-border/80 rounded-lg bg-accent/5 shadow-inner scrollbar-thin">
          {authors.map((aut) => {
            const isChecked = selectedAuthors.includes(aut.id);
            return (
              <button
                key={aut.id}
                type="button"
                onClick={() => onToggleAuthor(aut.id)}
                className={`flex items-center justify-between p-2 rounded border text-left text-[9px] font-bold transition-all duration-150 cursor-pointer ${
                  isChecked
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/60 hover:bg-accent/40 text-foreground/80"
                }`}
                disabled={isSaving}
              >
                <span className="truncate pr-1">{aut.name}</span>
                {isChecked && <Check className="h-2.5 w-2.5 shrink-0 text-primary" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
