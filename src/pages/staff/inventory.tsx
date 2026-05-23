import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InventoryAlerts } from "@/components/staff-inventory/inventory-alerts";
import { InventoryTable } from "@/components/staff-inventory/inventory-table";
import { InventoryLogsPanel } from "@/components/staff-inventory/inventory-logs-panel";
import { InventoryAdjustModal } from "@/components/staff-inventory/inventory-adjust-modal";
import { inventoryService } from "@/services/inventory-service";
import { Loader2, Plus, Search, BookOpen, Layers, AlertTriangle, Activity } from "lucide-react";

export const StaffInventory: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  // 1. Fetch all Inventory Items
  const { data: inventoryData, isLoading, error } = useQuery({
    queryKey: ["inventory"],
    queryFn: () => inventoryService.getInventory(),
  });

  const items = inventoryData?.data || [];

  // Sync selectedId when items are loaded
  useEffect(() => {
    if (items.length > 0 && !selectedId) {
      setSelectedId(items[0].id);
    }
  }, [items, selectedId]);

  // 2. Fetch Detailed Inventory with Logs
  const { data: selectedDetailData, isLoading: isLoadingLogs } = useQuery({
    queryKey: ["inventory-detail", selectedId],
    queryFn: () => inventoryService.getInventoryById(selectedId),
    enabled: !!selectedId,
  });

  const selectedItemDetail = selectedDetailData?.data;
  const selectedBookTitle = selectedItemDetail?.book?.title || "Đang tải...";
  const selectedLogs = selectedItemDetail?.logs || [];

  // 3. Adjust Stock Mutation
  const adjustMutation = useMutation({
    mutationFn: (data: {
      inventoryId: string;
      change: number;
      type: "IMPORT" | "EXPORT" | "ADJUST";
      reason?: string;
    }) =>
      inventoryService.createInventoryLog({
        inventoryId: data.inventoryId,
        change: data.type === "EXPORT" ? -Math.abs(data.change) : Math.abs(data.change),
        type: data.type,
        reason: data.reason,
      }),
    onSuccess: () => {
      // Invalidate queries to refresh list and detail logs
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-detail", selectedId] });
      setIsAdjustModalOpen(false);
      alert("Đã ghi nhận điều chỉnh tồn kho thành công!");
    },
    onError: (err: any) => {
      alert(`Lỗi điều chỉnh kho: ${err.message || "Đã xảy ra lỗi"}`);
    },
  });

  const handleAdjustSubmit = (data: {
    inventoryId: string;
    change: number;
    type: "IMPORT" | "EXPORT" | "ADJUST";
    reason: string;
  }) => {
    adjustMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
          Đang đồng bộ dữ liệu kho...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-rose-500 font-semibold border border-rose-500/20 rounded-2xl bg-rose-500/5 text-xs">
        Không thể kết nối đến máy chủ: {error.message}
      </div>
    );
  }

  // Filter items based on search query
  const filteredItems = items.filter((item) => {
    const title = item.book?.title?.toLowerCase() || "";
    const cats = item.book?.categories?.map((c) => c.name.toLowerCase()).join(" ") || "";
    const sku = `LIT-${item.id.substring(0, 5)}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return title.includes(query) || cats.includes(query) || sku.includes(query);
  });

  // Stats computation
  const totalBooks = items.length;
  const totalStock = items.reduce((acc, it) => acc + it.stock, 0);
  const lowStockCount = items.filter((it) => it.stock <= it.minAlert).length;
  const totalLogsCount = items.length > 0 ? 156 : 0; // Mock historical transactions similar to Stitch HTML mockup

  return (
    <div className="space-y-6">
      {/* Top Navbar Style Search & Header block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-850 dark:text-slate-100 uppercase tracking-wider">
            Quản lý Kho hàng & Nhật ký
          </h2>
          <p className="text-xs text-slate-450 dark:text-slate-400 font-semibold mt-1">
            Theo dõi tồn kho thực tế và quản lý biến động hàng hóa trong kho NestJS Bookstore.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Tìm kiếm sách, SKU, kệ vị trí..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
            />
          </div>
          <button
            onClick={() => setIsAdjustModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-black shadow-md shadow-primary/10 hover:opacity-90 transition-all uppercase tracking-wider"
          >
            <Plus className="h-4.5 w-4.5" />
            Điều chỉnh kho
          </button>
        </div>
      </div>

      {/* Alert Cards for Low stock */}
      <InventoryAlerts items={items} />

      {/* Dashboard Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="p-2 bg-primary/10 text-primary rounded-lg">
              <BookOpen className="h-5 w-5" />
            </span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              +2% so với tháng trước
            </span>
          </div>
          <p className="text-[10px] text-slate-450 dark:text-slate-500 font-extrabold uppercase tracking-wider">
            Tổng đầu sách
          </p>
          <h3 className="text-xl font-black mt-1 font-mono text-slate-850 dark:text-slate-100">
            {totalBooks.toLocaleString("vi-VN")}
          </h3>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
              <Layers className="h-5 w-5" />
            </span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Tồn kho ổn định
            </span>
          </div>
          <p className="text-[10px] text-slate-450 dark:text-slate-500 font-extrabold uppercase tracking-wider">
            Tổng tồn kho
          </p>
          <h3 className="text-xl font-black mt-1 font-mono text-slate-850 dark:text-slate-100">
            {totalStock.toLocaleString("vi-VN")}
          </h3>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="p-2 bg-rose-500/10 text-rose-600 rounded-lg">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                lowStockCount > 0
                  ? "text-rose-600 bg-rose-500/10 animate-pulse"
                  : "text-emerald-600 bg-emerald-500/10"
              }`}
            >
              {lowStockCount > 0 ? "Cần nhập hàng" : "An toàn"}
            </span>
          </div>
          <p className="text-[10px] text-slate-450 dark:text-slate-500 font-extrabold uppercase tracking-wider">
            Sách sắp hết hàng
          </p>
          <h3 className="text-xl font-black mt-1 font-mono text-slate-850 dark:text-slate-100">
            {lowStockCount}
          </h3>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg">
              <Activity className="h-5 w-5" />
            </span>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              24 giờ qua
            </span>
          </div>
          <p className="text-[10px] text-slate-450 dark:text-slate-500 font-extrabold uppercase tracking-wider">
            Giao dịch kho
          </p>
          <h3 className="text-xl font-black mt-1 font-mono text-slate-850 dark:text-slate-100">
            {totalLogsCount}
          </h3>
        </div>
      </div>

      {/* Main Bento Layout Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Current Inventory Table (Left Section) */}
        <InventoryTable
          items={filteredItems}
          selectedId={selectedId}
          onSelectId={setSelectedId}
        />

        {/* Recent Inventory Logs (Right Section) */}
        <div className="col-span-12 lg:col-span-4">
          <InventoryLogsPanel
            selectedBookTitle={selectedBookTitle}
            logs={selectedLogs}
            isLoading={isLoadingLogs}
          />
        </div>
      </div>

      {/* Stock Adjustment Modal Popup */}
      <InventoryAdjustModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        items={items}
        onSubmit={handleAdjustSubmit}
        isSubmitting={adjustMutation.isPending}
      />
    </div>
  );
};
