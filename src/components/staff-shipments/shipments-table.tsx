import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, MapPin } from "lucide-react";
import type { Shipment } from "@/services/shipment-service";

interface ShipmentsTableProps {
  shipments: Shipment[];
}

export const ShipmentsTable: React.FC<ShipmentsTableProps> = ({ shipments }) => {
  return (
    <Card className="border-border bg-card/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xs font-bold uppercase tracking-wider">Định tuyến bưu kiện</CardTitle>
        <CardDescription className="text-[11px]">Chi tiết hành trình định vị đơn hàng liên kết các đối tác vận tải</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 text-muted-foreground pb-2 font-semibold">
                <th className="py-2.5">Mã vận đơn</th>
                <th className="py-2.5">Đơn hàng</th>
                <th className="py-2.5">Người nhận</th>
                <th className="py-2.5">Đối tác chuyển phát</th>
                <th className="py-2.5">Mã định vị</th>
                <th className="py-2.5">Điểm đến</th>
                <th className="py-2.5">Ngày nhận dự kiến</th>
                <th className="py-2.5 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {shipments.map((shp) => {
                const estDateStr = shp.estDate ? new Date(shp.estDate).toLocaleDateString("vi-VN") : "Đang tính toán";
                return (
                  <tr key={shp.id} className="hover:bg-accent/40 transition-colors">
                    <td className="py-3 font-semibold text-muted-foreground font-mono">{shp.id.substring(0, 8)}</td>
                    <td className="py-3 font-bold text-foreground font-mono">#{shp.order?.code || shp.orderId.substring(0, 8)}</td>
                    <td className="py-3 text-foreground/80">
                      <div className="flex flex-col">
                        <span>{shp.order?.customerName || "Khách ẩn"}</span>
                        <span className="text-[9px] text-muted-foreground font-mono">{shp.order?.shippingPhone}</span>
                      </div>
                    </td>
                    <td className="py-3 font-medium text-foreground/80">{shp.courier}</td>
                    <td className="py-3 font-mono text-[10px] text-primary">{shp.trackingCode}</td>
                    <td className="py-3 text-muted-foreground">
                      <div className="flex items-center gap-1 max-w-[150px] truncate" title={shp.destination}>
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                        <span>{shp.destination}</span>
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground">{estDateStr}</td>
                    <td className="py-3 text-right font-semibold">
                      {shp.status === "DELIVERED" ? (
                        <Badge className="bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-500/20 text-[9px] uppercase tracking-wide gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Đã giao
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-500/20 text-[9px] uppercase tracking-wide gap-1">
                          <Clock className="h-3 w-3" />
                          Trung chuyển
                        </Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
              {shipments.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground">
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
