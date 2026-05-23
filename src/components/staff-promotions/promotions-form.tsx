import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Percent, Edit3, Calendar, Search } from "lucide-react";
import type { Book } from "@/services/book-service";

interface PromotionsFormProps {
  books: Book[];
  selectedBookIds: string[];
  setSelectedBookIds: (ids: string[]) => void;
  rate: number;
  setRate: (rate: number) => void;
  promoName: string;
  setPromoName: (name: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  onApplyPromo: (e: React.FormEvent) => void;
  isSubmitting: boolean;

  // Edit Mode Props
  isEditMode: boolean;
  onCancelEdit: () => void;
}

export const PromotionsForm: React.FC<PromotionsFormProps> = ({
  books,
  selectedBookIds,
  setSelectedBookIds,
  rate,
  setRate,
  promoName,
  setPromoName,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onApplyPromo,
  isSubmitting,
  isEditMode,
  onCancelEdit,
}) => {
  const [bookSearch, setBookSearch] = useState("");

  // Advanced client-side search by title, author, categories
  const filteredBooks = books.filter((b) => {
    const title = b.title.toLowerCase();
    const authors = b.authors?.map((a) => a.name.toLowerCase()).join(" ") || "";
    const categories = b.categories?.map((c) => c.name.toLowerCase()).join(" ") || "";
    const query = bookSearch.toLowerCase().trim();
    return title.includes(query) || authors.includes(query) || categories.includes(query);
  });

  const handleSelectAll = () => {
    setSelectedBookIds(books.map((b) => b.id));
  };

  const handleDeselectAll = () => {
    setSelectedBookIds([]);
  };

  return (
    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden h-fit transition-all duration-300">
      <CardHeader className={`p-5 border-b border-slate-100 dark:border-slate-800/80 ${isEditMode ? 'bg-amber-500/5' : ''}`}>
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-850 dark:text-slate-100 flex items-center gap-2">
          {isEditMode ? (
            <>
              <Edit3 className="h-4.5 w-4.5 text-amber-500" />
              Cập nhật khuyến mãi
            </>
          ) : (
            <>
              <Percent className="h-4.5 w-4.5 text-primary" />
              Thiết lập giảm giá
            </>
          )}
        </CardTitle>
        <CardDescription className="text-[11px] text-slate-500 mt-1">
          {isEditMode
            ? "Thay đổi các thông tin chương trình chiết khấu trực tiếp"
            : "Thiết lập chương trình chiết khấu trực tiếp trên nhiều đầu sách và thời gian áp dụng"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5">
        <form onSubmit={onApplyPromo} className="space-y-4 text-xs">
          {/* Tên chương trình */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">
              Tên chương trình khuyến mãi
            </label>
            <Input
              placeholder="E.g. Sale Hè Rực Rỡ 2026"
              value={promoName}
              onChange={(e) => setPromoName(e.target.value)}
              className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs h-10 px-3.5 focus:ring-1 focus:ring-primary focus:border-primary rounded-lg w-full outline-none"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Chọn nhiều sách */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">
                Chọn sách áp dụng ({selectedBookIds.length} đã chọn)
              </label>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  disabled={isSubmitting}
                  className="text-[10px] text-primary hover:underline font-bold cursor-pointer disabled:opacity-40"
                >
                  Chọn tất cả
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  disabled={isSubmitting}
                  className="text-[10px] text-rose-500 hover:underline font-bold cursor-pointer disabled:opacity-40"
                >
                  Bỏ chọn
                </button>
              </div>
            </div>

            {/* SPACIOUS Search box */}
            <div className="relative">
              <Search className="absolute inset-y-0 left-2.5 h-3.5 w-3.5 my-auto text-slate-400 pointer-events-none" />
              <Input
                placeholder="Tìm sách theo tiêu đề, tác giả, thể loại..."
                value={bookSearch}
                onChange={(e) => setBookSearch(e.target.value)}
                disabled={isSubmitting}
                className="pl-8 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-[11px] h-9 focus:ring-1 focus:ring-primary focus:border-primary rounded-lg w-full outline-none"
              />
            </div>

            {/* SPACIOUS CATALOG (Container height increased to 320px) */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg max-h-[320px] overflow-y-auto p-2.5 bg-slate-50/50 dark:bg-slate-900/50 space-y-1.5 scrollbar-thin">
              {filteredBooks.map((b) => {
                const isChecked = selectedBookIds.includes(b.id);
                const bookAuthors = b.authors?.map((a) => a.name).join(", ") || "Chưa rõ tác giả";
                const bookCats = b.categories?.map((c) => c.name).join(", ");

                return (
                  <label
                    key={b.id}
                    className={`flex items-start gap-3 cursor-pointer hover:bg-slate-100/80 dark:hover:bg-slate-800/40 p-2.5 rounded-lg border transition-all ${
                      isChecked
                        ? "bg-primary/5 dark:bg-primary/10 border-primary/20"
                        : "border-transparent bg-white dark:bg-slate-900"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={isSubmitting}
                      onChange={() => {
                        if (isChecked) {
                          setSelectedBookIds(selectedBookIds.filter((id) => id !== b.id));
                        } else {
                          setSelectedBookIds([...selectedBookIds, b.id]);
                        }
                      }}
                      className="mt-1.5 rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                    />
                    <div className="flex-1 leading-tight min-w-0">
                      <p className="font-extrabold text-slate-800 dark:text-slate-250 text-xs line-clamp-1">
                        {b.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[9px] font-bold text-slate-400 dark:text-slate-500">
                        <span>TG: {bookAuthors}</span>
                        {bookCats && (
                          <>
                            <span>•</span>
                            <span className="text-primary/70">{bookCats}</span>
                          </>
                        )}
                      </div>
                      <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-extrabold mt-1">
                        {b.price.toLocaleString()} ₫
                      </p>
                    </div>
                  </label>
                );
              })}
              {filteredBooks.length === 0 && (
                <div className="text-center text-[10px] text-slate-500 py-10 font-bold uppercase tracking-wider">
                  Không tìm thấy sách nào trùng khớp
                </div>
              )}
            </div>
          </div>

          {/* Phần trăm giảm giá */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">
              Phần trăm giảm giá (%)
            </label>
            <Input
              type="number"
              min="1"
              max="90"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs h-10 px-3.5 focus:ring-1 focus:ring-primary focus:border-primary rounded-lg w-full outline-none"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* DateTime Settings for starts/ends hours & minutes */}
          <div className="grid grid-cols-2 gap-3 pb-1">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-450" />
                Thời điểm bắt đầu
              </label>
              <Input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs h-10 px-2.5 focus:ring-1 focus:ring-primary focus:border-primary rounded-lg w-full outline-none"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-450" />
                Thời điểm kết thúc
              </label>
              <Input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs h-10 px-2.5 focus:ring-1 focus:ring-primary focus:border-primary rounded-lg w-full outline-none"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <Button
              type="submit"
              disabled={isSubmitting || selectedBookIds.length === 0}
              className={`w-full font-bold text-xs h-10 rounded-lg shadow-sm cursor-pointer transition-colors ${
                isEditMode
                  ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/10 text-white"
                  : "bg-primary hover:bg-primary/95 shadow-primary/10 text-white"
              }`}
            >
              {isEditMode
                ? (isSubmitting ? "Đang lưu thay đổi..." : "Lưu thay đổi")
                : (isSubmitting ? "Đang áp dụng..." : "Áp dụng chiết khấu")}
            </Button>

            {isEditMode && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancelEdit}
                disabled={isSubmitting}
                className="w-full border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs h-10 rounded-lg cursor-pointer"
              >
                Hủy chỉnh sửa
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
