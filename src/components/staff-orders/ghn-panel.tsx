import React from "react";
import { Truck, Calendar } from "lucide-react";
import type { Order } from "@/services/order-service";

interface GHNPanelProps {
  shipment: Order["shipment"];
}

export const GHNPanel: React.FC<GHNPanelProps> = React.memo(({ shipment }) => {
  if (!shipment) return null;

  return (
    <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-4 space-y-3.5 shadow-xs">
      <h3 className="font-black text-[10px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 border-b border-emerald-500/20 pb-1.5 flex items-center gap-1.5">
        <Truck className="h-3.5 w-3.5 animate-bounce text-emerald-500" />
        Đồng bộ giao vận tự động (GHN API)
      </h3>
      
      <div className="grid grid-cols-2 gap-3.5 text-xs">
        <div className="space-y-0.5">
          <span className="text-[9px] text-muted-foreground font-black uppercase tracking-wider block">Mã vận đơn đối tác</span>
          <p className="font-mono font-bold text-foreground">{shipment.ghnOrderCode || "N/A"}</p>
        </div>
        <div className="space-y-0.5">
          <span className="text-[9px] text-muted-foreground font-black uppercase tracking-wider block">Gói cước vận chuyển</span>
          <p className="font-bold text-foreground">{shipment.shippingService || "GHN Tiêu chuẩn"}</p>
        </div>
        <div className="space-y-0.5">
          <span className="text-[9px] text-muted-foreground font-black uppercase tracking-wider block">Tiền thu hộ COD</span>
          <p className="font-mono font-bold text-foreground">{(shipment.codAmount || 0).toLocaleString()} ₫</p>
        </div>
        <div className="space-y-0.5">
          <span className="text-[9px] text-muted-foreground font-black uppercase tracking-wider block">Cước phí GHN thực tế</span>
          <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{(shipment.shippingFee || 0).toLocaleString()} ₫</p>
        </div>

        {shipment.expectedDelivery && (
          <div className="col-span-2 flex items-center gap-2 pt-2 border-t border-emerald-500/10">
            <Calendar className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <div className="space-y-0.5">
              <span className="text-[9px] text-muted-foreground font-black uppercase tracking-wider block">Dự kiến bưu tá phát hàng</span>
              <p className="font-bold text-foreground text-[11px]">
                {new Date(shipment.expectedDelivery).toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </p>
            </div>
          </div>
        )}

        {shipment.status && (
          <div className="col-span-2 pt-2 border-t border-emerald-500/10">
            <span className="text-[9px] text-muted-foreground font-black uppercase tracking-wider block">Trạng thái bưu cục thực tế</span>
            <span className="inline-flex bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-extrabold px-2.5 py-0.5 rounded text-[8px] tracking-wider mt-1 uppercase border border-emerald-500/30">
              {shipment.status}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

GHNPanel.displayName = "GHNPanel";
