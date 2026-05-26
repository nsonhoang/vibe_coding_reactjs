import React from "react";
import { CheckCircle, Clock, MapPin, Truck, ChevronLeft, ChevronRight, AlertTriangle, ArrowUpDown } from "lucide-react";
import type { Shipment } from "@/services/shipment-service";

interface ShipmentsTableProps {
  shipments: Shipment[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export const ShipmentsTable: React.FC<ShipmentsTableProps> = ({
  shipments,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-800">
              <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">
                Mã vận đơn
              </th>
              <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">
                Đơn hàng
              </th>
              <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">
                Đối tác vận chuyển
              </th>
              <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">
                Mã định vị
              </th>
              <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">
                Điểm đến
              </th>
              <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">
                Ngày nhận dự kiến
              </th>
              <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider text-right">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 dark:divide-slate-800/80">
            {shipments.map((shp) => {
              const estDateStr = shp.expectedDelivery
                ? new Date(shp.expectedDelivery).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : "Đang tính toán";

              const statusLower = (shp.status || "").toLowerCase();
              const isDelivered = statusLower === "delivered";
              const isInTransit = ["transporting", "sorting", "delivering", "money_collect_delivering", "in_transit"].includes(statusLower);
              const isCancelled = ["cancel", "cancelled", "canceled"].includes(statusLower);
              const isReturning = ["return", "returning", "returned"].includes(statusLower);

              const customerName = shp.order?.shippingName || "Khách ẩn";
              const destinationStr = shp.order
                ? `${shp.order.shippingAddress}, ${shp.order.shippingWard}, ${shp.order.shippingDistrict}, ${shp.order.shippingCity}`
                : "Chưa xác định";

              return (
                <tr
                  key={shp.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-850/30 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4 font-mono font-bold text-primary dark:text-primary-fixed-dim text-xs">
                    #{shp.id.substring(0, 8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">
                    #{shp.order?.code || shp.orderId.substring(0, 8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                        {customerName.substring(0, 2)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {customerName}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono font-bold">
                          {shp.order?.shippingPhone || "—"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-350 text-xs">
                    <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-250 font-bold uppercase tracking-wider text-[9px]">
                      {shp.shippingService || "GHN"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-black text-slate-805 dark:text-slate-105">
                        {shp.ghnOrderCode || "Chưa tạo mã"}
                      </span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 italic mt-0.5">
                        GHN Express
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                    <div className="flex items-center gap-1.5 max-w-[180px] truncate" title={destinationStr}>
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-450 dark:text-slate-500" />
                      <span className="font-semibold text-slate-600 dark:text-slate-350">{destinationStr}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-semibold">
                    {estDateStr}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {isDelivered ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        ĐÃ GIAO
                      </span>
                    ) : isInTransit ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        TRUNG CHUYỂN
                      </span>
                    ) : isCancelled ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold bg-red-500/10 text-red-600 dark:text-red-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        ĐÃ HỦY
                      </span>
                    ) : isReturning ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                        TRẢ HÀNG
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        {shp.status.replace(/_/g, " ")}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {shipments.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 text-xs font-bold">
                  Không tìm thấy bưu kiện nào khớp với bộ lọc.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            Đang hiển thị <span className="font-extrabold text-slate-700 dark:text-slate-350">{Math.min((currentPage - 1) * 10 + 1, totalItems)}</span>
            {" - "}
            <span className="font-extrabold text-slate-700 dark:text-slate-350">{Math.min(currentPage * 10, totalItems)}</span> trong tổng số{" "}
            <span className="font-extrabold text-primary dark:text-primary-fixed-dim">{totalItems}</span> bưu kiện
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-1.5 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => onPageChange(pg)}
                className={`w-7.5 h-7.5 rounded text-xs font-extrabold transition-all cursor-pointer ${
                  currentPage === pg
                    ? "bg-primary text-white shadow-sm shadow-primary/20"
                    : "border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                {pg}
              </button>
            ))}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-1.5 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
