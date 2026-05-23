import { api } from "@/lib/api-client";
import type { PaginatedResult } from "./book-service";

export interface Promotion {
  id: string;
  name: string;
  discountRate: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  bookIds?: string[];
  bookCount?: number;
  books: { id: string; title: string; price: number }[];
}

export interface PromotionListResponse {
  success: boolean;
  message?: string;
  data: PaginatedResult<Promotion>;
}

export interface ActivePromotionsResponse {
  success: boolean;
  message?: string;
  data: Promotion[];
}

export interface PromotionResponse {
  success: boolean;
  message?: string;
  data: Promotion;
}

export const promotionService = {
  getPromotions: async (params?: {
    page?: number;
    limit?: number;
    keyword?: string;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
    now?: boolean;
  }): Promise<PromotionListResponse> => {
    const response = await api.get<PromotionListResponse>("/v1/promotions", { params });
    return response.data;
  },

  getActivePromotions: async (): Promise<ActivePromotionsResponse> => {
    const response = await api.get<ActivePromotionsResponse>("/v1/promotions/active");
    return response.data;
  },

  getPromotionById: async (id: string): Promise<PromotionResponse> => {
    const response = await api.get<PromotionResponse>(`/v1/promotions/${id}`);
    return response.data;
  },

  createPromotion: async (data: {
    name: string;
    discountRate: number;
    startDate: string;
    endDate: string;
    bookIds: string[];
  }): Promise<PromotionResponse> => {
    const response = await api.post<PromotionResponse>("/v1/promotions", data);
    return response.data;
  },

  updatePromotion: async (id: string, data: {
    name?: string;
    discountRate?: number;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
    bookIds?: string[];
  }): Promise<PromotionResponse> => {
    const response = await api.patch<PromotionResponse>(`/v1/promotions/${id}`, data);
    return response.data;
  },

  deletePromotion: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/v1/promotions/${id}`);
    return response.data;
  },

  notifyPromotion: async (id: string, data: { title: string; body: string }): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>(`/v1/promotions/${id}/notify`, data);
    return response.data;
  },
};
