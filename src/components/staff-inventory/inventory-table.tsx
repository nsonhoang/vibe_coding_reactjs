import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ListFilter, Download, ChevronRight, Layers } from "lucide-react";
import type { InventoryItem } from "@/services/inventory-service";

interface InventoryTableProps {
  items: InventoryItem[];
  selectedId?: string;
  onSelectId?: (id: string) => void;
  onRowClick?: (item: InventoryItem) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  items,
  selectedId,
  onSelectId,
  onRowClick,
}) => {
  return (
    <Card className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
      <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-row items-center justify-between bg-slate-50/20">
        <div>
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-850 dark:text-slate-100 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-primary" />
            Tồn kho hiện tại
          </CardTitle>
          <CardDescription className="text-[10px] text-slate-400 font-semibold mt-0.5">
            Danh sách đầu sách trong kho, nhấn chọn hàng để xem nhật ký điều chỉnh chi tiết
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <button className="p-1.5 border border-slate-200 dark:border-slate-850 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850 transition-all">
            <ListFilter className="h-4 w-4" />
          </button>
          <button className="p-1.5 border border-slate-200 dark:border-slate-850 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850 transition-all">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/40 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800">
                <th className="px-5 py-3 font-extrabold text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-wider">
                  Sách / SKU
                </th>
                <th className="px-5 py-3 font-extrabold text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-wider">
                  Thể loại
                </th>
                <th className="px-5 py-3 font-extrabold text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-wider">
                  Tồn kho
                </th>
                <th className="px-5 py-3 font-extrabold text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-wider">
                  Vị trí kệ
                </th>
                <th className="px-5 py-3 font-extrabold text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {items.map((it, idx) => {
                const categoryNames =
                  it.book?.categories?.map((c: any) => c.name).join(", ") || "Chưa rõ";

                // Generate consistent shelf mock based on index
                const shelfArea = ["A", "B", "C", "D", "E"][idx % 5];
                const shelfShelf = String((idx * 3) % 20 + 1).padStart(2, "0");
                const shelfLocation = `Kệ ${shelfArea}-${shelfShelf}`;

                // Get book cover image
                const bookImages = (it.book as any)?.images || [];
                const coverUrl = bookImages.length > 0 ? bookImages[0] : "";

                const isSelected = selectedId ? selectedId === it.id : false;

                return (
                  <tr
                    key={it.id}
                    onClick={() => {
                      if (onSelectId) onSelectId(it.id);
                      if (onRowClick) onRowClick(it);
                    }}
                    className={`cursor-pointer transition-all border-l-2 ${
                      isSelected
                        ? "bg-primary/5 dark:bg-primary/10 border-l-primary"
                        : "hover:bg-slate-50/50 dark:hover:bg-slate-850/30 border-l-transparent"
                    } group`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-13 bg-slate-100 dark:bg-slate-850 rounded overflow-hidden shadow-sm border border-slate-200/60 dark:border-slate-800 flex-shrink-0">
                          {coverUrl ? (
                            <img alt={it.book?.title} className="w-full h-full object-cover" src={coverUrl} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-250 dark:bg-slate-800 text-[9px] font-bold text-slate-400">
                              BBOOK
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-extrabold text-slate-850 dark:text-slate-250 group-hover:text-primary transition-colors line-clamp-1">
                            {it.book?.title || "Sách chưa đặt tên"}
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono font-bold mt-0.5">
                            SKU: LIT-{(it.id.substring(0, 5) || "BOOK").toUpperCase()}-{idx.toString().padStart(3, "0")}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-xs font-semibold">
                      {categoryNames}
                    </td>
                    <td className="px-5 py-3.5 font-extrabold font-mono text-xs text-slate-900 dark:text-white">
                      {it.quantity} cuốn
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-xs font-bold font-mono">
                      {shelfLocation}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase ${
                          it.quantity > 10
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : it.quantity > 0
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-red-500/10 text-red-600 dark:text-red-400"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            it.quantity > 10
                              ? "bg-emerald-500"
                              : it.quantity > 0
                              ? "bg-amber-500"
                              : "bg-red-500"
                          }`}
                        />
                        {it.quantity > 10 ? "CÒN HÀNG" : it.quantity > 0 ? "SẮP HẾT" : "HẾT HÀNG"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-50/40 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          <span>
            Hiển thị 1-{items.length} trên {items.length} kết quả
          </span>
          <div className="flex gap-1">
            <button className="px-3 py-1 bg-white border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 transition-colors text-[9px] font-extrabold uppercase">
              Trước
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded-lg text-[9px] font-extrabold uppercase">
              1
            </button>
            <button className="px-3 py-1 bg-white border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 transition-colors text-[9px] font-extrabold uppercase">
              Sau
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
