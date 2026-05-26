import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InventoryAlerts } from "@/components/staff-inventory/inventory-alerts";
import { InventoryTable } from "@/components/staff-inventory/inventory-table";
import { InventoryLogsPanel } from "@/components/staff-inventory/inventory-logs-panel";
import { InventoryHeader } from "@/components/staff-inventory/inventory-header";
import { InventoryStats } from "@/components/staff-inventory/inventory-stats";
import { InventoryAdjustModal } from "@/components/staff-inventory/inventory-adjust-modal";
import { InventoryCreateModal } from "@/components/staff-inventory/inventory-create-modal";
import { InventoryDetailLogsDialog } from "@/components/staff-inventory/inventory-detail-logs-dialog";
import { inventoryService } from "@/services/inventory-service";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const StaffInventory: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLogsDialogOpen, setIsLogsDialogOpen] = useState(false);
  const [clickedInventoryItem, setClickedInventoryItem] = useState<any>(null);

  // Advanced Filter States for Paginated Inventory Logs
  const [logPage, setLogPage] = useState(1);
  const [logType, setLogType] = useState<"IN" | "OUT" | "ADJUST" | "">("");
  const [logFromDate, setLogFromDate] = useState("");
  const [logToDate, setLogToDate] = useState("");

  // Helper: Crash-proof ISO Date parser
  const toSafeISOString = (dateStr: string) => {
    if (!dateStr) return undefined;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? undefined : d.toISOString();
  };

  // 1. Fetch all Inventory Items
  const { data: inventoryData, isLoading, error } = useQuery({
    queryKey: ["inventory"],
    queryFn: () => inventoryService.getInventory(),
  });

  const items = inventoryData?.data || [];

  // 2. Fetch Paginated Inventory Logs (Always global / system-wide transaction log!)
  const { data: logsData, isLoading: isLoadingLogs } = useQuery({
    queryKey: ["inventory-logs", logPage, logType, logFromDate, logToDate],
    queryFn: () =>
      inventoryService.getInventoryLogs({
        page: logPage,
        limit: 10, // 10 logs per page as requested
        inventoryId: undefined, // Always global, no sidebar filtering!
        type: logType || undefined,
        from: toSafeISOString(logFromDate),
        to: toSafeISOString(logToDate),
      }),
  });

  const logsResult = logsData?.data;
  const selectedLogs = (logsResult?.data || []) as any[];
  const logTotalPages = logsResult?.meta?.totalPages || 1;
  const logTotalLogs = logsResult?.meta?.total || 0;

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
        change: Math.abs(data.change),
        type: data.type,
        reason: data.reason,
      }),
    onSuccess: () => {
      // Invalidate queries to refresh list and system logs
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-logs"] });
      setIsAdjustModalOpen(false);
      toast.success("Đã ghi nhận điều chỉnh tồn kho thành công!");
    },
    onError: (err: any) => {
      toast.error(`Lỗi điều chỉnh kho: ${err.message || "Đã xảy ra lỗi"}`);
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

  // 4. Create Inventory Mutation
  const createInventoryMutation = useMutation({
    mutationFn: (bookId: string) => inventoryService.createInventory({ bookId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-logs"] });
      setIsCreateModalOpen(false);
      toast.success("Khởi tạo kho chứa mới thành công!");
    },
    onError: (err: any) => {
      toast.error(`Lỗi tạo kho chứa: ${err.message || "Đã xảy ra lỗi"}`);
    },
  });

  const handleCreateSubmit = async (bookId: string) => {
    return createInventoryMutation.mutateAsync(bookId);
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
  const totalStock = items.reduce((acc, it) => acc + it.quantity, 0);
  const lowStockCount = items.filter((it) => it.quantity <= 10).length;
  const totalLogsCount = logTotalLogs;

  return (
    <div className="space-y-6">
      {/* Top Search & Actions Header Component */}
      <InventoryHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAdjustClick={() => setIsAdjustModalOpen(true)}
        onCreateClick={() => setIsCreateModalOpen(true)}
      />

      {/* Alert Cards for Low stock */}
      <InventoryAlerts items={items} />

      {/* KPI Stats Bento Grid Component */}
      <InventoryStats
        totalBooks={totalBooks}
        totalStock={totalStock}
        lowStockCount={lowStockCount}
        totalLogsCount={totalLogsCount}
      />

      {/* Main Bento Layout Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Current Inventory Table (Left Section) */}
        <InventoryTable
          items={filteredItems}
          onRowClick={(item) => {
            setClickedInventoryItem(item);
            setIsLogsDialogOpen(true);
          }}
        />

        {/* Recent Inventory Logs Panel (Right Section) */}
        <div className="col-span-12 lg:col-span-4">
          <InventoryLogsPanel
            selectedBookTitle=""
            logs={selectedLogs}
            isLoading={isLoadingLogs}
            page={logPage}
            totalPages={logTotalPages}
            totalLogs={logTotalLogs}
            onPageChange={setLogPage}
            typeFilter={logType}
            onTypeFilterChange={setLogType}
            fromDate={logFromDate}
            onFromDateChange={setLogFromDate}
            toDate={logToDate}
            onToDateChange={setLogToDate}
            warehouseItems={items}
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

      {/* Initialize New Inventory Modal Popup */}
      <InventoryCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        existingInventoryItems={items}
        onSuccess={handleCreateSubmit}
      />

      {/* Dialog showing detailed logs for selected row */}
      <InventoryDetailLogsDialog
        isOpen={isLogsDialogOpen}
        onClose={() => setIsLogsDialogOpen(false)}
        inventoryId={clickedInventoryItem?.id || ""}
        bookTitle={clickedInventoryItem?.book?.title || ""}
      />
    </div>
  );
};
