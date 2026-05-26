import React from "react";
import { ClipboardList } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Order } from "@/services/order-service";

interface OperationsCardProps {
  formStatus: Order["status"];
  setFormStatus: (status: Order["status"]) => void;
  formShipper: string;
  setFormShipper: (shipper: string) => void;
  formTracking: string;
  setFormTracking: (tracking: string) => void;
  isSaving: boolean;
}

export const OperationsCard: React.FC<OperationsCardProps> = React.memo(({
  formStatus,
  setFormStatus,
  formShipper,
  setFormShipper,
  formTracking,
  setFormTracking,
  isSaving,
}) => {
  return (
    <div className="border border-border/70 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl p-4 space-y-3.5 shadow-xs">
      <h3 className="font-black text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/60 pb-1.5 flex items-center gap-1.5">
        <ClipboardList className="h-3.5 w-3.5 text-indigo-500" />
        Xử lý trạng thái & Giao vận đối tác
      </h3>
      
      <div className="grid grid-cols-2 gap-3.5">
        <div className="space-y-1">
          <label className="font-black text-muted-foreground text-[9px] uppercase tracking-wider block">Tiến trình xử lý</label>
          <select
            value={formStatus}
            onChange={(e) => setFormStatus(e.target.value as Order["status"])}
            className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary h-9 font-bold shadow-xs cursor-pointer focus:border-primary transition-colors"
            disabled={isSaving}
          >
            <option value="PENDING">PENDING (Chờ duyệt)</option>
            <option value="PROCESSING">PROCESSING (Đóng gói)</option>
            <option value="SHIPPED">SHIPPED (Vận chuyển)</option>
            <option value="COMPLETED">COMPLETED (Giao xong)</option>
            <option value="CANCELLED">CANCELLED (Hủy đơn)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="font-black text-muted-foreground text-[9px] uppercase tracking-wider block">Nhà xe / Bưu cục đối tác</label>
          <select
            value={formShipper}
            onChange={(e) => setFormShipper(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary h-9 font-bold shadow-xs cursor-pointer focus:border-primary transition-colors"
            disabled={isSaving || formStatus === "PENDING" || formStatus === "CANCELLED"}
          >
            <option value="GHN">Giao Hàng Nhanh (GHN)</option>
            <option value="GHTK">Giao Hàng Tiết Kiệm (GHTK)</option>
            <option value="ViettelPost">Viettel Post</option>
            <option value="J&T">J&T Express</option>
          </select>
        </div>
      </div>

      {formStatus !== "PENDING" && formStatus !== "CANCELLED" && (
        <div className="space-y-1 pt-0.5">
          <label className="font-black text-muted-foreground text-[9px] uppercase tracking-wider block">Mã vận đơn bưu cục cung cấp</label>
          <Input
            placeholder="Nhập mã vận đơn bưu tá..."
            value={formTracking}
            onChange={(e) => setFormTracking(e.target.value)}
            className="bg-card border-border font-mono h-9 text-xs font-bold shadow-xs focus:ring-1 focus:ring-primary"
            disabled={isSaving}
          />
        </div>
      )}
    </div>
  );
});

OperationsCard.displayName = "OperationsCard";
