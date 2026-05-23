import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { OrdersTable } from "@/components/staff-orders/orders-table";
import { OrderDialog } from "@/components/staff-orders/order-dialog";
import { orderService, type Order } from "@/services/order-service";

export const StaffOrders: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<"ALL" | Order["status"]>("ALL");

  // Form states to update shipping
  const [formStatus, setFormStatus] = useState<Order["status"]>("PENDING");
  const [formShipper, setFormShipper] = useState("");
  const [formTracking, setFormTracking] = useState("");

  // Debounce search term
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 1. Fetch Orders
  const { data: ordersData, isLoading, error } = useQuery({
    queryKey: ["orders", debouncedSearch],
    queryFn: () => orderService.getOrders({ keyword: debouncedSearch, limit: 100 }),
  });

  // 2. Mutations
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order["status"] }) =>
      orderService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setIsDialogOpen(false);
      alert("Cập nhật trạng thái đơn hàng thành công!");
    },
    onError: (err: any) => {
      alert(`Lỗi cập nhật trạng thái đơn hàng: ${err.message}`);
    },
  });

  const handleOpenDetail = (ord: Order) => {
    setSelectedOrder(ord);
    setFormStatus(ord.status);
    setFormShipper(ord.shipment?.courier || "Giao Hàng Tiết Kiệm (GHTK)");
    setFormTracking(ord.shipment?.trackingCode || "");
    setIsDialogOpen(true);
  };

  const handleSaveStatus = () => {
    if (!selectedOrder) return;
    updateStatusMutation.mutate({ id: selectedOrder.id, status: formStatus });
  };

  const updateStatusQuick = (id: string, newStatus: Order["status"]) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  // Get raw orders & apply client-side status filter
  const rawOrders = ordersData?.data?.data || ordersData?.data?.items || [];
  const orders = rawOrders.filter(
    (ord: Order) => selectedStatus === "ALL" || ord.status === selectedStatus
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Quản lý đơn hàng</h2>
        <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">Tra cứu trạng thái, phê duyệt vận đơn và thiết lập lộ trình giao nhận bưu tá.</p>
      </div>

      {/* Bento Search and Filters Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* Keyword Search */}
          <div className="space-y-1.5 md:col-span-1">
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Tìm kiếm đơn hàng</label>
            <div className="relative">
              <Search className="absolute inset-y-0 left-3 h-3.5 w-3.5 my-auto text-slate-400" />
              <Input
                placeholder="Mã đơn hàng, tên khách..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs font-semibold rounded-lg h-9 w-full focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary outline-none"
              />
            </div>
          </div>

          {/* Status Filters */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Trạng thái vận đơn</label>
            <div className="flex flex-wrap gap-1 p-1 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-800 min-h-9 items-center">
              {(["ALL", "PENDING", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`flex-1 min-w-[70px] py-1 text-[9px] font-bold rounded-md transition-all cursor-pointer ${
                    selectedStatus === st
                      ? "bg-primary text-white shadow-sm shadow-primary/10"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {st === "ALL" ? "Tất cả" : st === "PENDING" ? "Chờ duyệt" : st === "PROCESSING" ? "Đang xử lý" : st === "SHIPPED" ? "Đang giao" : st === "COMPLETED" ? "Hoàn thành" : "Đã hủy"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-20 space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Đang tải danh sách vận đơn...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-600 font-semibold border border-red-200 rounded-xl bg-red-50 text-xs">
          Không thể kết nối đến máy chủ: {error.message}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-24 text-slate-500 dark:text-slate-400 font-bold border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs">
          Không tìm thấy đơn hàng nào khớp với bộ lọc của bạn.
        </div>
      ) : (
        /* Orders Table Card */
        <OrdersTable
          orders={orders}
          onOpenDetail={handleOpenDetail}
          onUpdateStatusQuick={updateStatusQuick}
          isSubmitting={updateStatusMutation.isPending}
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
