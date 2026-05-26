import React from "react";
import { Package } from "lucide-react";
import type { Order } from "@/services/order-service";

interface OrderItemsListProps {
  items: Order["items"];
}

export const OrderItemsList: React.FC<OrderItemsListProps> = React.memo(({ items }) => {
  return (
    <div className="border border-border/70 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl p-4 space-y-3.5 shadow-xs">
      <h3 className="font-black text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/60 pb-1.5 flex items-center gap-1.5">
        <Package className="h-3.5 w-3.5 text-emerald-500" />
        Chi tiết sản phẩm bưu kiện ({items?.length || 0})
      </h3>

      <div className="overflow-y-auto max-h-[170px] pr-1 space-y-2.5 divide-y divide-border/40 scrollbar-thin">
        {items?.map((item) => (
          <div key={item.id} className="pt-2.5 first:pt-0 flex gap-3 text-xs items-center hover:bg-slate-100/30 dark:hover:bg-slate-800/10 p-1 rounded-lg transition-colors">
            {/* Book Cover Thumbnail */}
            <div className="w-8.5 h-12 bg-muted border border-border/80 rounded flex items-center justify-center text-muted-foreground shrink-0 overflow-hidden shadow-2xs">
              {item.book?.thumbnail ? (
                <img src={item.book.thumbnail} alt={item.bookTitle} className="w-full h-full object-cover transition-transform hover:scale-110 duration-300" />
              ) : (
                <Package className="h-4 w-4 opacity-40" />
              )}
            </div>

            {/* Title & metadata */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground text-[11px] leading-snug line-clamp-2 hover:text-primary transition-colors cursor-default">
                {item.bookTitle || item.book?.title || "Bản sách"}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5 text-[9px] text-muted-foreground font-semibold">
                <span>Đơn giá: {item.unitPrice ? item.unitPrice.toLocaleString() : (item.price || 0).toLocaleString()} ₫</span>
                <span className="text-border">•</span>
                <span>Số lượng: {item.quantity}</span>
              </div>
              {item.discountAmount > 0 && (
                <p className="text-[9px] text-rose-500 font-extrabold mt-0.5">Mã giảm giá: -{item.discountAmount.toLocaleString()} ₫</p>
              )}
            </div>

            {/* Price Line Item Total */}
            <div className="text-right shrink-0">
              <p className="font-black text-foreground text-[11px] font-mono">{(item.totalAmount || 0).toLocaleString()} ₫</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

OrderItemsList.displayName = "OrderItemsList";
