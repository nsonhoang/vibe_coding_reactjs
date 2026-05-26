import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Calendar, Filter, X, CreditCard, ShoppingBag } from "lucide-react";
import { OrdersTable } from "@/components/staff-orders/orders-table";
import { OrderDialog } from "@/components/staff-orders/order-dialog";
import { orderService, type Order } from "@/services/order-service";
import { toast } from "sonner";

export const StaffOrders: React.FC = () => {
  const queryClient = useQueryClient();
  
  // Filter & Pagination States
  const [page, setPage] = useState(1);
  const [codeQuery, setCodeQuery] = useState("");
  const [status, setStatus] = useState<Order["status"] | "">("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "VNPAY" | "">("");
  const [createFrom, setCreateFrom] = useState("");
  const [createTo, setCreateTo] = useState("");

  const [codeBuffer, setCodeBuffer] = useState("");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form states to update shipping in Dialog
  const [formStatus, setFormStatus] = useState<Order["status"]>("PENDING");
  const [formShipper, setFormShipper] = useState("");
  const [formTracking, setFormTracking] = useState("");

  // Limit strictly 10
  const limit = 10;

  // 1. Fetch Orders from Backend with all filters
  const { data: ordersData, isLoading, error } = useQuery({
    queryKey: ["orders", page, codeQuery, status, paymentMethod, createFrom, createTo],
    queryFn: () =>
      orderService.getOrders({
        page,
        limit,
        code: codeQuery || undefined,
        status: status || undefined,
        paymentMethod: paymentMethod || undefined,
        createFrom: createFrom || undefined,
        createTo: createTo || undefined,
      }),
  });

  // 2. Mutations
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order["status"] }) =>
      orderService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setIsDialogOpen(false);
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
    },
    onError: (err: any) => {
      toast.error(`Lỗi cập nhật trạng thái đơn hàng: ${err.message}`);
    },
  });

  const handleOpenDetail = (ord: Order) => {
    setSelectedOrder(ord);
    setFormStatus(ord.status);
    setFormShipper(ord.shipment?.shippingService || ord.shipment?.courier || "GHN");
    setFormTracking(ord.shipment?.ghnOrderCode || ord.shipment?.trackingCode || "");
    setIsDialogOpen(true);
  };

  const handleSaveStatus = () => {
    if (!selectedOrder) return;
    updateStatusMutation.mutate({ id: selectedOrder.id, status: formStatus });
  };

  const updateStatusQuick = (id: string, newStatus: Order["status"]) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const handleApplyFilter = () => {
    setCodeQuery(codeBuffer);
    setPage(1);
  };

  const handleClearFilters = () => {
    setCodeBuffer("");
    setCodeQuery("");
    setStatus("");
    setPaymentMethod("");
    setCreateFrom("");
    setCreateTo("");
    setPage(1);
  };

  // Get raw orders & metadata
  const paginatedResult = ordersData?.data;
  const orders = paginatedResult?.data || paginatedResult?.items || [];
  
  const totalItems = paginatedResult?.meta?.total || paginatedResult?.meta?.totalItems || 0;
  const totalPages = paginatedResult?.meta?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Quản lý đơn hàng</h2>
        <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
          Tra cứu trạng thái, phê duyệt vận đơn và thiết lập lộ trình giao nhận bưu tá.
        </p>
      </div>

      {/* Advanced Filter Panel (Stitch Bento Standard) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
          
          {/* Order Code / Keyword */}
          <div className="space-y-1.5 sm:col-span-1">
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Tìm mã đơn</label>
            <div className="relative">
              <Search className="absolute inset-y-0 left-3 h-3.5 w-3.5 my-auto text-slate-400" />
              <Input
                placeholder="ORD-9021..."
                value={codeBuffer}
                onChange={(e) => setCodeBuffer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleApplyFilter()}
                className="pl-9 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs font-semibold rounded-lg h-9 w-full outline-none focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          </div>

          {/* Status filter dropdown */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Trạng thái</label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as any);
                setPage(1);
              }}
              className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-lg h-9 w-full px-3 text-slate-700 dark:text-slate-250 outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING">Chờ duyệt (PENDING)</option>
              <option value="PROCESSING">Đang xử lý (PROCESSING)</option>
              <option value="SHIPPED">Đang giao (SHIPPED)</option>
              <option value="COMPLETED">Hoàn thành (COMPLETED)</option>
              <option value="CANCELLED">Đã hủy (CANCELLED)</option>
            </select>
          </div>

          {/* Payment Method filter */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Thanh toán</label>
            <select
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value as any);
                setPage(1);
              }}
              className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-lg h-9 w-full px-3 text-slate-700 dark:text-slate-250 outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer"
            >
              <option value="">Tất cả</option>
              <option value="COD">COD (Thanh toán khi nhận)</option>
              <option value="VNPAY">VNPAY Gateway</option>
            </select>
          </div>

          {/* Create From Date */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Từ ngày đặt</label>
            <input
              type="date"
              value={createFrom}
              onChange={(e) => {
                setCreateFrom(e.target.value);
                setPage(1);
              }}
              className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-lg h-9 w-full px-3 text-slate-700 dark:text-slate-250 outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            />
          </div>

          {/* Create To Date */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Đến ngày đặt</label>
            <input
              type="date"
              value={createTo}
              onChange={(e) => {
                setCreateTo(e.target.value);
                setPage(1);
              }}
              className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-lg h-9 w-full px-3 text-slate-700 dark:text-slate-250 outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            />
          </div>
        </div>

        {/* Clear Filters & Submit action panel */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-lg text-xs font-extrabold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            Xóa bộ lọc
          </button>
          <button
            onClick={handleApplyFilter}
            className="flex items-center gap-1.5 px-5 py-2 bg-primary text-white rounded-lg text-xs font-extrabold hover:opacity-90 transition-opacity cursor-pointer shadow-sm shadow-primary/10"
          >
            <Filter className="h-3.5 w-3.5" />
            Lọc dữ liệu
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-20 space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Đang tải danh sách vận đơn...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-650 dark:text-red-405 font-bold border border-red-200 dark:border-red-800/50 rounded-xl bg-red-50 dark:bg-red-950/20 text-xs shadow-sm">
          Không thể kết nối đến máy chủ: {error.message}
        </div>
      ) : (
        /* Orders Table with bound page values */
        <OrdersTable
          orders={orders}
          onOpenDetail={handleOpenDetail}
          onUpdateStatusQuick={updateStatusQuick}
          isSubmitting={updateStatusMutation.isPending}
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={(p) => setPage(p)}
        />
      )}

      {/* Dialog for Order Detail & Dispatch */}
      <OrderDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        selectedOrder={selectedOrder}
        formStatus={formStatus}
        setFormStatus={setFormStatus}
        formShipper={formShipper}
        setFormShipper={setFormShipper}
        formTracking={formTracking}
        setFormTracking={setFormTracking}
        onSave={handleSaveStatus}
        isSaving={updateStatusMutation.isPending}
      />
    </div>
  );
};
