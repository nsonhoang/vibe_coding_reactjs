import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  PlusCircle, 
  Loader2, 
  Send,
  UserCheck,
  Ticket,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus,
  Megaphone
} from "lucide-react";
import { VouchersTable } from "@/components/admin-vouchers/vouchers-table";
import { VoucherDialog } from "@/components/admin-vouchers/voucher-dialog";
import { voucherService } from "@/services/voucher-service";
import type { Voucher } from "@/services/voucher-service";

export const AdminVouchers: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
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

  // Strictly 10 items per page standard
  const limit = 10;

  // Reset page when search or status filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  // Debouncing search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 1. Fetch Vouchers with backend pagination and active filters
  const { data: vouchersResponse, isLoading: isLoadingVouchers, error: vouchersError } = useQuery({
    queryKey: ["vouchers", page, debouncedSearch, statusFilter],
    queryFn: () => voucherService.getVouchers({
      page,
      limit,
      keyword: debouncedSearch.trim() || undefined,
      isActive: statusFilter === "ACTIVE" ? true : statusFilter === "INACTIVE" ? false : undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    }),
  });

  const paginatedResult = vouchersResponse?.data;
  const vouchers = paginatedResult?.data || paginatedResult?.items || [];
  const totalItems = paginatedResult?.meta?.totalItems || 0;
  const totalPages = paginatedResult?.meta?.totalPages || 1;

  // 2. Create Voucher Mutation
  const createVoucherMutation = useMutation({
    mutationFn: (data: Parameters<typeof voucherService.createVoucher>[0]) => 
      voucherService.createVoucher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      setIsDialogOpen(false);
      alert("Khởi tạo mã giảm giá mới thành công!");
    },
    onError: (err: any) => {
      alert(`Lỗi tạo mã giảm giá: ${err.response?.data?.message || err.message}`);
    },
  });

  // 3. Update Voucher Mutation
  const updateVoucherMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof voucherService.updateVoucher>[1] }) => 
      voucherService.updateVoucher(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      setIsDialogOpen(false);
      alert("Cập nhật mã giảm giá thành công!");
    },
    onError: (err: any) => {
      alert(`Lỗi cập nhật mã giảm giá: ${err.response?.data?.message || err.message}`);
    },
  });

  // 4. Delete Voucher Mutation
  const deleteVoucherMutation = useMutation({
    mutationFn: (id: string) => voucherService.deleteVoucher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      alert("Xóa mã giảm giá thành công!");
    },
    onError: (err: any) => {
      alert(`Lỗi xóa mã giảm giá: ${err.response?.data?.message || err.message}`);
    },
  });

  const handleOpenAdd = () => {
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
  };

  const handleOpenEdit = (v: Voucher) => {
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
  };

  const handleSave = () => {
    if (!formCode || formDiscountValue <= 0) {
      alert("Vui lòng điền mã và giá trị giảm!");
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
  };

  const toggleVoucherStatus = (id: string, currentStatus: boolean) => {
    updateVoucherMutation.mutate({
      id,
      data: {
        isActive: !currentStatus,
      },
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn mã giảm giá này không?")) {
      deleteVoucherMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
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
            onClick={() => alert("Gửi thông báo broadcast hệ thống...")}
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
            onClick={() => navigate("/admin/users")}
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
          {/* Control Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3 max-w-xl flex-1">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute inset-y-0 left-3 h-4 w-4 my-auto text-slate-400" />
                <Input
                  placeholder="Tìm kiếm voucher bằng Code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-card border-slate-200 dark:border-slate-800 text-xs focus:ring-1 focus:ring-primary h-9 rounded-lg"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs h-9 rounded-lg px-3 focus:ring-1 focus:ring-primary focus:border-primary text-slate-600 dark:text-slate-350 cursor-pointer font-medium outline-none"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="INACTIVE">Tạm dừng hoạt động</option>
              </select>
            </div>
            <Button 
              onClick={handleOpenAdd} 
              className="bg-[#00288e] hover:bg-[#00288e]/95 text-white font-bold shadow-md shadow-[#00288e]/10 gap-2 h-9 text-xs cursor-pointer rounded-lg px-4"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              Tạo Voucher mới
            </Button>
          </div>

          {/* Loading state */}
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
            /* Table of Vouchers matching users_promotions.html */
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

      {/* Stats Bento Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg text-primary dark:text-primary-fixed-dim">
              <UserCheck className="h-5 w-5" />
            </div>
            <span className="text-emerald-500 font-bold text-xs flex items-center gap-0.5">
              <TrendingUp className="h-3.5 w-3.5" /> 12%
            </span>
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-wider">Người dùng mới (Tháng này)</p>
            <h3 className="font-extrabold text-2xl text-slate-800 dark:text-white mt-1">1,284</h3>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-lg text-amber-500">
              <Ticket className="h-5 w-5" />
            </div>
            <span className="text-amber-500 font-bold text-xs flex items-center gap-0.5">
              <Minus className="h-3.5 w-3.5" /> 0%
            </span>
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-wider">Voucher đang hoạt động</p>
            <h3 className="font-extrabold text-2xl text-slate-800 dark:text-white mt-1">{vouchers.filter(v => v.isActive).length}</h3>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg text-emerald-500">
              <DollarSign className="h-5 w-5" />
            </div>
            <span className="text-red-500 font-bold text-xs flex items-center gap-0.5">
              <TrendingDown className="h-3.5 w-3.5" /> 5%
            </span>
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-wider">Tổng chiết khấu (VNĐ)</p>
            <h3 className="font-extrabold text-2xl text-slate-800 dark:text-white mt-1">18.5M</h3>
          </div>
        </div>
      </div>

      {/* Marketing Campaign Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-850 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 group shadow-lg shadow-indigo-500/10">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="relative z-10 space-y-2.5 text-center sm:text-left">
          <span className="bg-emerald-550 text-white px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest inline-block">
            Chiến dịch mùa hè
          </span>
          <h2 className="text-white font-extrabold text-lg tracking-tight">
            Tăng tốc doanh số với Voucher Combo mới
          </h2>
          <p className="text-indigo-200 max-w-xl text-xs leading-relaxed">
            Thiết lập các chương trình giảm giá chéo giữa các thể loại sách để khuyến khích người dùng mua nhiều hơn trong mùa hè này.
          </p>
        </div>
        <div className="relative z-10 shrink-0">
          <button 
            onClick={handleOpenAdd}
            className="bg-white hover:bg-slate-50 text-indigo-700 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xl transition-all hover:scale-[1.03] active:scale-95 cursor-pointer"
          >
            Bắt đầu ngay
          </button>
        </div>
      </div>

      {/* Dialog for Add/Edit Voucher */}
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
    </div>
  );
};
