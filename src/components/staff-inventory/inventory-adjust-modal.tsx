import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import type { InventoryItem } from "@/services/inventory-service";

interface InventoryAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: InventoryItem[];
  onSubmit: (data: { inventoryId: string; change: number; type: "IMPORT" | "EXPORT" | "ADJUST"; reason: string }) => void;
  isSubmitting: boolean;
}

export const InventoryAdjustModal: React.FC<InventoryAdjustModalProps> = ({
  isOpen,
  onClose,
  items,
  onSubmit,
  isSubmitting,
}) => {
  const [selectedInventoryId, setSelectedInventoryId] = useState("");
  const [adjustType, setAdjustType] = useState<"IMPORT" | "EXPORT" | "ADJUST">("IMPORT");
  const [qty, setQty] = useState<number>(10);
  const [reasonCategory, setReasonCategory] = useState("RESTOCK");
  const [customReason, setCustomReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInventoryId || qty <= 0) return;

    // Map reason
    let finalReason = "";
    switch (reasonCategory) {
      case "RESTOCK":
        finalReason = "Nhập thêm hàng mới";
        break;
      case "RETURN":
        finalReason = "Khách trả hàng";
        break;
      case "DAMAGE":
        finalReason = "Hàng hư hỏng / Lỗi";
        break;
      case "LOST":
        finalReason = "Thất thoát không rõ nguyên nhân";
        break;
      case "GIFT":
        finalReason = "Tặng / Biếu";
        break;
      default:
        finalReason = customReason || "Điều chỉnh khác";
    }

    if (customReason) {
      finalReason += ` (${customReason})`;
    }

    onSubmit({
      inventoryId: selectedInventoryId,
      change: qty,
      type: adjustType,
      reason: finalReason,
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/20">
          <div>
            <h3 className="text-sm font-black text-slate-850 dark:text-slate-100 uppercase tracking-wider">
              Điều chỉnh tồn kho thực tế
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              Ghi nhận giao dịch thay đổi kho, cập nhật số lượng lập tức
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-1.5">
              Chọn sách cần điều chỉnh *
            </label>
            <select
              value={selectedInventoryId}
              onChange={(e) => setSelectedInventoryId(e.target.value)}
              required
              className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent font-semibold"
            >
              <option value="">-- Chọn sách trong kho --</option>
              {items.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.book?.title} (Tồn hiện tại: {it.stock})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-1.5">
                Loại điều chỉnh *
              </label>
              <select
                value={adjustType}
                onChange={(e) => setAdjustType(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent font-semibold"
              >
                <option value="IMPORT">Nhập kho (Thêm sách)</option>
                <option value="EXPORT">Xuất kho (Bán / Giảm sách)</option>
                <option value="ADJUST">Kiểm kê / Cân đối</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-1.5">
                Số lượng *
              </label>
              <input
                type="number"
                min="1"
                required
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                placeholder="10"
                className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-1.5">
              Lý do điều chỉnh *
            </label>
            <select
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent font-semibold"
            >
              <option value="RESTOCK">Nhập thêm hàng mới từ NXB</option>
              <option value="RETURN">Khách trả hàng / Hoàn trả</option>
              <option value="DAMAGE">Hàng hư hỏng / Bị lỗi sản xuất</option>
              <option value="LOST">Thất thoát không rõ nguyên nhân</option>
              <option value="GIFT">Tặng / Biếu / Tặng phẩm</option>
              <option value="OTHER">Lý do khác...</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-1.5">
              Ghi chú chi tiết
            </label>
            <textarea
              rows={3}
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Nhập chi tiết về đợt điều chỉnh này (ví dụ: Số sê-ri hóa đơn, tên nhà cung cấp...)"
              className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-350 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedInventoryId}
              className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/10 disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang ghi nhận...
                </>
              ) : (
                "Xác nhận thay đổi"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
