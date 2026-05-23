import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { FileText, Loader2 } from "lucide-react";
import type { Order } from "@/services/order-service";

interface OrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrder: Order | null;
  formStatus: Order["status"];
  setFormStatus: (status: Order["status"]) => void;
  formShipper: string;
  setFormShipper: (shipper: string) => void;
  formTracking: string;
  setFormTracking: (tracking: string) => void;
  onSave: () => void;
  isSaving: boolean;
}

export const OrderDialog: React.FC<OrderDialogProps> = ({
  isOpen,
  onClose,
  selectedOrder,
  formStatus,
  setFormStatus,
  formShipper,
  setFormShipper,
  formTracking,
  setFormTracking,
  onSave,
  isSaving,
}) => {
  const itemsSummary = selectedOrder?.items
    ?.map((it: any) => `${it.book?.title || "Sách"} (x${it.quantity})`)
    .join(", ") || "Không rõ";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open && !isSaving) onClose(); }}>
      <DialogContent className="max-w-lg bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <FileText className="h-4.5 w-4.5 text-primary" />
            Chi tiết vận đơn #{selectedOrder?.id?.substring(0, 8)}
          </DialogTitle>
          <DialogDescription className="text-[11px]">
            Xem hồ sơ giao nhận và cập nhật tiến trình bưu tá chuyển hàng.
          </DialogDescription>
        </DialogHeader>

        {selectedOrder && (
          <div className="space-y-4 py-2 text-xs">
            {/* Customer details info card */}
            <div className="border border-border/80 bg-accent/10 rounded-lg p-3 space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-muted-foreground font-bold">Người nhận hàng:</span>
                  <p className="font-bold text-foreground mt-0.5">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground font-bold">Số điện thoại:</span>
                  <p className="font-mono text-foreground mt-0.5">{selectedOrder.shippingPhone}</p>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-bold">Địa chỉ giao hàng:</span>
                <p className="text-foreground/80 mt-0.5 leading-relaxed">{selectedOrder.shippingAddress}</p>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-bold">Sản phẩm đặt mua:</span>
                <p className="text-primary font-bold mt-0.5">{itemsSummary}</p>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-bold">Tổng thanh toán:</span>
                <p className="text-foreground font-extrabold text-[13px] mt-0.5">{(selectedOrder.totalPrice || 0).toLocaleString()} ₫</p>
              </div>
            </div>

            {/* Status and Logistics Form */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Trạng thái xử lý bưu kiện</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as Order["status"])}
                  className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary h-[34px]"
                  disabled={isSaving}
                >
                  <option value="PENDING">PENDING (Đang chờ duyệt)</option>
                  <option value="PROCESSING">PROCESSING (Đã đóng gói / Chờ giao)</option>
                  <option value="SHIPPED">SHIPPED (Đang bàn giao shipper)</option>
                  <option value="COMPLETED">COMPLETED (Giao hàng thành công)</option>
                  <option value="CANCELLED">CANCELLED (Hủy đơn hàng)</option>
                </select>
              </div>

              {/* Show logistics only if processing or shipping */}
              {formStatus !== "PENDING" && formStatus !== "CANCELLED" && (
                <div className="grid grid-cols-2 gap-4 border-t border-border/40 pt-3">
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">Đối tác giao nhận</label>
                    <select
                      value={formShipper}
                      onChange={(e) => setFormShipper(e.target.value)}
                      className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary h-[34px]"
                      disabled={isSaving}
                    >
                      <option value="Giao Hàng Tiết Kiệm (GHTK)">Giao Hàng Tiết Kiệm (GHTK)</option>
                      <option value="Giao Hàng Nhanh (GHN)">Giao Hàng Nhanh (GHN)</option>
                      <option value="Viettel Post">Viettel Post</option>
                      <option value="J&T Express">J&T Express</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">Mã vận đơn bưu tá</label>
                    <Input
                      placeholder="E.g. GHTK-89230489"
                      value={formTracking}
                      onChange={(e) => setFormTracking(e.target.value)}
                      className="bg-card border-border font-mono h-[34px]"
                      disabled={isSaving}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSaving} className="text-xs">
            Quay lại
          </Button>
          <Button size="sm" onClick={onSave} disabled={isSaving} className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs gap-1.5 cursor-pointer">
            {isSaving && <Loader2 className="h-3 w-3 animate-spin" />}
            Cập nhật đơn hàng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
