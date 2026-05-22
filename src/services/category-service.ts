import { api } from "@/lib/api-client";

export interface Category {
  id: string;
  name: string;
  _count?: {
    books: number;
  };
}

export interface CategoryListResponse {
  success: boolean;
  message?: string;
  data: Category[];
}

export interface CategoryResponse {
  success: boolean;
  message?: string;
  data: Category;
}

export const categoryService = {
  getCategories: async (): Promise<CategoryListResponse> => {
    const response = await api.get<CategoryListResponse>("/v1/categories");
    return response.data;
  },

  getCategoryById: async (id: string): Promise<CategoryResponse> => {
    const response = await api.get<CategoryResponse>(`/v1/categories/${id}`);
    return response.data;
  },

  createCategory: async (data: { name: string }): Promise<CategoryResponse> => {
    const response = await api.post<CategoryResponse>("/v1/categories", data);
    return response.data;
  },

  updateCategory: async (id: string, data: { name: string }): Promise<CategoryResponse> => {
    const response = await api.patch<CategoryResponse>(`/v1/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/v1/categories/${id}`);
  },
};
