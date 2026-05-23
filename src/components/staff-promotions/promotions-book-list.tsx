import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface PromotionBook {
  id: string;
  title: string;
  price: number;
}

interface PromotionsBookListProps {
  books: PromotionBook[];
  discountRate: number;
  selectedBookId: string;
  onSelectBookId: (id: string) => void;
  children?: React.ReactNode; // For slotting the detailed book viewer underneath
}

export const PromotionsBookList: React.FC<PromotionsBookListProps> = ({
  books,
  discountRate,
  selectedBookId,
  onSelectBookId,
  children,
}) => {
  return (
    <Card className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
      <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/20">
        <div>
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-850 dark:text-slate-100 flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-primary" />
            Đầu sách áp dụng giảm giá ({books?.length || 0})
          </CardTitle>
          <CardDescription className="text-[10px] text-slate-400 font-semibold mt-0.5">
            Nhấn chọn một cuốn sách trong danh sách để xem chi tiết thông tin giảm giá sản phẩm nghệ thuật
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/40 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800">
                <th className="px-5 py-3 font-extrabold text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-wider">
                  Tác phẩm / Mã sản phẩm
                </th>
                <th className="px-5 py-3 font-extrabold text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-wider">
                  Giá niêm yết
                </th>
                <th className="px-5 py-3 font-extrabold text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-wider">
                  Ưu đãi
                </th>
                <th className="px-5 py-3 font-extrabold text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-wider">
                  Giá khuyến mãi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {books?.map((b) => {
                const discountAmount = (b.price * discountRate) / 100;
                const promoPrice = b.price - discountAmount;
                const isSelected = selectedBookId === b.id;

                return (
                  <tr
                    key={b.id}
                    onClick={() => onSelectBookId(b.id)}
                    className={`cursor-pointer transition-all border-l-2 ${
                      isSelected
                        ? "bg-primary/5 dark:bg-primary/10 border-l-primary"
                        : "hover:bg-slate-50/50 dark:hover:bg-slate-850/30 border-l-transparent"
                    } group`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-11 bg-slate-100 dark:bg-slate-800 rounded flex-shrink-0 flex items-center justify-center border border-slate-200/50 text-[8px] font-bold text-slate-400">
                          BOOK
                        </div>
                        <div>
                          <div className="text-xs font-extrabold text-slate-850 dark:text-slate-250 group-hover:text-primary transition-colors line-clamp-1">
                            {b.title}
                          </div>
                          <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                            ID: {b.id.substring(0, 8).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-xs font-mono line-through font-medium">
                      {b.price.toLocaleString()} ₫
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[9px] font-black border border-rose-500/20">
                        -{discountRate}%
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold font-mono text-xs text-rose-600 dark:text-rose-400">
                      {promoPrice.toLocaleString()} ₫
                    </td>
                  </tr>
                );
              })}
              {(!books || books.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-bold text-xs">
                    Chương trình này chưa được gán đầu sách nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Embedded Book Detail Slot */}
        {children}
      </CardContent>
    </Card>
  );
};
