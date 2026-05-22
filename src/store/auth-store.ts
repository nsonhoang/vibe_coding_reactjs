import { create } from "zustand";
import { apiFetch } from "@/lib/api-client";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string; // 'ADMIN' hoặc 'STAFF'
  isActive: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  csrfToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refresh: () => Promise<boolean>;
  fetchProfile: () => Promise<User>;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  csrfToken: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      // 1. Gọi API đăng nhập
      const response = await apiFetch<{
        data: {
          accessToken: string;
          csrfToken: string;
          expiresAt: string;
          tokenType: string;
        };
      }>("/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, deviceOs: "web" }),
        skipAuth: true,
      });

      const { accessToken, csrfToken } = response.data;
      set({ accessToken, csrfToken, isAuthenticated: true });

      // 2. Lấy thông tin chi tiết Profile và Role
      const profileResponse = await apiFetch<{
        data: {
          id: string;
          email: string;
          fullName: string;
          role?: { name: string } | string;
          isActive: boolean;
        };
      }>("/v1/users/profile");

      const rawUser = profileResponse.data;
      let roleName = "STAFF"; // mặc định là STAFF
      if (rawUser.role) {
        roleName = typeof rawUser.role === "string" ? rawUser.role : (rawUser.role.name || "STAFF");
      }

      const user: User = {
        id: rawUser.id,
        email: rawUser.email,
        fullName: rawUser.fullName,
        role: roleName.toUpperCase(),
        isActive: rawUser.isActive,
      };

      set({ user, isLoading: false });
      
      // Lưu lại vào localStorage để đồng bộ phiên làm việc nhanh
      localStorage.setItem("dashboard_authenticated", "true");
      localStorage.setItem("dashboard_user_role", user.role);
      localStorage.setItem("dashboard_csrf_token", csrfToken);

      return user;
    } catch (error) {
      set({ user: null, accessToken: null, csrfToken: null, isAuthenticated: false, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      // Gọi API đăng xuất nếu backend hỗ trợ
      await apiFetch("/v1/auth/logout", { method: "POST" }).catch(() => {});
    } finally {
      set({ user: null, accessToken: null, csrfToken: null, isAuthenticated: false });
      localStorage.removeItem("dashboard_authenticated");
      localStorage.removeItem("dashboard_user_role");
      localStorage.removeItem("dashboard_csrf_token");
    }
  },

  refresh: async () => {
    try {
      const response = await apiFetch<{
        data: {
          accessToken: string;
          csrfToken: string;
        };
      }>("/v1/auth/refresh-token", {
        method: "POST",
      });

      const { accessToken, csrfToken } = response.data;
      set({ accessToken, csrfToken, isAuthenticated: true });
      localStorage.setItem("dashboard_csrf_token", csrfToken);
      return true;
    } catch (error) {
      console.warn("Không thể refresh token:", error);
      get().logout();
      return false;
    }
  },

  fetchProfile: async () => {
    const profileResponse = await apiFetch<{
      data: {
        id: string;
        email: string;
        fullName: string;
        role?: { name: string } | string;
        isActive: boolean;
      };
    }>("/v1/users/profile");

    const rawUser = profileResponse.data;
    let roleName = "STAFF";
    if (rawUser.role) {
      roleName = typeof rawUser.role === "string" ? rawUser.role : (rawUser.role.name || "STAFF");
    }

    const user: User = {
      id: rawUser.id,
      email: rawUser.email,
      fullName: rawUser.fullName,
      role: roleName.toUpperCase(),
      isActive: rawUser.isActive,
    };

    set({ user, isAuthenticated: true });
    localStorage.setItem("dashboard_authenticated", "true");
    localStorage.setItem("dashboard_user_role", user.role);
    return user;
  },

  initAuth: async () => {
    // Nếu localStorage ghi nhận đã từng auth, hãy thử lấy profile (auto-login/refresh)
    const wasAuthenticated = localStorage.getItem("dashboard_authenticated") === "true";
    if (wasAuthenticated) {
      set({ isLoading: true });
      try {
        // Thử gọi profile để xem token cũ còn dùng được không, 
        // hoặc để kích hoạt interceptor 401 tự động refresh
        await get().fetchProfile();
      } catch (err) {
        console.warn("Không thể khôi phục phiên đăng nhập trước đó:", err);
        get().logout();
      } finally {
        set({ isLoading: false });
      }
    }
  }
}));
