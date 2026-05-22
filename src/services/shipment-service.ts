import { api } from "@/lib/api-client";
import type { PaginatedResult } from "./book-service";

export interface Shipment {
  id: string;
  orderId: string;
  courier: string;
  trackingCode: string;
  destination: string;
  status: "IN_TRANSIT" | "DELIVERED" | "PICKING_UP" | string;
  estDate?: string;
  shippingFee: number;
  codAmount: number;
  createdAt: string;
  updatedAt: string;
  order: {
    code: string;
    customerName: string;
    shippingPhone: string;
  };
}

export interface ShipmentListResponse {
  success: boolean;
  message?: string;
  data: PaginatedResult<Shipment>;
}

export const shipmentService = {
  getShipments: async (params?: {
    page?: number;
    limit?: number;
    orderId?: string;
    ghnOrderCode?: string;
    status?: string;
    shippingService?: string;
  }): Promise<ShipmentListResponse> => {
    const response = await api.get<ShipmentListResponse>("/v1/shipments", { params });
    return response.data;
  },

  getShipmentByOrderId: async (orderId: string): Promise<Shipment | null> => {
    const response = await api.get<Shipment | null>(`/v1/shipments/order/${orderId}`);
    return response.data;
  },

  getShipmentById: async (id: string): Promise<Shipment | null> => {
    const response = await api.get<Shipment | null>(`/v1/shipments/${id}`);
    return response.data;
  },
};
