import { api } from "@/lib/api-client";

export interface PaginatedResult<T> {
  data: T[];
  items?: T[];
  meta: {
    totalItems?: number;
    itemCount?: number;
    itemsPerPage?: number;
    totalPages: number;
    currentPage?: number;
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface Book {
  id: string;
  title: string;
  description?: string;
  price: number;
  thumbnail?: string;
  status: BookStatus;
  categories: { id: string; name: string }[];
  authors: { id: string; name: string }[];
  images?: { id: string; url: string; publicId: string }[];
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

export type BookStatus = "ACTIVE" | "HIDDEN" | "DRAFT" | "ARCHIVED";
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
    file?: File;
    categoryId?: string[];
    authorId?: string[];
    status?: BookStatus
  }): Promise<BookResponse> => {
    const formData = new FormData();
    
    if (data.title !== undefined) formData.append("title", data.title);
    if (data.description !== undefined) formData.append("description", data.description || "");
    if (data.price !== undefined) formData.append("price", String(data.price));
    if (data.status !== undefined) formData.append("status", data.status);
    
   
    if (data.categoryId !== undefined) {
      data.categoryId.forEach((catId) => {
        formData.append("categoryId[]", catId);
      });
    }
    
    if (data.authorId !== undefined) {
      data.authorId.forEach((autId) => {
        formData.append("authorId[]", autId);
      });
    }
     if (data.file !== undefined) {
      formData.append("file", data.file);
    }
    
  
    const response = await api.patch<BookResponse>(`/v1/books/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteBook: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/v1/books/${id}`);
    return response.data;
  },
};
