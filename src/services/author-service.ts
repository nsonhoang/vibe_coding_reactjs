import { api } from "@/lib/api-client";

export interface Author {
  id: string;
  name: string;
  dateOfBirth?: string;
  info?: string;
  nationality?: string;
  _count?: {
    books: number;
  };
}

export interface AuthorListResponse {
  success: boolean;
  message?: string;
  data: Author[];
}

export interface AuthorResponse {
  success: boolean;
  message?: string;
  data: Author;
}

export const authorService = {
  getAuthors: async (): Promise<AuthorListResponse> => {
    const response = await api.get<AuthorListResponse>("/v1/authors");
    return response.data;
  },

  getAuthorById: async (id: string): Promise<AuthorResponse> => {
    const response = await api.get<AuthorResponse>(`/v1/authors/${id}`);
    return response.data;
  },

  createAuthor: async (data: {
    name: string;
    dateOfBirth?: string;
    info?: string;
    nationality?: string;
  }): Promise<AuthorResponse> => {
    const response = await api.post<AuthorResponse>("/v1/authors", data);
    return response.data;
  },

  updateAuthor: async (id: string, data: {
    name?: string;
    dateOfBirth?: string;
    info?: string;
    nationality?: string;
  }): Promise<AuthorResponse> => {
    const response = await api.patch<AuthorResponse>(`/v1/authors/${id}`, data);
    return response.data;
  },

  deleteAuthor: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/v1/authors/${id}`);
    return response.data;
  },
};
