import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, Send, PlusCircle } from "lucide-react";
import { toast } from "sonner";

import { VouchersTable } from "@/components/admin-vouchers/vouchers-table";
import { VoucherDialog } from "@/components/admin-vouchers/voucher-dialog";
import { VouchersFilters } from "@/components/admin-vouchers/vouchers-filters";
import { VouchersStatsGrid } from "@/components/admin-vouchers/vouchers-stats-grid";

import { voucherService } from "@/services/voucher-service";
import type { Voucher } from "@/services/voucher-service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const AdminVouchers: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"createdAt" | "code" | "startDate" | "endDate" | "usedCount">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);

  // Form states
  const [formCode, setFormCode] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDiscountType, setFormDiscountType] = useState<"PERCENTAGE" | "FIXED_AMOUNT">("PERCENTAGE");
  const [formDiscountValue, setFormDiscountValue] = useState(10);
  const [formMinOrderValue, setFormMinOrderValue] = useState(100000);
  const [formMaxDiscount, setFormMaxDiscount] = useState(30000);
  const [formUsageLimit, setFormUsageLimit] = useState(200);
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);

  // AlertDialog State
  const [voucherToDelete, setVoucherToDelete] = useState<string | null>(null);

  const limit = 10;

  // Reset page when search, status or sorting filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, sortBy, sortOrder]);

  // Debouncing search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 1. Fetch Vouchers
  const { data: vouchersResponse, isLoading: isLoadingVouchers, error: vouchersError } = useQuery({
    queryKey: ["vouchers", page, debouncedSearch, statusFilter, sortBy, sortOrder],
    queryFn: () => voucherService.getVouchers({
      page,
      limit,
      keyword: debouncedSearch.trim() || undefined,
      isActive: statusFilter === "ACTIVE" ? true : statusFilter === "INACTIVE" ? false : undefined,
      sortBy,
      sortOrder,
    }),
  });

  const paginatedResult = vouchersResponse?.data;
  const vouchers = useMemo(() => paginatedResult?.data || paginatedResult?.items || [], [paginatedResult]);
  const totalItems = paginatedResult?.meta?.totalItems || 0;
  const totalPages = paginatedResult?.meta?.totalPages || 1;

  const activeVouchersCount = useMemo(() => vouchers.filter(v => v.isActive).length, [vouchers]);

  // Mutations
  const createVoucherMutation = useMutation({
    mutationFn: (data: Parameters<typeof voucherService.createVoucher>[0]) => 
      voucherService.createVoucher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      setIsDialogOpen(false);
      toast.success("Khởi tạo mã giảm giá mới thành công!");
    },
    onError: (err: any) => toast.error(`Lỗi tạo mã giảm giá: ${err.response?.data?.message || err.message}`),
  });

  const updateVoucherMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof voucherService.updateVoucher>[1] }) => 
      voucherService.updateVoucher(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      setIsDialogOpen(false);
      toast.success("Cập nhật thông tin mã giảm giá thành công!");
    },
    onError: (err: any) => toast.error(`Lỗi cập nhật mã giảm giá: ${err.response?.data?.message || err.message}`),
  });

  const deleteVoucherMutation = useMutation({
    mutationFn: (id: string) => voucherService.deleteVoucher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      toast.success("Đã xóa mã giảm giá thành công!");
    },
    onError: (err: any) => toast.error(`Lỗi xóa mã giảm giá: ${err.response?.data?.message || err.message}`),
  });

  // Callbacks
  const handleOpenAdd = useCallback(() => {
    setIsAddMode(true);
    setFormCode("");
    setFormDescription("");
    setFormDiscountType("PERCENTAGE");
    setFormDiscountValue(10);
    setFormMinOrderValue(100000);
    setFormMaxDiscount(30000);
    setFormUsageLimit(200);
    setFormStartDate(new Date().toISOString().split("T")[0]);
    setFormEndDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
    setFormIsActive(true);
    setIsDialogOpen(true);
  }, []);

  const handleOpenEdit = useCallback((v: Voucher) => {
    setIsAddMode(false);
    setEditingVoucher(v);
    setFormCode(v.code);
    setFormDescription(v.description || "");
    setFormDiscountType(v.discountType);
    setFormDiscountValue(v.discountValue);
    setFormMinOrderValue(v.minOrderValue);
    setFormMaxDiscount(v.maxDiscount || 0);
    setFormUsageLimit(v.usageLimit || 0);
    setFormStartDate(v.startDate ? v.startDate.split("T")[0] : "");
    setFormEndDate(v.endDate ? v.endDate.split("T")[0] : "");
    setFormIsActive(v.isActive);
    setIsDialogOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!formCode || formDiscountValue <= 0) {
      toast.warning("Vui lòng điền mã và giá trị giảm hợp lệ!");
      return;
    }
    const payload = {
      code: formCode.toUpperCase().replace(/\s+/g, ""),
      description: formDescription || undefined,
      discountType: formDiscountType,
      discountValue: Number(formDiscountValue),
      minOrderValue: Number(formMinOrderValue),
      maxDiscount: formDiscountType === "PERCENTAGE" ? Number(formMaxDiscount) : undefined,
      usageLimit: formUsageLimit ? Number(formUsageLimit) : undefined,
      startDate: new Date(formStartDate).toISOString(),
      endDate: new Date(formEndDate).toISOString(),
      isActive: formIsActive,
    };
    if (isAddMode) {
      createVoucherMutation.mutate(payload);
    } else if (editingVoucher) {
      updateVoucherMutation.mutate({
        id: editingVoucher.id,
        data: {
          description: payload.description,
          usageLimit: payload.usageLimit,
          startDate: payload.startDate,
          endDate: payload.endDate,
          isActive: payload.isActive,
        },
      });
    }
  }, [formCode, formDiscountValue, formDescription, formDiscountType, formMinOrderValue, formMaxDiscount, formUsageLimit, formStartDate, formEndDate, formIsActive, isAddMode, editingVoucher, createVoucherMutation, updateVoucherMutation]);

  const toggleVoucherStatus = useCallback((id: string, currentStatus: boolean) => {
    updateVoucherMutation.mutate({ id, data: { isActive: !currentStatus } });
  }, [updateVoucherMutation]);

  const handleDelete = useCallback((id: string) => {
    setVoucherToDelete(id);
  }, []);

  const navigateToUsers = useCallback(() => navigate("/admin/users"), [navigate]);

  return (
    <div className="space-y-6">
      <label className="sr-only">Quản trị vouchers hệ thống</label>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <h2 className="font-extrabold text-2xl tracking-tight text-primary dark:text-primary-fixed-dim">Quản trị Hệ thống</h2>
          <p className="text-xs text-slate-500 mt-1.5">Quản lý tài khoản người dùng và các chương trình khuyến mãi hiện hành.</p>
        </div>
        <div className="flex gap-2.5">
          <Button 
            variant="outline"
            className="flex items-center gap-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold shadow-sm h-9 cursor-pointer"
            onClick={() => toast.info("Gửi thông báo broadcast hệ thống...")}
          >
            <Send className="h-3.5 w-3.5" />
            Gửi thông báo
          </Button>
          <Button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-[#00288e] hover:bg-[#00288e]/95 text-white text-xs font-bold shadow-md shadow-[#00288e]/10 h-9 cursor-pointer rounded-lg"
          >
            <PlusCircle className="h-4 w-4" />
            Tạo Voucher mới
          </Button>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850/20">
          <button 
            onClick={navigateToUsers}
            className="flex-1 py-4 px-6 font-bold text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-350 transition-all cursor-pointer"
          >
            Người dùng
          </button>
          <button className="flex-1 py-4 px-6 font-bold text-xs text-primary dark:text-primary-fixed-dim border-b-2 border-primary dark:border-primary-fixed-dim transition-all cursor-pointer">
            Khuyến mãi / Voucher
          </button>
        </div>

        {/* Inner Content Padding */}
        <div className="p-5 space-y-5">
          <VouchersFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            onOpenAdd={handleOpenAdd}
          />

          {isLoadingVouchers ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-xs">Đang đồng bộ danh sách mã giảm giá từ cơ sở dữ liệu...</span>
            </div>
          ) : vouchersError ? (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-650 text-center py-10 rounded-2xl text-xs font-bold">
              Lỗi đồng bộ dữ liệu: {(vouchersError as any).message || "Không thể kết nối đến máy chủ API"}
            </div>
          ) : (
            <VouchersTable
              vouchers={vouchers}
              onEdit={handleOpenEdit}
              onToggleStatus={toggleVoucherStatus}
              onDelete={handleDelete}
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              onPageChange={setPage}
              isSubmitting={createVoucherMutation.isPending || updateVoucherMutation.isPending || deleteVoucherMutation.isPending}
            />
          )}
        </div>
      </div>

      <VouchersStatsGrid
        activeVouchersCount={activeVouchersCount}
        onOpenAdd={handleOpenAdd}
      />

      <VoucherDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        isAddMode={isAddMode}
        formCode={formCode}
        setFormCode={setFormCode}
        formDescription={formDescription}
        setFormDescription={setFormDescription}
        formDiscountType={formDiscountType}
        setFormDiscountType={setFormDiscountType}
        formDiscountValue={formDiscountValue}
        setFormDiscountValue={setFormDiscountValue}
        formMinOrderValue={formMinOrderValue}
        setFormMinOrderValue={setFormMinOrderValue}
        formMaxDiscount={formMaxDiscount}
        setFormMaxDiscount={setFormMaxDiscount}
        formUsageLimit={formUsageLimit}
        setFormUsageLimit={setFormUsageLimit}
        formStartDate={formStartDate}
        setFormStartDate={setFormStartDate}
        formEndDate={formEndDate}
        setFormEndDate={setFormEndDate}
        formIsActive={formIsActive}
        setFormIsActive={setFormIsActive}
        onSave={handleSave}
      />

      {/* Beautiful Shadcn UI AlertDialog confirmation */}
      <AlertDialog open={!!voucherToDelete} onOpenChange={(open) => !open && setVoucherToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa vĩnh viễn voucher?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa vĩnh viễn mã giảm giá này không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (voucherToDelete) {
                  deleteVoucherMutation.mutate(voucherToDelete);
                  setVoucherToDelete(null);
                }
              }}
            >
              Xóa vĩnh viễn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
