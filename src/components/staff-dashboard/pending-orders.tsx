import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Order } from "@/services/order-service";

interface PendingOrdersProps {
  orders: Order[];
  onViewAll: () => void;
  onProcessOrder: (id: string) => void;
}

export const PendingOrders: React.FC<PendingOrdersProps> = ({
  orders,
  onViewAll,
  onProcessOrder,
}) => {
  return (
    <Card className="border-border bg-card/20 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-xs font-bold uppercase tracking-wider">Đơn hàng mới chờ duyệt</CardTitle>
          <CardDescription className="text-[11px]">Đơn hàng cần đóng gói và chuyển cho shipper hôm nay</CardDescription>
        </div>
        <Button variant="ghost" size="xs" onClick={onViewAll} className="text-xs gap-1 cursor-pointer">
          Xem tất cả
          <ArrowRight className="h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 text-muted-foreground pb-2 font-semibold">
                <th className="py-2.5">Mã đơn</th>
                <th className="py-2.5">Khách hàng</th>
                <th className="py-2.5">Sách đặt mua</th>
                <th className="py-2.5">Tổng tiền</th>
                <th className="py-2.5">Thời gian đặt</th>
                <th className="py-2.5">Trạng thái</th>
                <th className="py-2.5 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {orders.map((ord) => {
                const bookNames = ord.items
                  ?.map((it: any) => `${it.book?.title || "Sách"} (x${it.quantity})`)
                  .join(", ") || "Không rõ";

                const dateStr = ord.createdAt ? new Date(ord.createdAt).toLocaleString("vi-VN") : "Vừa xong";

                return (
                  <tr key={ord.id} className="hover:bg-accent/40 transition-colors">
                    <td className="py-3 font-semibold text-muted-foreground font-mono">{ord.id.substring(0, 8)}</td>
                    <td className="py-3 font-bold">{ord.fullName}</td>
                    <td className="py-3 text-foreground/80 max-w-sm truncate" title={bookNames}>{bookNames}</td>
                    <td className="py-3 font-extrabold text-primary font-mono">{(ord.totalPrice || 0).toLocaleString()} ₫</td>
                    <td className="py-3 text-muted-foreground">{dateStr}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[9px] font-extrabold text-amber-600 dark:text-amber-400">
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Button
                        size="xs"
                        onClick={() => onProcessOrder(ord.id)}
                        className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-[10px] h-7 px-2.5 rounded shadow-sm shadow-primary/10 cursor-pointer"
                      >
                        Duyệt đơn
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    Không có đơn hàng nào đang chờ duyệt.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
