import React from "react";
import { Info, Loader2 } from "lucide-react";
import type { Book } from "@/services/book-service";

interface PromotionsBookDetailProps {
  isLoading: boolean;
  book: Book | null | undefined;
}

export const PromotionsBookDetail: React.FC<PromotionsBookDetailProps> = ({
  isLoading,
  book,
}) => {
  return (
    <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="flex items-center gap-2 mb-3">
        <Info className="h-4 w-4 text-primary" />
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-850 dark:text-slate-100">
          Thông tin tác phẩm nghệ thuật giảm giá
        </h4>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold py-4">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Đang đồng bộ thông tin sách...
        </div>
      ) : book ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          {/* Image cover column */}
          <div className="md:col-span-1 flex justify-center">
            <div className="w-24 h-32 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200/80 shadow-sm flex-shrink-0">
              {book.thumbnail ? (
                <img alt={book.title} src={book.thumbnail} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-slate-400 text-[10px]">
                  NO COVER
                </div>
              )}
            </div>
          </div>
          {/* Metadata column */}
          <div className="md:col-span-3 space-y-2 leading-relaxed">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              {book.title}
            </h3>
            <div className="flex flex-wrap gap-2 text-[10px] font-bold">
              <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-650 dark:text-slate-400">
                Tác giả: {book.authors?.map((a) => a.name).join(", ") || "Chưa rõ"}
              </span>
              <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-650 dark:text-slate-400">
                Thể loại: {book.categories?.map((c) => c.name).join(", ") || "Chưa rõ"}
              </span>
              <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-650 dark:text-slate-400 font-mono">
                Giá gốc: {book.price.toLocaleString()} ₫
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-3 italic">
              {book.description || "Tác phẩm này chưa có nội dung tóm tắt chi tiết."}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-xs text-rose-500 py-2 font-bold">
          Không thể tải thông tin cuốn sách này.
        </div>
      )}
    </div>
  );
};
