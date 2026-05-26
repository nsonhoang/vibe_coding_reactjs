import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowLeft, FileClock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { inventoryService } from "@/services/inventory-service";
import { InventoryLogsFilters } from "@/components/staff-inventory/inventory-logs-filters";
import { InventoryLogsTable } from "@/components/staff-inventory/inventory-logs-table";
import { InventoryLogsPagination } from "@/components/staff-inventory/inventory-logs-pagination";

export const StaffInventoryLogs: React.FC = () => {
  // Filter & Pagination States
  const [page, setPage] = useState(1);
  const [selectedInventoryId, setSelectedInventoryId] = useState("");
  const [typeFilter, setTypeFilter] = useState<"IN" | "OUT" | "ADJUST" | "">("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Helper: Crash-proof ISO Date parser
  const toSafeISOString = (dateStr: string) => {
    if (!dateStr) return undefined;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? undefined : d.toISOString();
  };

  // 1. Fetch All Warehouse items to populate book selection dropdown
  const { data: inventoryData } = useQuery({
    queryKey: ["inventory-list-for-logs"],
    queryFn: () => inventoryService.getInventory(),
  });
  const warehouseItems = inventoryData?.data || [];

  // 2. Fetch Detailed, Filtered and Paginated Logs
  const { data: logsData, isLoading } = useQuery({
    queryKey: ["inventory-logs-page", page, selectedInventoryId, typeFilter, fromDate, toDate],
    queryFn: () =>
      inventoryService.getInventoryLogs({
        page,
        limit: 10, // 10 logs per page as requested!
        inventoryId: selectedInventoryId || undefined,
        type: typeFilter || undefined,
        from: toSafeISOString(fromDate),
        to: toSafeISOString(toDate),
      }),
  });

  const logsResult = logsData?.data;
  const logs = (logsResult?.data || []) as any[];
  const totalPages = logsResult?.meta?.totalPages || 1;
  const totalLogs = logsResult?.meta?.total || 0;

  const handleResetFilters = () => {
    setSelectedInventoryId("");
    setTypeFilter("");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  const hasActiveFilters = selectedInventoryId !== "" || typeFilter !== "" || fromDate !== "" || toDate !== "";

  return (
    <div className="space-y-6">
      {/* Back Link & Header */}
      <div className="flex flex-col gap-2">
        <Link
          to="/staff/inventory"
          className="inline-flex items-center gap-1.5 text-[10px] font-black text-slate-450 dark:text-slate-500 hover:text-primary uppercase tracking-wider transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại Quản lý kho
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-850 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <FileClock className="h-5.5 w-5.5 text-primary" />
              Lịch sử Biến động Kho chi tiết
            </h2>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wider">
              Báo cáo kiểm toán & nhật ký thay đổi tồn kho toàn hệ thống
            </p>
          </div>
        </div>
      </div>

      {/* Audit Panel Card */}
      <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        {/* Advanced Filters Sub-component */}
        <InventoryLogsFilters
          selectedInventoryId={selectedInventoryId}
          onSelectedInventoryIdChange={(val) => {
            setSelectedInventoryId(val);
            setPage(1);
          }}
          typeFilter={typeFilter}
          onTypeFilterChange={(val) => {
            setTypeFilter(val);
            setPage(1);
          }}
          fromDate={fromDate}
          onFromDateChange={(val) => {
            setFromDate(val);
            setPage(1);
          }}
          toDate={toDate}
          onToDateChange={(val) => {
            setToDate(val);
            setPage(1);
          }}
          warehouseItems={warehouseItems}
          onReset={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Content Table Block Sub-component */}
        <CardContent className="p-0 flex-1">
          <InventoryLogsTable logs={logs} isLoading={isLoading} warehouseItems={warehouseItems} />

          {/* Pagination Sub-component */}
          <InventoryLogsPagination
            page={page}
            totalPages={totalPages}
            totalLogs={totalLogs}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>
    </div>
  );
};
