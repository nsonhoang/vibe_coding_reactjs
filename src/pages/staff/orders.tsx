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

  const orders = ordersData?.data?.items || [];

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute inset-y-0 left-3 h-4 w-4 my-auto text-muted-foreground" />
          <Input
            placeholder="Tìm theo Mã đơn hàng hoặc Tên khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-card border-border text-xs"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-20 space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-semibold">Đang tải danh sách vận đơn...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-destructive font-semibold border border-destructive/20 rounded-md bg-destructive/5 text-xs">
          Không thể kết nối đến máy chủ: {error.message}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground font-medium text-xs">
          Không tìm thấy đơn hàng nào khớp với tìm kiếm.
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
