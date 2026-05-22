import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import type { InventoryItem } from "@/services/inventory-service";

interface InventoryTableProps {
  items: InventoryItem[];
}

export const InventoryTable: React.FC<InventoryTableProps> = ({ items }) => {
  return (
    <Card className="md:col-span-2 border-border bg-card/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xs font-bold uppercase tracking-wider">Thống kê thẻ kho sản phẩm</CardTitle>
        <CardDescription className="text-[11px]">Danh mục số lượng tồn thực tế của các loại sách đang bày bán</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 text-muted-foreground pb-2 font-semibold">
                <th className="py-2.5">Mã kho</th>
                <th className="py-2.5">Tên đầu sách</th>
                <th className="py-2.5">Phân loại</th>
                <th className="py-2.5">Số lượng tồn</th>
                <th className="py-2.5">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {items.map((it) => {
                const categoryNames = it.book?.categories?.map((c: any) => c.name).join(", ") || "Chưa rõ";
                return (
                  <tr key={it.id} className="hover:bg-accent/40 transition-colors">
                    <td className="py-3 font-semibold text-muted-foreground font-mono">{it.id.substring(0, 8)}</td>
                    <td className="py-3 font-bold text-foreground">{it.book?.title || "Sách không tên"}</td>
                    <td className="py-3 text-muted-foreground">{categoryNames}</td>
                    <td className="py-3 font-extrabold font-mono">{it.stock} cuốn</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[9px] font-bold ${
                        it.stock > it.minAlert 
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                          : it.stock > 0
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-destructive/10 text-destructive"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${it.stock > it.minAlert ? "bg-emerald-500" : it.stock > 0 ? "bg-amber-500" : "bg-destructive"}`} />
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
