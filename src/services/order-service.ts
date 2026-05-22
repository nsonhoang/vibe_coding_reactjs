import { api } from "@/lib/api-client";
import type { PaginatedResult } from "./book-service";

export interface OrderItemDetail {
  id: string;
  bookId: string;
  quantity: number;
  price: number;
  book: {
    title: string;
    thumbnail?: string;
  };
}

export interface Order {
  id: string;
  code: string;
  totalPrice: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  paymentMethod: "COD" | "VNPAY";
  createdAt: string;
  shippingAddress: string;
  shippingPhone: string;
  customerName: string;
  note?: string;
  items: OrderItemDetail[];
  shipment?: {
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
