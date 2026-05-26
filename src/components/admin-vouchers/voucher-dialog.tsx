import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { formatVNDInput, parseVNDInput } from "@/lib/utils";

interface VoucherDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isAddMode: boolean;
  formCode: string;
  setFormCode: (val: string) => void;
  formDescription: string;
  setFormDescription: (val: string) => void;
  formDiscountType: "PERCENTAGE" | "FIXED_AMOUNT";
  setFormDiscountType: (val: "PERCENTAGE" | "FIXED_AMOUNT") => void;
  formDiscountValue: number;
  setFormDiscountValue: (val: number) => void;
  formMinOrderValue: number;
  setFormMinOrderValue: (val: number) => void;
  formMaxDiscount: number;
  setFormMaxDiscount: (val: number) => void;
  formUsageLimit: number;
  setFormUsageLimit: (val: number) => void;
  formStartDate: string;
  setFormStartDate: (val: string) => void;
  formEndDate: string;
  setFormEndDate: (val: string) => void;
  formIsActive: boolean;
  setFormIsActive: (val: boolean) => void;
  onSave: () => void;
}

export const VoucherDialog: React.FC<VoucherDialogProps> = ({
  isOpen,
  onClose,
  isAddMode,
  formCode,
  setFormCode,
  formDescription,
  setFormDescription,
  formDiscountType,
  setFormDiscountType,
  formDiscountValue,
  setFormDiscountValue,
  formMinOrderValue,
  setFormMinOrderValue,
  formMaxDiscount,
  setFormMaxDiscount,
  formUsageLimit,
  setFormUsageLimit,
  formStartDate,
  setFormStartDate,
  formEndDate,
  setFormEndDate,
  formIsActive,
  setFormIsActive,
  onSave,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white rounded-2xl p-6 shadow-xl">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-base font-black text-slate-850 dark:text-white uppercase tracking-tight">
            {isAddMode ? "Tạo Voucher Giảm Giá Mới" : "Chỉnh Sửa Mã Giảm Giá"}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400 dark:text-slate-500 font-semibold leading-relaxed">
            Thiết lập các giới hạn, giá trị giảm giá và ngày hiệu lực áp dụng thực tế trên website.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3 text-xs font-semibold">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-400 dark:text-slate-500">Mã giảm giá (Code)</label>
              <Input
                placeholder="E.g. SUMMER50"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                disabled={!isAddMode}
                className="bg-card border-slate-200 dark:border-slate-850 uppercase font-mono text-xs font-bold focus:ring-1 focus:ring-[#00288e] rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 dark:text-slate-500">Hình thức giảm</label>
              <select
                value={formDiscountType}
                onChange={(e) => setFormDiscountType(e.target.value as "PERCENTAGE" | "FIXED_AMOUNT")}
                disabled={!isAddMode}
                className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 px-3 text-xs text-slate-800 dark:text-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00288e] font-semibold"
              >
                <option value="PERCENTAGE">Theo phần trăm (%)</option>
                <option value="FIXED_AMOUNT">Số tiền trực tiếp (₫)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400 dark:text-slate-500">Mô tả chương trình</label>
            <Input
              placeholder="E.g. Giảm giá 10% tối đa 30k cho đơn hàng hè..."
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="bg-card border-slate-200 dark:border-slate-850 text-xs focus:ring-1 focus:ring-[#00288e] rounded-lg"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-400 dark:text-slate-500">Giá trị giảm</label>
              <div className="relative">
                <Input
                  type={formDiscountType === "PERCENTAGE" ? "number" : "text"}
                  value={formDiscountType === "PERCENTAGE" ? formDiscountValue : formatVNDInput(formDiscountValue)}
                  onChange={(e) => setFormDiscountValue(formDiscountType === "PERCENTAGE" ? Number(e.target.value) : parseVNDInput(e.target.value))}
                  disabled={!isAddMode}
                  className="bg-card border-slate-200 dark:border-slate-850 text-xs focus:ring-1 focus:ring-[#00288e] rounded-lg font-mono font-bold pr-8"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-slate-450 pointer-events-none select-none">
                  {formDiscountType === "PERCENTAGE" ? "%" : "₫"}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 col-span-2">
              <label className="text-slate-400 dark:text-slate-500">Đơn hàng tối thiểu (VND)</label>
              <div className="relative">
                <Input
                  type="text"
                  value={formatVNDInput(formMinOrderValue)}
                  onChange={(e) => setFormMinOrderValue(parseVNDInput(e.target.value))}
                  className="bg-card border-slate-200 dark:border-slate-850 text-xs focus:ring-1 focus:ring-[#00288e] rounded-lg font-mono font-bold pr-8"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-slate-450 pointer-events-none select-none">
                  ₫
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-400 dark:text-slate-500">Giảm tối đa (VND)</label>
              <div className="relative">
                <Input
                  type={formDiscountType === "PERCENTAGE" ? "text" : "text"}
                  value={formDiscountType !== "PERCENTAGE" ? "" : formatVNDInput(formMaxDiscount)}
                  onChange={(e) => setFormMaxDiscount(parseVNDInput(e.target.value))}
                  disabled={formDiscountType !== "PERCENTAGE"}
                  className="bg-card border-slate-200 dark:border-slate-850 text-xs focus:ring-1 focus:ring-[#00288e] rounded-lg font-mono font-bold pr-8"
                  placeholder={formDiscountType !== "PERCENTAGE" ? "Không áp dụng" : "Mức tối đa"}
                />
                {formDiscountType === "PERCENTAGE" && (
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-slate-450 pointer-events-none select-none">
                    ₫
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 dark:text-slate-500">Giới hạn lượt dùng</label>
              <Input
                type="number"
                value={formUsageLimit}
                onChange={(e) => setFormUsageLimit(Number(e.target.value))}
                className="bg-card border-slate-200 dark:border-slate-850 text-xs focus:ring-1 focus:ring-[#00288e] rounded-lg font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-400 dark:text-slate-500">Ngày bắt đầu</label>
              <Input
                type="date"
                value={formStartDate}
                onChange={(e) => setFormStartDate(e.target.value)}
                className="bg-card border-slate-200 dark:border-slate-850 text-xs focus:ring-1 focus:ring-[#00288e] rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 dark:text-slate-500">Ngày kết thúc</label>
              <Input
                type="date"
                value={formEndDate}
                onChange={(e) => setFormEndDate(e.target.value)}
                className="bg-card border-slate-200 dark:border-slate-850 text-xs focus:ring-1 focus:ring-[#00288e] rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400 dark:text-slate-500">Trạng thái phát hành</label>
            <select
              value={formIsActive ? "active" : "inactive"}
              onChange={(e) => setFormIsActive(e.target.value === "active")}
              className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 px-3 text-xs text-slate-800 dark:text-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00288e] font-semibold"
            >
              <option value="active font-bold">Kích hoạt phát hành ngay</option>
              <option value="inactive font-bold">Tạm ngưng hoạt động</option>
            </select>
          </div>
        </div>

        <DialogFooter className="mt-6 gap-2">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs font-bold rounded-lg border-slate-200 dark:border-slate-800 h-9 cursor-pointer">
            Hủy bỏ
          </Button>
          <Button 
            size="sm" 
            onClick={onSave} 
            className="bg-[#00288e] hover:bg-[#00288e]/95 text-white font-bold text-xs rounded-lg px-4 h-9 shadow-md shadow-[#00288e]/10 cursor-pointer"
          >
            {isAddMode ? "Tạo Voucher" : "Lưu Thay Đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
