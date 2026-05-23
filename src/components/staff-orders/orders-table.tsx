import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, Ban, FileText } from "lucide-react";
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
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Chờ duyệt
          </span>
        );
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Đang xử lý
          </span>
        );
      case "SHIPPED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Đang giao
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Hoàn thành
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-red-500/10 text-red-600 dark:text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            Đã hủy
          </span>
        );
    }
  };

  return (
    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/80">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-850 dark:text-slate-100 flex items-center gap-2">
          <FileText className="h-4.5 w-4.5 text-primary" />
          Quản lý Đơn hàng
        </CardTitle>
        <CardDescription className="text-[11px] text-slate-500 mt-1">
          Duyệt đơn, in phiếu xuất kho và gán mã vận đơn để kích hoạt lộ trình giao nhận
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Mã đơn</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Thời gian đặt</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Sách mua</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Tổng thanh toán</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {orders.map((ord) => {
                const itemsSummary = ord.items
                  ?.map((it: any) => `${it.book?.title || "Sách"} (x${it.quantity})`)
                  .join(", ") || "Không rõ";

                const dateStr = ord.createdAt ? new Date(ord.createdAt).toLocaleString("vi-VN") : "Không rõ";

                return (
                  <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 font-mono text-xs">
                      #{ord.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs">{ord.customerName}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-medium">{ord.shippingPhone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                      {dateStr}
                    </td>
                    <td className="px-6 py-4 text-slate-650 dark:text-slate-350 max-w-xs truncate text-xs" title={itemsSummary}>
                      {itemsSummary}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-xs text-primary dark:text-primary-fixed-dim">
                      {(ord.totalPrice || 0).toLocaleString()} ₫
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(ord.status)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-1.5">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        type="button"
                        onClick={() => onOpenDetail(ord)}
                        title="Xem chi tiết & Cập nhật vận chuyển"
                        disabled={isSubmitting}
                        className="text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/10 cursor-pointer h-7 w-7 rounded-lg"
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
                            className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 cursor-pointer h-7 w-7 rounded-lg"
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
                            className="text-red-500 hover:text-red-650 hover:bg-red-500/10 cursor-pointer h-7 w-7 rounded-lg"
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
