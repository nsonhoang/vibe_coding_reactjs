import React, { useState } from "react";
import { AlertCircle, User, Phone, MapPin, Copy, Check } from "lucide-react";

interface CustomerCardProps {
  shippingName?: string;
  customerName?: string;
  shippingPhone?: string;
  shippingAddress?: string;
  shippingWard?: string;
  shippingDistrict?: string;
  shippingCity?: string;
  note?: string;
}

export const CustomerCard: React.FC<CustomerCardProps> = React.memo(({
  shippingName,
  customerName,
  shippingPhone,
  shippingAddress,
  shippingWard,
  shippingDistrict,
  shippingCity,
  note,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = () => {
    if (!shippingPhone) return;
    navigator.clipboard.writeText(shippingPhone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-border/70 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl p-4 space-y-3.5 shadow-xs">
      <h3 className="font-black text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/60 pb-1.5 flex items-center gap-1.5">
        <User className="h-3.5 w-3.5 text-primary" />
        Thông tin người nhận bưu kiện
      </h3>
      
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="space-y-0.5">
          <span className="text-[9px] text-muted-foreground font-black uppercase tracking-wider block">Người nhận</span>
          <p className="font-bold text-foreground">{shippingName || customerName || "N/A"}</p>
        </div>
        <div className="space-y-0.5">
          <span className="text-[9px] text-muted-foreground font-black uppercase tracking-wider block">Số điện thoại</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <p className="font-mono text-foreground font-bold tracking-wide">{shippingPhone || "N/A"}</p>
            {shippingPhone && (
              <button 
                onClick={handleCopyPhone}
                type="button"
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent hover:border-border/50 transition-all cursor-pointer"
                title="Sao chép số điện thoại"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-0.5">
        <span className="text-[9px] text-muted-foreground font-black uppercase tracking-wider block">Địa chỉ chi tiết phát hàng</span>
        <div className="flex gap-1.5 items-start mt-0.5">
          <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
          <p className="text-foreground/90 text-xs leading-relaxed font-semibold">
            {shippingAddress || "Chưa cập nhật địa chỉ"}
            {shippingWard && `, ${shippingWard}`}
            {shippingDistrict && `, ${shippingDistrict}`}
            {shippingCity && `, ${shippingCity}`}
          </p>
        </div>
      </div>

      {note && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-400 rounded-lg p-2.5 flex items-start gap-1.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-500 mt-0.5" />
          <div className="flex-1">
            <span className="text-[9px] font-black uppercase tracking-wider block">Bác tài chú ý:</span>
            <p className="mt-0.5 text-xs font-bold leading-relaxed">{note}</p>
          </div>
        </div>
      )}
    </div>
  );
});

CustomerCard.displayName = "CustomerCard";
