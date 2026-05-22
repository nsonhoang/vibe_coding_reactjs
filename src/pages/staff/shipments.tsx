import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Truck, Loader2 } from "lucide-react";
import { ShipmentsTable } from "@/components/staff-shipments/shipments-table";
import { shipmentService } from "@/services/shipment-service";

export const StaffShipments: React.FC = () => {
  // 1. Fetch shipments from server
  const { data: shipmentsData, isLoading, error } = useQuery({
    queryKey: ["shipments"],
    queryFn: () => shipmentService.getShipments({ limit: 100 }),
  });

  const shipments = shipmentsData?.data?.items || [];

  return (
    <div className="space-y-6">
      {/* Shipment header */}
      <Card className="border-border bg-gradient-to-r from-sky-500/5 to-transparent">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider">Hành trình Giao vận</CardTitle>
            <CardDescription className="text-[11px]">
              Theo dõi bưu tá giao nhận và thời gian ước tính kiện hàng đến tay người nhận
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-20 space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-semibold">Đang liên kết hệ thống định vị bưu kiện...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-destructive font-semibold border border-destructive/20 rounded-md bg-destructive/5 text-xs">
          Không thể đồng bộ lộ trình giao nhận: {error.message}
        </div>
      ) : (
        /* Shipments Grid Table */
        <ShipmentsTable shipments={shipments} />
      )}
    </div>
  );
};
