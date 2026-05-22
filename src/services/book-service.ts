import { api } from "@/lib/api-client";

export interface PaginatedResult<T> {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface Book {
  id: string;
  title: string;
  description?: string;
  price: number;
  thumbnail?: string;
  status: "ACTIVE" | "INACTIVE";
  categories: { id: string; name: string }[];
  authors: { id: string; name: string }[];
  createdAt: string;
}

export interface BookResponse {
  success: boolean;
  message?: string;
  data: Book;
}

export interface BookListResponse {
  success: boolean;
  message?: string;
  data: PaginatedResult<Book>;
}

export const bookService = {
  getBooks: async (params?: {
    page?: number;
    limit?: number;
    keyword?: string;
    categoryId?: string;
    authorId?: string;
    promotionId?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<BookListResponse> => {
    const response = await api.get<BookListResponse>("/v1/books", { params });
    return response.data;
  },

  getBookById: async (id: string): Promise<BookResponse> => {
    const response = await api.get<BookResponse>(`/v1/books/${id}`);
    return response.data;
  },

  createBook: async (formData: FormData): Promise<BookResponse> => {
    const response = await api.post<BookResponse>("/v1/books", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateBook: async (id: string, data: {
    title?: string;
    description?: string;
    price?: number;
    categoryId?: string[];
    authorId?: string[];
    status?: "ACTIVE" | "INACTIVE";
  }): Promise<BookResponse> => {
    const response = await api.patch<BookResponse>(`/v1/books/${id}`, data);
    return response.data;
  },

  deleteBook: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/v1/books/${id}`);
    return response.data;
  },
};
