import { api } from "@/lib/api-client";

export interface InventoryItem {
  id: string;
  bookId: string;
  stock: number;
  minAlert: number;
  book: {
    id: string;
    title: string;
    price: number;
    categories: { name: string }[];
  };
}

export interface InventoryLog {
  id: string;
  inventoryId: string;
  change: number;
  type: "IMPORT" | "EXPORT" | "ADJUST";
  reason?: string;
  createdAt: string;
}

export interface InventoryListResponse {
  success: boolean;
  message?: string;
  data: InventoryItem[];
}

export interface InventoryResponse {
  success: boolean;
  message?: string;
  data: InventoryItem;
}

export interface InventoryLogResponse {
  success: boolean;
  message?: string;
  data: InventoryLog;
}

export const inventoryService = {
  getInventory: async (): Promise<InventoryListResponse> => {
    const response = await api.get<InventoryListResponse>("/v1/inventory");
    return response.data;
  },

  getInventoryById: async (id: string): Promise<InventoryResponse> => {
    const response = await api.get<InventoryResponse>(`/v1/inventory/${id}`);
    return response.data;
  },

  createInventory: async (data: { bookId: string }): Promise<InventoryResponse> => {
    const response = await api.post<InventoryResponse>("/v1/inventory", data);
    return response.data;
  },

  createInventoryLog: async (data: {
    inventoryId: string;
    change: number;
    type: "IMPORT" | "EXPORT" | "ADJUST";
    reason?: string;
  }): Promise<InventoryLogResponse> => {
    const response = await api.post<InventoryLogResponse>("/v1/inventory/logs", data);
    return response.data;
  },

  deleteInventory: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/v1/inventory/${id}`);
    return response.data;
  },
};
