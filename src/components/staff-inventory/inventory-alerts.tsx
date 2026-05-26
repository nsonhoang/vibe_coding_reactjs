import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import type { InventoryItem } from "@/services/inventory-service";

interface InventoryAlertsProps {
  items: InventoryItem[];
}

export const InventoryAlerts: React.FC<InventoryAlertsProps> = ({ items }) => {
  const lowStockItems = items.filter(it => it.quantity <= 10);

  if (lowStockItems.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {lowStockItems.map(it => (
        <Card key={it.id} className="border-rose-500/20 bg-rose-500/5 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 bottom-0 left-0 w-1 bg-rose-500" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Badge className="bg-rose-500/10 border-rose-500/20 text-rose-600 hover:bg-rose-500/20 text-[9px] font-bold py-0.5 rounded px-2.5">
                Tồn kho thấp
              </Badge>
              <AlertTriangle className="h-4 w-4 text-rose-500" />
            </div>
            <CardTitle className="text-xs font-bold mt-2 text-foreground line-clamp-1">{it.book?.title || "Sách không tên"}</CardTitle>
            <CardDescription className="text-[10px]">
              Số lượng hiện tại: <span className="font-extrabold text-rose-600">{it.quantity}</span> (Mức tối thiểu: 10)
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};
