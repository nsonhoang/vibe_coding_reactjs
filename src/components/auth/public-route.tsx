import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, user, isLoading, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse font-medium">Đang kiểm tra phiên đăng nhập...</p>
        </div>
      </div>
    );
  }

  const wasAuthenticated = localStorage.getItem("dashboard_authenticated") === "true";
  const storedRole = localStorage.getItem("dashboard_user_role");

  // Nếu người dùng đã đăng nhập, tự động điều hướng tới trang phù hợp với role của họ
  if (isAuthenticated || wasAuthenticated) {
    const role = user?.role || storedRole;
    if (role === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/staff/dashboard" replace />;
  }

  return <>{children}</>;
};
