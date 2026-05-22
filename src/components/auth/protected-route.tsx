import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, user, isLoading, initAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse font-medium">Đang xác thực hệ thống...</p>
        </div>
      </div>
    );
  }

  // Nếu không đăng nhập, điều hướng về /login và ghi nhớ trang hiện tại
  const wasAuthenticated = localStorage.getItem("dashboard_authenticated") === "true";
  if (!isAuthenticated && !wasAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu đã đăng nhập nhưng không khớp Role, điều hướng về trang lỗi hoặc trang phù hợp
  if (user && allowedRoles && !allowedRoles.includes(user.role) && user.role !== "ADMIN") {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-background p-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-destructive">403</h1>
        <p className="mt-2 text-xl font-semibold">Quyền truy cập bị từ chối</p>
        <p className="mt-1 text-muted-foreground">Tài khoản của bạn không có quyền xem trang này.</p>
        <button
          onClick={() => {
            window.location.href = user.role === "ADMIN" ? "/admin" : "/staff";
          }}
          className="mt-6 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/95"
        >
          Quay lại Trang chủ
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
