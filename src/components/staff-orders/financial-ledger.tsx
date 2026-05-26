import React from "react";
import { CreditCard } from "lucide-react";

interface FinancialLedgerProps {
  subtotalAmount: number;
  discountAmount: number;
  shippingFee: number;
  paymentMethod: string;
  totalAmount: number;
}

export const FinancialLedger: React.FC<FinancialLedgerProps> = React.memo(({
  subtotalAmount,
  discountAmount,
  shippingFee,
  paymentMethod,
  totalAmount,
}) => {
  return (
    <div className="border border-border/70 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl p-4 space-y-3.5 shadow-xs">
      <h3 className="font-black text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/60 pb-1.5 flex items-center gap-1.5">
        <CreditCard className="h-3.5 w-3.5 text-amber-500" />
        Hóa đơn & Chi tiết thanh toán
      </h3>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between text-muted-foreground font-semibold">
          <span>Tiền sách tạm tính:</span>
          <span className="font-bold text-foreground font-mono">{(subtotalAmount || 0).toLocaleString()} ₫</span>
        </div>
        <div className="flex justify-between text-muted-foreground font-semibold font-sans">
          <span>Voucher giảm giá:</span>
          <span className="font-bold text-rose-500 font-mono">-{discountAmount ? discountAmount.toLocaleString() : 0} ₫</span>
        </div>
        <div className="flex justify-between text-muted-foreground font-semibold">
          <span>Cước vận chuyển phát nhanh:</span>
          <span className="font-bold text-foreground font-mono">+{shippingFee ? shippingFee.toLocaleString() : 0} ₫</span>
        </div>
        
        <div className="flex justify-between text-muted-foreground pt-2 border-t border-border/40 font-semibold items-center">
          <span>Phương thức thanh toán:</span>
          <span className={`font-black px-2 py-0.5 rounded text-[8px] tracking-widest font-sans uppercase border shadow-2xs ${
            paymentMethod === "VNPAY" 
              ? "bg-blue-500/10 border-blue-500/25 text-blue-600 dark:text-blue-400"
              : "bg-slate-500/10 border-slate-500/25 text-slate-650 dark:text-slate-400"
          }`}>
            {paymentMethod}
          </span>
        </div>
        
        <div className="flex justify-between items-center pt-2.5 border-t border-border/60 bg-primary/5 -mx-4 px-4 py-2 rounded-b-xl border-t-2 border-primary/20">
          <span className="font-black text-foreground text-xs">Tổng tiền thực thu bưu tá:</span>
          <span className="font-black text-primary text-base font-mono">{(totalAmount || 0).toLocaleString()} ₫</span>
        </div>
      </div>
    </div>
  );
});

FinancialLedger.displayName = "FinancialLedger";
