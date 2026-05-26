import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, ArrowUpRight } from "lucide-react";
import type { InventoryItem } from "@/services/inventory-service";

interface InventoryImportFormProps {
  items: InventoryItem[];
  selectedId: string;
  setSelectedId: (id: string) => void;
  addQty: number;
  setAddQty: (qty: number) => void;
  onImport: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export const InventoryImportForm: React.FC<InventoryImportFormProps> = ({
  items,
  selectedId,
  setSelectedId,
  addQty,
  setAddQty,
  onImport,
  isSubmitting,
}) => {
  return (
    <Card className="border-border bg-card/20 backdrop-blur-sm h-fit">
      <CardHeader>
        <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          Nhập hàng bổ sung
        </CardTitle>
        <CardDescription className="text-[11px]">Khai báo nhập thêm sách vào kho lưu trữ</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onImport} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-muted-foreground">Chọn đầu sách nhập</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary h-[34px]"
              disabled={isSubmitting}
            >
              <option value="" disabled>-- Chọn đầu sách --</option>
              {items.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.book?.title || "Sách không tên"} (Kho: {it.quantity})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-muted-foreground">Số lượng bổ sung</label>
            <Input
              type="number"
              min="1"
              value={addQty}
              onChange={(e) => setAddQty(Number(e.target.value))}
              className="bg-card border-border text-xs"
              disabled={isSubmitting}
            />
          </div>

          <Button type="submit" disabled={isSubmitting || !selectedId} className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs h-9 gap-1.5 cursor-pointer">
            <ArrowUpRight className="h-4 w-4" />
            {isSubmitting ? "Đang xử lý..." : "Đồng ý nhập kho"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
