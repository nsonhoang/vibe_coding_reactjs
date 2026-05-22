import axios from "axios";
import { useAuthStore } from "@/store/auth-store";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Lấy hoặc sinh duy nhất x-device-id cho thiết bị và lưu ở localStorage
export function getDeviceId(): string {
  let deviceId = localStorage.getItem("dashboard_device_id");
  if (!deviceId) {
    deviceId = "dev-" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem("dashboard_device_id", deviceId);
  }
  return deviceId;
}

// Đọc cookie (dùng cho csrfToken nếu cần thiết)
export function getCookie(name: string): string {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || "";
  return "";
}

// Tạo Axios Instance chính
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Cho phép đính kèm HttpOnly cookies (refreshToken)
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor cho Request: đính kèm Bearer token, device ID và csrfToken
api.interceptors.request.use(
  (config) => {
    const deviceId = getDeviceId();
    config.headers["x-device-id"] = deviceId;

    const authStore = useAuthStore.getState();
    const token = authStore.accessToken;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Đính kèm CSRF token cho cổng Refresh Token
    if (config.url?.includes("/v1/auth/refresh-token")) {
      const csrfToken = authStore.csrfToken || localStorage.getItem("dashboard_csrf_token") || getCookie("csrfToken");
      if (csrfToken) {
        config.headers["x-csrf-token"] = csrfToken;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor cho Response: xử lý lỗi 401 tự động Refresh Token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Tránh vòng lặp vô hạn khi chính cổng refresh bị 401
    if (originalRequest.url?.includes("/v1/auth/refresh-token")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const authStore = useAuthStore.getState();
      try {
        const refreshed = await authStore.refresh();
        if (refreshed) {
          const newToken = useAuthStore.getState().accessToken;
          processQueue(null, newToken);
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        authStore.logout();
        return Promise.reject(new Error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại."));
      } finally {
        isRefreshing = false;
      }
    }

    // Standardize error message
    const errorMsg = error.response?.data?.message || error.response?.data?.errors?.join(", ") || error.message || "Lỗi hệ thống";
    return Promise.reject(new Error(errorMsg));
  }
);

// Backward-compatibility wrapper for any legacy fetch logic
export async function apiFetch<T>(path: string, options: any = {}): Promise<T> {
  const method = options.method || "GET";
  const data = options.body ? JSON.parse(options.body) : undefined;
  
  const response = await api.request({
    url: path,
    method,
    data,
  });

  return response.data as T;
}
