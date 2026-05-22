import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle } from "lucide-react";
import { VouchersGrid } from "@/components/admin-vouchers/vouchers-grid";
import type { Voucher } from "@/components/admin-vouchers/vouchers-grid";
import { VoucherDialog } from "@/components/admin-vouchers/voucher-dialog";

const mockVouchers: Voucher[] = [
  {
    id: "VCH-001",
    code: "WELCOME10",
    isPercent: true,
    value: 10,
    minOrderValue: 100000,
    maxDiscountValue: 30000,
    usageLimit: 500,
    usedCount: 142,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    isActive: true,
  },
  {
    id: "VCH-002",
    code: "BOOKLOVER50",
    isPercent: false,
    value: 50000,
    minOrderValue: 300000,
    maxDiscountValue: 50000,
    usageLimit: 200,
    usedCount: 89,
    startDate: "2026-05-01",
    endDate: "2026-06-30",
    isActive: true,
  },
  {
    id: "VCH-003",
    code: "FREESHIPMAX",
    isPercent: false,
    value: 20000,
    minOrderValue: 150000,
    maxDiscountValue: 20000,
    usageLimit: 1000,
    usedCount: 450,
    startDate: "2026-02-01",
    endDate: "2026-08-31",
    isActive: true,
  },
  {
    id: "VCH-004",
    code: "CLEARENDYEAR",
    isPercent: true,
    value: 30,
    minOrderValue: 500000,
    maxDiscountValue: 150000,
    usageLimit: 100,
    usedCount: 100,
    startDate: "2026-11-01",
    endDate: "2026-12-31",
    isActive: false,
  },
];

export const AdminVouchers: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>(mockVouchers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);

  // Form states
  const [formCode, setFormCode] = useState("");
  const [formIsPercent, setFormIsPercent] = useState(true);
  const [formValue, setFormValue] = useState(10);
  const [formMinOrder, setFormMinOrder] = useState(0);
  const [formMaxDiscount, setFormMaxDiscount] = useState(0);
  const [formLimit, setFormLimit] = useState(100);
  const [formStart, setFormStart] = useState("");
  const [formEnd, setFormEnd] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);

  const handleOpenAdd = () => {
    setIsAddMode(true);
    setFormCode("");
    setFormIsPercent(true);
    setFormValue(10);
    setFormMinOrder(100000);
    setFormMaxDiscount(30000);
    setFormLimit(200);
    setFormStart(new Date().toISOString().split("T")[0]);
    setFormEnd(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
    setFormIsActive(true);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (v: Voucher) => {
    setIsAddMode(false);
    setEditingVoucher(v);
    setFormCode(v.code);
    setFormIsPercent(v.isPercent);
    setFormValue(v.value);
    setFormMinOrder(v.minOrderValue);
    setFormMaxDiscount(v.maxDiscountValue);
    setFormLimit(v.usageLimit);
    setFormStart(v.startDate);
    setFormEnd(v.endDate);
    setFormIsActive(v.isActive);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formCode || formValue <= 0) return;

    if (isAddMode) {
      const newV: Voucher = {
        id: `VCH-00${vouchers.length + 1}`,
        code: formCode.toUpperCase().replace(/\s+/g, ""),
        isPercent: formIsPercent,
        value: Number(formValue),
        minOrderValue: Number(formMinOrder),
        maxDiscountValue: Number(formMaxDiscount),
        usageLimit: Number(formLimit),
        usedCount: 0,
        startDate: formStart,
        endDate: formEnd,
        isActive: formIsActive,
      };
      setVouchers([...vouchers, newV]);
    } else if (editingVoucher) {
      setVouchers(
        vouchers.map((v) =>
          v.id === editingVoucher.id
            ? {
                ...v,
                code: formCode.toUpperCase().replace(/\s+/g, ""),
                isPercent: formIsPercent,
                value: Number(formValue),
                minOrderValue: Number(formMinOrder),
                maxDiscountValue: Number(formMaxDiscount),
                usageLimit: Number(formLimit),
                startDate: formStart,
                endDate: formEnd,
                isActive: formIsActive,
              }
            : v
        )
      );
    }
    setIsDialogOpen(false);
  };

  const toggleVoucherStatus = (id: string) => {
    setVouchers(
      vouchers.map((v) => (v.id === id ? { ...v, isActive: !v.isActive } : v))
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn muốn xóa mã giảm giá này vĩnh viễn?")) {
      setVouchers(vouchers.filter((v) => v.id !== id));
    }
  };

  const filteredVouchers = vouchers.filter((v) =>
    v.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute inset-y-0 left-3 h-4 w-4 my-auto text-muted-foreground" />
          <Input
            placeholder="Tìm theo mã giảm giá (CODE)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>
        <Button onClick={handleOpenAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md shadow-primary/10 gap-2 h-9 text-xs">
          <PlusCircle className="h-4 w-4" />
          Khởi tạo mã giảm giá
        </Button>
      </div>

      {/* Grid of Vouchers (Aesthetic visual cards) */}
      <VouchersGrid
        vouchers={filteredVouchers}
        onEdit={handleOpenEdit}
        onToggleStatus={toggleVoucherStatus}
        onDelete={handleDelete}
      />

      {/* Dialog for Add/Edit Voucher */}
      <VoucherDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        isAddMode={isAddMode}
        formCode={formCode}
        setFormCode={setFormCode}
        formIsPercent={formIsPercent}
        setFormIsPercent={setFormIsPercent}
        formValue={formValue}
        setFormValue={setFormValue}
        formMinOrder={formMinOrder}
        setFormMinOrder={setFormMinOrder}
        formMaxDiscount={formMaxDiscount}
        setFormMaxDiscount={setFormMaxDiscount}
        formLimit={formLimit}
        setFormLimit={setFormLimit}
        formStart={formStart}
        setFormStart={setFormStart}
        formEnd={formEnd}
        setFormEnd={setFormEnd}
        formIsActive={formIsActive}
        setFormIsActive={setFormIsActive}
        onSave={handleSave}
      />
    </div>
  );
};
