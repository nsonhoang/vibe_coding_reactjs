import { api } from "@/lib/api-client";
import type { PaginatedResult } from "./book-service";

export interface OrderItemDetail {
  id: string;
  orderId: string;
  bookId: string;
  bookTitle: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  totalAmount: number;
  createdAt?: string;
  updatedAt?: string;
  price?: number;
  book?: {
    title: string;
    thumbnail?: string;
  };
}

export interface Order {
  id: string;
  code: string;
  subtotalAmount: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  totalPrice?: number; // legacy fallback
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNING" | "REFUNDED";
  paymentMethod: "COD" | "VNPAY";
  createdAt: string;
  updatedAt: string;
  shippingName: string;
  customerName?: string; // legacy fallback
  shippingPhone: string;
  shippingAddress: string;
  shippingWard: string;
  shippingWardCode?: string | null;
  shippingDistrict: string;
  shippingDistrictId?: number | null;
  shippingCity: string;
  shippingCountry: string;
  note?: string | null;
  items: OrderItemDetail[];
  shipment?: {
    id?: string;
    ghnOrderCode?: string;
    shippingService?: string;
    status?: string;
    codAmount?: number;
    shippingFee?: number;
    expectedDelivery?: string;
    courier?: string;
    trackingCode?: string;
  };
}

export interface OrderListResponse {
  success: boolean;
  message?: string;
  data: PaginatedResult<Order>;
}

export interface OrderResponse {
  success: boolean;
  message?: string;
  data: Order;
}

export const orderService = {
  getOrders: async (params?: {
    page?: number;
    limit?: number;
    userId?: string;
    createFrom?: string;
    createTo?: string;
    paymentMethod?: "COD" | "VNPAY";
    status?: "PENDING" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED";
    code?: string;
    keyword?: string;
  }): Promise<OrderListResponse> => {
    const response = await api.get<OrderListResponse>("/v1/orders", { params });
    return response.data;
  },

  getOrderById: async (id: string): Promise<OrderResponse> => {
    const response = await api.get<OrderResponse>(`/v1/orders/me/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id: string, status: Order["status"]): Promise<OrderResponse> => {
    const response = await api.patch<OrderResponse>(`/v1/orders/${id}/status`, { status });
    return response.data;
  },
};
