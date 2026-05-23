import { api } from "@/lib/api-client";
import type { PaginatedResult } from "./book-service";


export interface UserResponseDto {
  id: string;
  email: string;
  name: string;
  phone?: string;
  status: UserStatus;
  role: { id: string; name: string } | string;
  createdAt: string;
}


export type UserStatus = "ACTIVE" | "INACTIVE";

export interface UserListResponse {
  success: boolean;
  message?: string;
  data: PaginatedResult<UserResponseDto>;
}

export interface UserDetailResponse {
  success: boolean;
  message?: string;
  data: UserResponseDto;
}

export const userService = {
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    keyword?: string;
    sortBy?: "createdAt" | "email" | "name";
    sortOrder?: "asc" | "desc";
  }): Promise<UserListResponse> => {
    const response = await api.get<UserListResponse>("/v1/users", { params });
    return response.data;
  },

  getUserById: async (id: string): Promise<UserDetailResponse> => {
    const response = await api.get<UserDetailResponse>(`/v1/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, data: {
    name?: string;
    phone?: string;
    roleId?: string;
    status?: UserStatus;
  }): Promise<UserDetailResponse> => {
    const response = await api.patch<UserDetailResponse>(`/v1/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/v1/users/${id}`);
    return response.data;
  },
};
export interface Role {
  id: string;
  name: string;
}

export interface RoleListResponse {
  success: boolean;
  message?: string;
  data: Role[];
}

export const roleService = {
  getRoles: async (): Promise<RoleListResponse> => {
    const response = await api.get<RoleListResponse>("/v1/roles");
    return response.data;
  },

  createRole: async (name: string): Promise<{ success: boolean; data: Role }> => {
    const response = await api.post<{ success: boolean; data: Role }>("/v1/roles", { name });
    return response.data;
  },

  deleteRole: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/v1/roles/${id}`);
    return response.data;
  },
};
