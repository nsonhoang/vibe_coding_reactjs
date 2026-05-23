import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, MapPin, Truck } from "lucide-react";
import type { Shipment } from "@/services/shipment-service";

interface ShipmentsTableProps {
  shipments: Shipment[];
}

export const ShipmentsTable: React.FC<ShipmentsTableProps> = ({ shipments }) => {
  return (
    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/80">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-850 dark:text-slate-100 flex items-center gap-2">
          <Truck className="h-4.5 w-4.5 text-primary" />
          Định tuyến bưu kiện
        </CardTitle>
        <CardDescription className="text-[11px] text-slate-500 mt-1">
          Chi tiết hành trình định vị đơn hàng liên kết các đối tác vận tải
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Mã vận đơn</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Đơn hàng</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Người nhận</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Đối tác chuyển phát</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Mã định vị</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Điểm đến</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Ngày nhận dự kiến</th>
                <th className="px-6 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {shipments.map((shp) => {
                const estDateStr = shp.estDate ? new Date(shp.estDate).toLocaleDateString("vi-VN") : "Đang tính toán";
                return (
                  <tr key={shp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 font-mono text-xs">
                      #{shp.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200 font-mono text-xs">
                      #{shp.order?.code || shp.orderId.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-slate-800 dark:text-slate-200">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold">{shp.order?.customerName || "Khách ẩn"}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-medium">{shp.order?.shippingPhone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-350 text-xs">
                      {shp.courier}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-primary dark:text-primary-fixed-dim">
                      {shp.trackingCode}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                      <div className="flex items-center gap-1.5 max-w-[150px] truncate" title={shp.destination}>
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        <span>{shp.destination}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                      {estDateStr}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold">
                      {shp.status === "DELIVERED" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle className="h-3 w-3" />
                          Đã giao
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          <Clock className="h-3 w-3" />
                          Trung chuyển
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {shipments.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400 text-xs font-medium">
                    Chưa có lô hàng giao nhận nào đang hoạt động.
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
