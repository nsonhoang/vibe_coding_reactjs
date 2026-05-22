import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, Ban } from "lucide-react";
import type { Order } from "@/services/order-service";

interface OrdersTableProps {
  orders: Order[];
  onOpenDetail: (ord: Order) => void;
  onUpdateStatusQuick: (id: string, newStatus: Order["status"]) => void;
  isSubmitting: boolean;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onOpenDetail,
  onUpdateStatusQuick,
  isSubmitting,
}) => {
  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 font-bold hover:bg-amber-500/20 text-[9px] uppercase tracking-wide">Chờ duyệt</Badge>;
      case "PROCESSING":
        return <Badge className="bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-500/20 text-[9px] uppercase tracking-wide">Đang xử lý</Badge>;
      case "SHIPPED":
        return <Badge className="bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-500/20 text-[9px] uppercase tracking-wide">Đang giao</Badge>;
      case "COMPLETED":
        return <Badge className="bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-500/20 text-[9px] uppercase tracking-wide">Hoàn thành</Badge>;
      default:
        return <Badge className="bg-destructive/10 border-destructive/20 text-destructive font-bold hover:bg-destructive/20 text-[9px] uppercase tracking-wide">Đã hủy</Badge>;
    }
  };

  return (
    <Card className="border-border bg-card/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xs font-bold uppercase tracking-wider">Quản lý Đơn hàng</CardTitle>
        <CardDescription className="text-[11px]">Duyệt đơn, in phiếu xuất kho và gán mã vận đơn</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 text-muted-foreground pb-2 font-semibold">
                <th className="py-2.5">Mã đơn</th>
                <th className="py-2.5">Khách hàng</th>
                <th className="py-2.5">Thời gian đặt</th>
                <th className="py-2.5">Sách mua</th>
                <th className="py-2.5">Tổng thanh toán</th>
                <th className="py-2.5">Trạng thái</th>
                <th className="py-2.5 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {orders.map((ord) => {
                const itemsSummary = ord.items
                  ?.map((it: any) => `${it.book?.title || "Sách"} (x${it.quantity})`)
                  .join(", ") || "Không rõ";

                const dateStr = ord.createdAt ? new Date(ord.createdAt).toLocaleString("vi-VN") : "Không rõ";

                return (
                  <tr key={ord.id} className="hover:bg-accent/40 transition-colors">
                    <td className="py-3 font-semibold text-muted-foreground font-mono">{ord.id.substring(0, 8)}</td>
                    <td className="py-3 font-bold text-foreground">
                      <div className="flex flex-col">
                        <span>{ord.fullName}</span>
                        <span className="text-[10px] text-muted-foreground font-medium">{ord.phone}</span>
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground">{dateStr}</td>
                    <td className="py-3 text-foreground/80 max-w-xs truncate" title={itemsSummary}>{itemsSummary}</td>
                    <td className="py-3 font-bold text-primary">{(ord.totalAmount || 0).toLocaleString()} ₫</td>
                    <td className="py-3">{getStatusBadge(ord.status)}</td>
                    <td className="py-3 text-right space-x-1.5">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        type="button"
                        onClick={() => onOpenDetail(ord)}
                        title="Xem chi tiết & Cập nhật vận chuyển"
                        disabled={isSubmitting}
                        className="cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      {ord.status === "PENDING" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            type="button"
                            onClick={() => onUpdateStatusQuick(ord.id, "PROCESSING")}
                            className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 cursor-pointer"
                            title="Phê duyệt đơn"
                            disabled={isSubmitting}
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            type="button"
                            onClick={() => onUpdateStatusQuick(ord.id, "CANCELLED")}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                            title="Hủy đơn hàng"
                            disabled={isSubmitting}
                          >
                            <Ban className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      )}
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
