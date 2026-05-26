import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, Ban, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import type { Order } from "@/services/order-service";

interface OrdersTableProps {
  orders: Order[];
  onOpenDetail: (ord: Order) => void;
  onUpdateStatusQuick: (id: string, newStatus: Order["status"]) => void;
  isSubmitting: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onOpenDetail,
  onUpdateStatusQuick,
  isSubmitting,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}) => {
  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            CHỜ DUYỆT
          </span>
        );
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            ĐANG XỬ LÝ
          </span>
        );
      case "SHIPPED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            ĐANG GIAO
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            HOÀN THÀNH
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold bg-red-500/10 text-red-650 dark:text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            ĐÃ HỦY
          </span>
        );
    }
  };

  return (
    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/80">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-850 dark:text-slate-100 flex items-center gap-2">
          <FileText className="h-4.5 w-4.5 text-primary" />
          Danh sách Đơn hàng
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
                  ?.map((it) => `${it.bookTitle || it.book?.title || "Sách"} (x${it.quantity})`)
                  .join(", ") || "Không rõ";

                const dateStr = ord.createdAt
                  ? new Date(ord.createdAt).toLocaleString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "Không rõ";

                return (
                  <tr
                    key={ord.id}
                    onClick={() => onOpenDetail(ord)}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4 font-bold text-slate-550 dark:text-slate-450 font-mono text-xs">
                      #{ord.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                          {(ord.shippingName || ord.customerName || "KA").substring(0, 2)}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs">{ord.shippingName || ord.customerName}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono font-bold">{ord.shippingPhone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-semibold">
                      {dateStr}
                    </td>
                    <td className="px-6 py-4 text-slate-650 dark:text-slate-350 max-w-xs truncate text-xs font-medium" title={itemsSummary}>
                      {itemsSummary}
                    </td>
                    <td className="px-6 py-4 font-black text-xs text-primary dark:text-primary-fixed-dim">
                      {(ord.totalAmount ?? ord.totalPrice ?? 0).toLocaleString()} ₫
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(ord.status)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-1.5" onClick={(e) => e.stopPropagation()}>
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
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 text-xs font-bold">
                    Không tìm thấy đơn hàng nào khớp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls inside the card */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Đang hiển thị <span className="font-extrabold text-slate-700 dark:text-slate-350">{Math.min((currentPage - 1) * 10 + 1, totalItems)}</span>
              {" - "}
              <span className="font-extrabold text-slate-700 dark:text-slate-350">{Math.min(currentPage * 10, totalItems)}</span> trong tổng số{" "}
              <span className="font-extrabold text-primary dark:text-primary-fixed-dim">{totalItems}</span> đơn hàng
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-1.5 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => onPageChange(pg)}
                  className={`w-7.5 h-7.5 rounded text-xs font-extrabold transition-all cursor-pointer ${
                    currentPage === pg
                      ? "bg-primary text-white shadow-sm shadow-primary/20"
                      : "border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {pg}
                </button>
              ))}

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="p-1.5 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
