import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface VoucherDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isAddMode: boolean;
  formCode: string;
  setFormCode: (val: string) => void;
  formIsPercent: boolean;
  setFormIsPercent: (val: boolean) => void;
  formValue: number;
  setFormValue: (val: number) => void;
  formMinOrder: number;
  setFormMinOrder: (val: number) => void;
  formMaxDiscount: number;
  setFormMaxDiscount: (val: number) => void;
  formLimit: number;
  setFormLimit: (val: number) => void;
  formStart: string;
  setFormStart: (val: string) => void;
  formEnd: string;
  setFormEnd: (val: string) => void;
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
  formIsPercent,
  setFormIsPercent,
  formValue,
  setFormValue,
  formMinOrder,
  setFormMinOrder,
  formMaxDiscount,
  setFormMaxDiscount,
  formLimit,
  setFormLimit,
  formStart,
  setFormStart,
  formEnd,
  setFormEnd,
  formIsActive,
  setFormIsActive,
  onSave,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xs font-bold uppercase tracking-wider">
            {isAddMode ? "Khởi tạo mã giảm giá mới" : "Chỉnh sửa mã giảm giá"}
          </DialogTitle>
          <DialogDescription className="text-[11px]">
            Vui lòng khai báo các giới hạn, giá trị và ngày hiệu lực của voucher.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-muted-foreground">Mã giảm giá (Code)</label>
              <Input
                placeholder="E.g. WELCOME50"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                className="bg-card border-border uppercase font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-muted-foreground">Hình thức giảm</label>
              <select
                value={formIsPercent ? "percent" : "fixed"}
                onChange={(e) => setFormIsPercent(e.target.value === "percent")}
                className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                <option value="percent">Theo phần trăm (%)</option>
                <option value="fixed">Số tiền trực tiếp (₫)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-muted-foreground">Giá trị giảm</label>
              <Input
                type="number"
                value={formValue}
                onChange={(e) => setFormValue(Number(e.target.value))}
                className="bg-card border-border"
              />
            </div>

            <div className="space-y-1.5 col-span-2">
              <label className="font-bold text-muted-foreground">Đơn hàng tối thiểu (₫)</label>
              <Input
                type="number"
                value={formMinOrder}
                onChange={(e) => setFormMinOrder(Number(e.target.value))}
                className="bg-card border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-muted-foreground">Giảm tối đa (₫)</label>
              <Input
                type="number"
                value={formMaxDiscount}
                onChange={(e) => setFormMaxDiscount(Number(e.target.value))}
                disabled={!formIsPercent}
                className="bg-card border-border"
                placeholder={!formIsPercent ? "Không áp dụng" : "Giảm tối đa"}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-muted-foreground">Giới hạn số lần dùng</label>
              <Input
                type="number"
                value={formLimit}
                onChange={(e) => setFormLimit(Number(e.target.value))}
                className="bg-card border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-muted-foreground">Ngày bắt đầu</label>
              <Input
                type="date"
                value={formStart}
                onChange={(e) => setFormStart(e.target.value)}
                className="bg-card border-border"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-muted-foreground">Ngày kết thúc</label>
              <Input
                type="date"
                value={formEnd}
                onChange={(e) => setFormEnd(e.target.value)}
                className="bg-card border-border"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-muted-foreground">Kích hoạt ban đầu</label>
            <select
              value={formIsActive ? "active" : "inactive"}
              onChange={(e) => setFormIsActive(e.target.value === "active")}
              className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              <option value="active">Cho phép sử dụng ngay</option>
              <option value="inactive">Tạm ngưng hoạt động</option>
            </select>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Hủy bỏ
          </Button>
          <Button size="sm" onClick={onSave} className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs">
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
