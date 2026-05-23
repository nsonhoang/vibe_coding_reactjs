import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag } from "lucide-react";
import type { Order } from "@/services/order-service";

interface PendingOrdersProps {
  orders: Order[];
  onViewAll: () => void;
  onProcessOrder: (id: string) => void;
}

const statusMap: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  PENDING: { label: "Chờ xử lý", bg: "bg-amber-500/10 dark:bg-amber-500/5", text: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500" },
  CONFIRMED: { label: "Đã xác nhận", bg: "bg-blue-500/10 dark:bg-blue-500/5", text: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500" },
  PROCESSING: { label: "Đang xử lý", bg: "bg-cyan-500/10 dark:bg-cyan-500/5", text: "text-cyan-600 dark:text-cyan-400", dot: "bg-cyan-500" },
  SHIPPED: { label: "Đang vận chuyển", bg: "bg-indigo-500/10 dark:bg-indigo-500/5", text: "text-indigo-600 dark:text-indigo-400", dot: "bg-indigo-500" },
  DELIVERED: { label: "Đã giao hàng", bg: "bg-emerald-500/10 dark:bg-emerald-500/5", text: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
  CANCELLED: { label: "Đã hủy", bg: "bg-rose-500/10 dark:bg-rose-500/5", text: "text-rose-600 dark:text-rose-400", dot: "bg-rose-500" },
};

export const PendingOrders: React.FC<PendingOrdersProps> = ({
  orders,
  onViewAll,
  onProcessOrder,
}) => {
  return (
    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <CardTitle className="text-base font-bold text-slate-850 dark:text-white flex items-center gap-2">
            <ShoppingBag className="h-4.5 w-4.5 text-[#00288e]" />
            Đơn Hàng Mới Chờ Duyệt
          </CardTitle>
          <CardDescription className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Đơn hàng cần xác nhận, đóng gói và bàn giao đối tác vận chuyển hôm nay
          </CardDescription>
        </div>
        <Button 
          variant="ghost" 
          onClick={onViewAll} 
          className="text-xs font-bold text-[#00288e] hover:bg-slate-50 dark:hover:bg-slate-800 gap-1 cursor-pointer h-8 rounded-lg"
        >
          Xem tất cả
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Mã đơn</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Sách đặt mua</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Tổng tiền</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Thời gian đặt</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {orders.map((ord) => {
                const bookNames = ord.items
                  ?.map((it: any) => `${it.book?.title || "Sách"} (x${it.quantity})`)
                  .join(", ") || "Không rõ";

                const dateStr = ord.createdAt ? new Date(ord.createdAt).toLocaleString("vi-VN") : "Vừa xong";
                
                // Extract customer initials
                const initials = ord.customerName
                  ? ord.customerName.split(" ").slice(-2).map((n) => n[0]).join("").toUpperCase()
                  : "KH";

                // Get mapped status info
                const statusMeta = statusMap[ord.status] || {
                  label: ord.status,
                  bg: "bg-slate-100 dark:bg-slate-800",
                  text: "text-slate-600 dark:text-slate-400",
                  dot: "bg-slate-400",
                };

                return (
                  <tr key={ord.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-all duration-200 group">
                    <td className="px-6 py-4 font-bold text-[#00288e] dark:text-blue-400 font-mono text-xs">
                      #{ord.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 text-[#00288e] dark:text-blue-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0 border border-blue-500/20">
                          {initials}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-880 dark:text-slate-200">
                            {ord.customerName}
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono font-medium">
                            {ord.shippingPhone || "Không có SĐT"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-350 max-w-xs truncate text-xs font-medium" title={bookNames}>
                      {bookNames}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white font-mono text-xs">
                      {(ord.totalPrice || 0).toLocaleString()} ₫
                    </td>
                    <td className="px-6 py-4 text-slate-400 dark:text-slate-500 text-xs font-medium">
                      {dateStr}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-current/10 ${statusMeta.bg} ${statusMeta.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot} animate-pulse`}></span>
                        {statusMeta.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        size="xs"
                        onClick={() => onProcessOrder(ord.id)}
                        className="bg-[#00288e] hover:bg-[#00288e]/90 text-white font-bold text-[10px] h-7 px-3 rounded-lg shadow-sm shadow-[#00288e]/10 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-95"
                      >
                        Duyệt đơn
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 text-xs font-semibold">
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
