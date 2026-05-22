import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InventoryAlerts } from "@/components/staff-inventory/inventory-alerts";
import { InventoryImportForm } from "@/components/staff-inventory/inventory-import-form";
import { InventoryTable } from "@/components/staff-inventory/inventory-table";
import { inventoryService } from "@/services/inventory-service";
import { Loader2 } from "lucide-react";

export const StaffInventory: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState("");
  const [addQty, setAddQty] = useState(10);

  // 1. Fetch Inventory Items
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

  // 2. Import Stock Mutation
  const importMutation = useMutation({
    mutationFn: (data: { inventoryId: string; change: number }) =>
      inventoryService.createInventoryLog({
        inventoryId: data.inventoryId,
        change: data.change,
        type: "IMPORT",
        reason: "Nhập bổ sung từ Dashboard",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      setAddQty(10);
      alert("Đã hoàn tất nhập kho bổ sung!");
    },
    onError: (err: any) => {
      alert(`Lỗi nhập kho: ${err.message}`);
    },
  });

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || addQty <= 0) return;
    importMutation.mutate({ inventoryId: selectedId, change: addQty });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground font-semibold">Đang đồng bộ dữ liệu kho...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-destructive font-semibold border border-destructive/20 rounded-md bg-destructive/5 text-xs">
        Không thể kết nối đến máy chủ: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert Cards for Low stock */}
      <InventoryAlerts items={items} />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Import Form */}
        <InventoryImportForm
          items={items}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          addQty={addQty}
          setAddQty={setAddQty}
          onImport={handleImport}
          isSubmitting={importMutation.isPending}
        />

        {/* Stock status grid */}
        <InventoryTable items={items} />
      </div>
    </div>
  );
};
