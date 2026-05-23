import { api } from "@/lib/api-client";
import type { PaginatedResult } from "./book-service";

export interface Voucher {
  id: string;
  code: string;
  description?: string;
  discountType: "FIXED_AMOUNT" | "PERCENTAGE";
  discountValue: number;
  maxDiscount?: number;
  minOrderValue: number;
  usageLimit?: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface VoucherListResponse {
  success: boolean;
  message?: string;
  data: PaginatedResult<Voucher>;
}

export interface VoucherResponse {
  success: boolean;
  message?: string;
  data: Voucher;
}

export const voucherService = {
  getVouchers: async (params?: {
    page?: number;
    limit?: number;
    keyword?: string;
    isActive?: boolean;
    now?: boolean;
    sortBy?: "createdAt" | "code" | "startDate" | "endDate" | "usedCount";
    sortOrder?: "asc" | "desc";
  }): Promise<VoucherListResponse> => {
    const response = await api.get<VoucherListResponse>("/v1/vouchers", { params });
    return response.data;
  },

  getVoucherById: async (id: string): Promise<VoucherResponse> => {
    const response = await api.get<VoucherResponse>(`/v1/vouchers/${id}`);
    return response.data;
  },

  createVoucher: async (data: {
    code: string;
    description?: string;
    discountType: "FIXED_AMOUNT" | "PERCENTAGE";
    discountValue: number;
    maxDiscount?: number;
    minOrderValue: number;
    usageLimit?: number;
    startDate: string;
    endDate: string;
    isActive?: boolean;
  }): Promise<VoucherResponse> => {
    const response = await api.post<VoucherResponse>("/v1/vouchers", data);
    return response.data;
  },

  updateVoucher: async (id: string, data: {
    description?: string;
    usageLimit?: number;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
  }): Promise<VoucherResponse> => {
    const response = await api.patch<VoucherResponse>(`/v1/vouchers/${id}`, data);
    return response.data;
  },

  deleteVoucher: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/v1/vouchers/${id}`);
    return response.data;
  },
};
