import React, { useState } from "react";
import { Check, Search, X } from "lucide-react";
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
  const [catQuery, setCatQuery] = useState("");
  const [autQuery, setAutQuery] = useState("");

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(catQuery.toLowerCase())
  );

  const filteredAuthors = authors.filter((aut) =>
    aut.name.toLowerCase().includes(autQuery.toLowerCase())
  );

  const selectedCatObjects = categories.filter((cat) =>
    selectedCategories.includes(cat.id)
  );

  const selectedAutObjects = authors.filter((aut) =>
    selectedAuthors.includes(aut.id)
  );

  return (
    <div className="space-y-5">
      {/* Category Selection Block */}
      <div className="space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider block pl-1">
            Thể loại tuyển tập ({selectedCategories.length} đã chọn)
          </label>
          <div className="relative w-full sm:w-44">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/75" />
            <input
              type="text"
              placeholder="Tìm thể loại..."
              value={catQuery}
              onChange={(e) => setCatQuery(e.target.value)}
              className="pl-8 pr-7 py-1 w-full bg-background border border-border/80 rounded-md text-[10px] font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all shadow-sm h-7"
              disabled={isSaving}
            />
            {catQuery && (
              <button
                type="button"
                onClick={() => setCatQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer flex items-center justify-center h-4 w-4"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Selected Categories Tags Bar */}
        {selectedCatObjects.length > 0 && (
          <div className="flex flex-wrap gap-1 p-2 border border-primary/20 bg-primary/5 rounded-lg min-h-[32px] transition-all max-h-[85px] overflow-y-auto">
            {selectedCatObjects.map((cat) => (
              <span
                key={cat.id}
                onClick={() => !isSaving && onToggleCategory(cat.id)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary/15 text-primary text-[8.5px] font-black cursor-pointer hover:bg-destructive hover:text-white transition-colors duration-150 shadow-sm border border-primary/10 select-none group"
                title="Nhấp để bỏ chọn nhanh"
              >
                {cat.name}
                <X className="h-2 w-2 shrink-0 text-primary group-hover:text-white transition-colors" />
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-1.5 max-h-[160px] overflow-y-auto p-2.5 border border-border/85 rounded-lg bg-accent/5 shadow-inner scrollbar-thin">
          {filteredCategories.length === 0 ? (
            <div className="col-span-2 py-6 text-center text-muted-foreground text-[10px] font-bold">
              Không tìm thấy thể loại phù hợp
            </div>
          ) : (
            filteredCategories.map((cat) => {
              const isChecked = selectedCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onToggleCategory(cat.id)}
                  className={`flex items-center justify-between p-2.5 rounded-md border text-left text-[9px] font-extrabold transition-all duration-150 cursor-pointer ${
                    isChecked
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-border/60 hover:bg-accent/40 text-foreground/80 hover:border-border"
                  }`}
                  disabled={isSaving}
                >
                  <span className="truncate pr-1">{cat.name}</span>
                  {isChecked && <Check className="h-2.5 w-2.5 shrink-0 text-primary" />}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Author Selection Block */}
      <div className="space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider block pl-1">
            Tác giả biên soạn ({selectedAuthors.length} đã chọn)
          </label>
          <div className="relative w-full sm:w-44">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/75" />
            <input
              type="text"
              placeholder="Tìm tác giả..."
              value={autQuery}
              onChange={(e) => setAutQuery(e.target.value)}
              className="pl-8 pr-7 py-1 w-full bg-background border border-border/80 rounded-md text-[10px] font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all shadow-sm h-7"
              disabled={isSaving}
            />
            {autQuery && (
              <button
                type="button"
                onClick={() => setAutQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer flex items-center justify-center h-4 w-4"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Selected Authors Tags Bar */}
        {selectedAutObjects.length > 0 && (
          <div className="flex flex-wrap gap-1 p-2 border border-primary/20 bg-primary/5 rounded-lg min-h-[32px] transition-all max-h-[85px] overflow-y-auto">
            {selectedAutObjects.map((aut) => (
              <span
                key={aut.id}
                onClick={() => !isSaving && onToggleAuthor(aut.id)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary/15 text-primary text-[8.5px] font-black cursor-pointer hover:bg-destructive hover:text-white transition-colors duration-150 shadow-sm border border-primary/10 select-none group"
                title="Nhấp để bỏ chọn nhanh"
              >
                {aut.name}
                <X className="h-2 w-2 shrink-0 text-primary group-hover:text-white transition-colors" />
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-1.5 max-h-[160px] overflow-y-auto p-2.5 border border-border/85 rounded-lg bg-accent/5 shadow-inner scrollbar-thin">
          {filteredAuthors.length === 0 ? (
            <div className="col-span-2 py-6 text-center text-muted-foreground text-[10px] font-bold">
              Không tìm thấy tác giả phù hợp
            </div>
          ) : (
            filteredAuthors.map((aut) => {
              const isChecked = selectedAuthors.includes(aut.id);
              return (
                <button
                  key={aut.id}
                  type="button"
                  onClick={() => onToggleAuthor(aut.id)}
                  className={`flex items-center justify-between p-2.5 rounded-md border text-left text-[9px] font-extrabold transition-all duration-150 cursor-pointer ${
                    isChecked
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-border/60 hover:bg-accent/40 text-foreground/80 hover:border-border"
                  }`}
                  disabled={isSaving}
                >
                  <span className="truncate pr-1">{aut.name}</span>
                  {isChecked && <Check className="h-2.5 w-2.5 shrink-0 text-primary" />}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
