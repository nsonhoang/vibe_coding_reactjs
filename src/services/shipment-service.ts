import { api } from "@/lib/api-client";
import type { PaginatedResult } from "./book-service";

export interface Shipment {
  id: string;
  orderId: string;
  ghnOrderCode?: string | null;
  shippingService: string;
  status: string;
  codAmount: number;
  shippingFee: number;
  expectedDelivery?: string | null;
  deliveredAt?: string | null;
  shippedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  order?: {
    id: string;
    code: string;
    status: string;
    paymentMethod: string;
    subtotalAmount: number;
    discountAmount: number;
    shippingFee: number;
    totalAmount: number;
    shippingName: string;
    shippingPhone: string;
    shippingAddress: string;
    shippingWard: string;
    shippingWardCode?: string | null;
    shippingDistrict: string;
    shippingDistrictId?: number | null;
    shippingCity: string;
    shippingCountry: string;
    note?: string | null;
    createdAt: string;
    updatedAt: string;
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
    createFrom?: string;
    createTo?: string;
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
