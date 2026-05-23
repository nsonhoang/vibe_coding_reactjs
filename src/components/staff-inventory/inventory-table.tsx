import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import type { InventoryItem } from "@/services/inventory-service";

interface InventoryTableProps {
  items: InventoryItem[];
}

export const InventoryTable: React.FC<InventoryTableProps> = ({ items }) => {
  return (
    <Card className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/80">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
          Thống kê thẻ kho sản phẩm
        </CardTitle>
        <CardDescription className="text-[11px] text-slate-500 mt-1">
          Danh mục số lượng tồn thực tế của các loại sách đang bày bán
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Mã kho</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Thông tin đầu sách</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Phân loại</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Số lượng tồn</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {items.map((it) => {
                const categoryNames = it.book?.categories?.map((c: any) => c.name).join(", ") || "Chưa rõ";
                
                // Get book cover image
                const bookImages = (it.book as any)?.images || [];
                const coverUrl = bookImages.length > 0 ? bookImages[0] : "";

                return (
                  <tr key={it.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 font-mono text-xs">
                      #{it.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-12 bg-slate-100 dark:bg-slate-850 rounded overflow-hidden shadow-sm border border-slate-200/60 dark:border-slate-800 flex-shrink-0">
                          {coverUrl ? (
                            <img alt={it.book?.title} className="w-full h-full object-cover" src={coverUrl} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-[9px] font-bold text-slate-400">
                              NO COV
                            </div>
                          )}
                        </div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {it.book?.title || "Sách không tên"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                      {categoryNames}
                    </td>
                    <td className="px-6 py-4 font-extrabold font-mono text-xs text-slate-900 dark:text-white">
                      {it.stock} cuốn
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        it.stock > it.minAlert 
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                          : it.stock > 0
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-red-500/10 text-red-600 dark:text-red-400"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${it.stock > it.minAlert ? "bg-emerald-500" : it.stock > 0 ? "bg-amber-500" : "bg-red-500"}`} />
                        {it.stock > it.minAlert ? "An toàn" : it.stock > 0 ? "Tồn kho thấp" : "Cháy hàng"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
