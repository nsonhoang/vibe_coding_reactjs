import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { FileText, Loader2 } from "lucide-react";
import type { Order } from "@/services/order-service";

import { StepTimeline } from "./step-timeline";
import { CustomerCard } from "./customer-card";
import { OperationsCard } from "./operations-card";
import { OrderItemsList } from "./order-items-list";
import { FinancialLedger } from "./financial-ledger";
import { GHNPanel } from "./ghn-panel";

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

export const OrderDialog: React.FC<OrderDialogProps> = React.memo(({
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
  // Safe computation of overall invoice totals
  const billingSummary = useMemo(() => {
    if (!selectedOrder) return { subtotal: 0, discount: 0, shipping: 0, total: 0 };
    return {
      subtotal: selectedOrder.subtotalAmount || 0,
      discount: selectedOrder.discountAmount || 0,
      shipping: selectedOrder.shippingFee || 0,
      total: selectedOrder.totalAmount ?? selectedOrder.totalPrice ?? 0
    };
  }, [selectedOrder]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open && !isSaving) onClose(); }}>
      {/* 
        Responsive Styling:
        - MOBILE: snaps directly as a high-end Bottom Sheet (bottom-0 w-full h-[85vh] rounded-t-2xl).
        - PC (Desktop): centers as a wide side-by-side grid layout (md:top-[50%] md:left-[50%] md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-6xl md:w-full md:h-auto md:max-h-[92vh] md:rounded-xl).
        - Layout: Flex column layout with header and footer shrink-0 anchors, leaving only the center scrollable.
      */}
      <DialogContent className="fixed bottom-0 top-auto left-0 right-0 translate-y-0 translate-x-0 md:top-[50%] md:left-[50%] md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-7xl md:w-[94vw] w-full h-[85vh] md:h-[88vh] md:max-h-[88vh] bg-card border-border text-foreground p-5 md:p-6 rounded-t-2xl md:rounded-xl shadow-2xl flex flex-col justify-between overflow-hidden transition-all duration-300">
        
        {/* Mobile-only drag-drawer indicator bar */}
        <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-3 md:hidden shrink-0" />

        {/* Modal Header (Static) */}
        <DialogHeader className="pb-3 border-b border-border/40 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div>
              <DialogTitle className="text-sm md:text-base font-black uppercase tracking-wider flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Đơn hàng #{selectedOrder?.code || selectedOrder?.id?.substring(0, 8)}
              </DialogTitle>
              <DialogDescription className="text-[11px] text-muted-foreground mt-0.5">
                Cập nhật lộ trình bưu tá đóng hàng và giao vận đối tác.
              </DialogDescription>
            </div>
            
            {/* Elegant Header Status Badge */}
            {selectedOrder && (
              <div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  selectedOrder.status === "COMPLETED" || selectedOrder.status === "DELIVERED"
                    ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400"
                    : selectedOrder.status === "SHIPPED"
                    ? "bg-blue-500/10 border-blue-500/25 text-blue-600 dark:text-blue-400"
                    : selectedOrder.status === "PROCESSING"
                    ? "bg-amber-500/10 border-amber-500/25 text-amber-600 dark:text-amber-400"
                    : selectedOrder.status === "CANCELLED"
                    ? "bg-rose-500/10 border-rose-500/25 text-rose-600 dark:text-rose-400"
                    : "bg-slate-500/10 border-slate-500/25 text-slate-650 dark:text-slate-400"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    selectedOrder.status === "COMPLETED" || selectedOrder.status === "DELIVERED"
                      ? "bg-emerald-500"
                      : selectedOrder.status === "SHIPPED"
                      ? "bg-blue-500"
                      : selectedOrder.status === "PROCESSING"
                      ? "bg-amber-500"
                      : selectedOrder.status === "CANCELLED"
                      ? "bg-rose-500"
                      : "bg-slate-500"
                  }`} />
                  {selectedOrder.status}
                </span>
              </div>
            )}
          </div>
        </DialogHeader>

        {/* Scrollable Main Content Area */}
        {selectedOrder && (
          <div className="flex-1 overflow-y-auto pr-1.5 space-y-4 py-3 my-2 scrollbar-thin">
            
            {/* Stepper Timeline or Cancellation Info Banner */}
            <StepTimeline status={selectedOrder.status} />

            {/* Symmetrical Two-Column Layout on PC, Single-Column on Mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* Left Column (7/12 width) - Customer Address details & Status action inputs form */}
              <div className="lg:col-span-7 space-y-4">
                <CustomerCard 
                  shippingName={selectedOrder.shippingName}
                  customerName={selectedOrder.customerName}
                  shippingPhone={selectedOrder.shippingPhone}
                  shippingAddress={selectedOrder.shippingAddress}
                  shippingWard={selectedOrder.shippingWard}
                  shippingDistrict={selectedOrder.shippingDistrict}
                  shippingCity={selectedOrder.shippingCity}
                  note={selectedOrder.note}
                />

                <OperationsCard 
                  formStatus={formStatus}
                  setFormStatus={setFormStatus}
                  formShipper={formShipper}
                  setFormShipper={setFormShipper}
                  formTracking={formTracking}
                  setFormTracking={setFormTracking}
                  isSaving={isSaving}
                />
              </div>

              {/* Right Column (5/12 width) - Ordered Items list & Detailed financial ledger */}
              <div className="lg:col-span-5 space-y-4">
                <OrderItemsList items={selectedOrder.items} />

                <FinancialLedger 
                  subtotalAmount={billingSummary.subtotal}
                  discountAmount={billingSummary.discount}
                  shippingFee={billingSummary.shipping}
                  paymentMethod={selectedOrder.paymentMethod}
                  totalAmount={billingSummary.total}
                />

                <GHNPanel shipment={selectedOrder.shipment} />
              </div>

            </div>
          </div>
        )}

        {/* Modal Footer (Static) */}
        <DialogFooter className="pt-2.5 border-t border-border/40 gap-2 shrink-0">
          <Button variant="outline" onClick={onClose} disabled={isSaving} className="text-[10px] font-black uppercase tracking-wider h-9 px-4 shadow-xs">
            Quay lại
          </Button>
          <Button onClick={onSave} disabled={isSaving} className="bg-primary hover:bg-primary/95 text-primary-foreground font-black text-[10px] uppercase tracking-wider gap-1.5 cursor-pointer h-9 px-5 shadow-sm">
            {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Cập nhật đơn hàng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

OrderDialog.displayName = "OrderDialog";
