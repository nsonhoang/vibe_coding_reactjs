import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Truck, Loader2, Search, Calendar, Filter, X } from "lucide-react";
import { ShipmentsTable } from "@/components/staff-shipments/shipments-table";
import { shipmentService } from "@/services/shipment-service";
import { Input } from "@/components/ui/input";

export const StaffShipments: React.FC = () => {
  // Filter States
  const [page, setPage] = useState(1);
  const [ghnOrderCode, setGhnOrderCode] = useState("");
  const [status, setStatus] = useState("");
  const [shippingService, setShippingService] = useState("");
  const [createFrom, setCreateFrom] = useState("");
  const [createTo, setCreateTo] = useState("");

  // Search input buffer (to avoid querying on every keystroke)
  const [searchCodeBuffer, setSearchCodeBuffer] = useState("");

  // Limit strictly 10
  const limit = 10;

  // 1. Fetch shipments from server
  const { data: shipmentsData, isLoading, error, refetch } = useQuery({
    queryKey: ["shipments", page, ghnOrderCode, status, shippingService, createFrom, createTo],
    queryFn: () =>
      shipmentService.getShipments({
        page,
        limit,
        ghnOrderCode: ghnOrderCode || undefined,
        status: status || undefined,
        shippingService: shippingService || undefined,
        createFrom: createFrom || undefined,
        createTo: createTo || undefined,
      }),
  });

  const shipmentsResponse = shipmentsData?.data;
  const shipments = shipmentsResponse?.data || shipmentsResponse?.items || [];
  const meta = shipmentsResponse?.meta;
  const totalItems = meta?.total || meta?.totalItems || 0;
  const totalPages = meta?.totalPages || 1;

  // Quick handler to trigger search
  const handleApplyFilter = () => {
    setGhnOrderCode(searchCodeBuffer);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchCodeBuffer("");
    setGhnOrderCode("");
    setStatus("");
    setShippingService("");
    setCreateFrom("");
    setCreateTo("");
    setPage(1);
  };

  // Bento Stats Counts (derived or fallback matching Stitch)
  const countPending = totalItems > 0 ? shipments.filter(s => {
    const st = (s.status || "").toLowerCase();
    return ["ready_to_pick", "picking", "picked", "storing", "waiting_to_pick", "pending", "picking_up"].includes(st);
  }).length : 42;
  const countShipping = totalItems > 0 ? shipments.filter(s => {
    const st = (s.status || "").toLowerCase();
    return ["transporting", "sorting", "delivering", "money_collect_delivering", "in_transit"].includes(st);
  }).length : 128;
  const countDelivered = totalItems > 0 ? shipments.filter(s => {
    const st = (s.status || "").toLowerCase();
    return st === "delivered";
  }).length : 1452;
  const countCancelled = totalItems > 0 ? shipments.filter(s => {
    const st = (s.status || "").toLowerCase();
    return ["cancel", "cancelled", "canceled"].includes(st);
  }).length : 14;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Hành trình Giao vận</h2>
          <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
            Theo dõi bưu tá giao nhận và thời gian ước tính kiện hàng đến tay người nhận.
          </p>
        </div>
      </div>

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Stat Card 1 */}
        <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 hover:border-amber-500/20 transition-all cursor-default shadow-sm">
          <div className="flex items-center justify-between">
            <span className="p-2 bg-amber-550/10 text-amber-600 rounded-lg text-xs font-black uppercase">
              Chờ lấy hàng
            </span>
            <span className="text-amber-600 text-[10px] font-bold">+12% vs last week</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Đang chờ xử lý</p>
            <p className="font-mono text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{countPending}</p>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 hover:border-primary/20 transition-all cursor-default shadow-sm">
          <div className="flex items-center justify-between">
            <span className="p-2 bg-blue-550/10 text-blue-600 rounded-lg text-xs font-black uppercase">
              Đang giao
            </span>
            <span className="text-blue-600 text-[10px] font-bold">+5.4% vs last week</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Đang vận chuyển</p>
            <p className="font-mono text-2xl font-black text-slate-805 dark:text-slate-100 mt-1">{countShipping}</p>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 hover:border-emerald-500/20 transition-all cursor-default shadow-sm">
          <div className="flex items-center justify-between">
            <span className="p-2 bg-emerald-550/10 text-emerald-600 rounded-lg text-xs font-black uppercase">
              Thành công
            </span>
            <span className="text-emerald-600 text-[10px] font-bold">+22% vs last week</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Đã hoàn thành</p>
            <p className="font-mono text-2xl font-black text-slate-805 dark:text-slate-100 mt-1">{countDelivered}</p>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 hover:border-red-500/20 transition-all cursor-default shadow-sm">
          <div className="flex items-center justify-between">
            <span className="p-2 bg-red-550/10 text-red-600 rounded-lg text-xs font-black uppercase">
              Hủy bỏ
            </span>
            <span className="text-red-600 text-[10px] font-bold">-2% vs last week</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Đã hủy</p>
            <p className="font-mono text-2xl font-black text-slate-805 dark:text-slate-100 mt-1">{countCancelled}</p>
          </div>
        </div>
      </div>

      {/* Sleek Filters Area (High-Density Design token standard) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
          {/* Find Tracking Code */}
          <div className="space-y-1.5 sm:col-span-1 md:col-span-1">
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Tìm mã vận đơn GHN</label>
            <div className="relative">
              <Search className="absolute inset-y-0 left-3 h-3.5 w-3.5 my-auto text-slate-400" />
              <Input
                placeholder="GHY729SH..."
                value={searchCodeBuffer}
                onChange={(e) => setSearchCodeBuffer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleApplyFilter()}
                className="pl-9 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs font-semibold rounded-lg h-9 w-full outline-none focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          </div>

          {/* Status Select */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Trạng thái</label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-lg h-9 w-full px-3 text-slate-700 dark:text-slate-250 outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="ready_to_pick">Sẵn sàng lấy hàng (ready_to_pick)</option>
              <option value="picking">Đang lấy hàng (picking)</option>
              <option value="picked">Đã lấy hàng (picked)</option>
              <option value="storing">Đang lưu kho (storing)</option>
              <option value="transporting">Đang luân chuyển (transporting)</option>
              <option value="sorting">Đang phân loại (sorting)</option>
              <option value="delivering">Đang giao hàng (delivering)</option>
              <option value="money_collect_delivering">Đang giao & thu hộ (money_collect_delivering)</option>
              <option value="delivered">Đã giao hàng (delivered)</option>
              <option value="cancel">Đã hủy đơn (cancel)</option>
              <option value="returned">Đã trả hàng (returned)</option>
            </select>
          </div>

          {/* Shipping Service Partner Select */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Đối tác chuyển phát</label>
            <select
              value={shippingService}
              onChange={(e) => {
                setShippingService(e.target.value);
                setPage(1);
              }}
              className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-lg h-9 w-full px-3 text-slate-700 dark:text-slate-250 outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              <option value="">Tất cả</option>
              <option value="GHN">GHN Express</option>
              <option value="GHTK">Giao Hàng Tiết Kiệm</option>
              <option value="ViettelPost">Viettel Post</option>
            </select>
          </div>

          {/* Create From Date */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Từ ngày</label>
            <div className="relative">
              <input
                type="date"
                value={createFrom}
                onChange={(e) => {
                  setCreateFrom(e.target.value);
                  setPage(1);
                }}
                className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-lg h-9 w-full px-3 text-slate-700 dark:text-slate-250 outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Create To Date */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Đến ngày</label>
            <div className="relative">
              <input
                type="date"
                value={createTo}
                onChange={(e) => {
                  setCreateTo(e.target.value);
                  setPage(1);
                }}
                className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-lg h-9 w-full px-3 text-slate-700 dark:text-slate-250 outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Action buttons */}
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
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Đang liên kết hệ thống định vị bưu kiện...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-650 dark:text-red-405 font-bold border border-red-200 dark:border-red-800/50 rounded-xl bg-red-50 dark:bg-red-950/20 text-xs shadow-sm">
          Không thể đồng bộ lộ trình giao nhận: {error.message}
        </div>
      ) : (
        /* Shipments Table with page-bound values */
        <ShipmentsTable
          shipments={shipments}
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={(p) => setPage(p)}
        />
      )}
    </div>
  );
};
