import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Ticket, 
  Book, 
  Tags, 
  ShoppingCart, 
  TrendingDown, 
  Package, 
  Truck, 
  LogOut, 
  User, 
  Sun, 
  Moon,
  Menu,
  X
} from "lucide-react";

import { SidebarNav, type MenuSection } from "@/components/layout/sidebar-nav";

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  // Apply dark class to documentElement (Tailwind CSS v4 standard)
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => setDarkMode(prev => !prev), []);

  const sections = useMemo<MenuSection[]>(() => {
    return user?.role === "ADMIN" 
      ? [
          {
            title: "Quản trị hệ thống",
            items: [
              { name: "Tổng quan Admin", path: "/admin/dashboard", icon: LayoutDashboard },
              { name: "Người dùng", path: "/admin/users", icon: Users },
              { name: "Phân quyền", path: "/admin/roles", icon: ShieldCheck },
              { name: "Mã giảm giá", path: "/admin/vouchers", icon: Ticket },
            ]
          },
          {
            title: "Hoạt động Cửa hàng",
            items: [
              { name: "Quản lý sách", path: "/staff/books", icon: Book },
              { name: "Thể loại & Tác giả", path: "/staff/categories", icon: Tags },
              { name: "Đơn hàng", path: "/staff/orders", icon: ShoppingCart },
              { name: "Chương trình ưu đãi", path: "/staff/promotions", icon: TrendingDown },
              { name: "Quản lý kho", path: "/staff/inventory", icon: Package },
              { name: "Vận chuyển", path: "/staff/shipments", icon: Truck },
            ]
          }
        ]
      : [
          {
            title: "Hoạt động Cửa hàng",
            items: [
              { name: "Tổng quan Staff", path: "/staff/dashboard", icon: LayoutDashboard },
              { name: "Quản lý sách", path: "/staff/books", icon: Book },
              { name: "Thể loại & Tác giả", path: "/staff/categories", icon: Tags },
              { name: "Đơn hàng", path: "/staff/orders", icon: ShoppingCart },
              { name: "Chương trình ưu đãi", path: "/staff/promotions", icon: TrendingDown },
              { name: "Quản lý kho", path: "/staff/inventory", icon: Package },
              { name: "Vận chuyển", path: "/staff/shipments", icon: Truck },
            ]
          }
        ];
  }, [user]);

  const menuItems = useMemo(() => sections.flatMap(sec => sec.items), [sections]);

  const handleLogout = useCallback(async () => {
    await logout();
    navigate("/login");
  }, [logout, navigate]);

  const getActiveTitle = useCallback(() => {
    const activeItem = menuItems.find(item => item.path === location.pathname);
    if (activeItem) return activeItem.name;
    if (location.pathname.includes("/books")) return "Chi tiết sách";
    if (location.pathname.includes("/orders")) return "Chi tiết đơn hàng";
    return "Hệ thống Quản trị";
  }, [menuItems, location.pathname]);

  const handleCloseMobile = useCallback(() => setMobileOpen(false), []);
  const handleToggleMobile = useCallback(() => setMobileOpen(prev => !prev), []);

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-sky-50/60 via-slate-50 to-sky-50/30 dark:from-background dark:via-background dark:to-background/95 text-foreground transition-colors duration-300">
      
      {/* SIDEBAR FOR DESKTOP */}
      <aside className="fixed bottom-0 top-0 left-0 z-30 hidden w-64 border-r border-border/80 bg-card/65 backdrop-blur-xl p-5 md:block">
        <div className="flex h-full flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 px-2 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-wide">E-BOOK STORE</span>
                <span className="text-[10px] font-semibold text-primary tracking-wider uppercase">
                  Portal: {user?.role}
                </span>
              </div>
            </div>

            <SidebarNav sections={sections} pathname={location.pathname} />
          </div>

          <div className="border-t border-border/60 pt-4 space-y-4">
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary">
                <User className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col max-w-[150px]">
                <span className="truncate text-xs font-bold">{user?.fullName || "Nhân viên"}</span>
                <span className="truncate text-[10px] text-muted-foreground">{user?.email || "staff@bookstore.com"}</span>
              </div>
            </div>
            <Button
              variant="destructive"
              size="xs"
              onClick={handleLogout}
              className="w-full justify-center gap-2"
            >
              <LogOut className="h-3.5 w-3.5" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER & BAR */}
      <header className="fixed top-0 right-0 left-0 z-40 flex h-14 items-center justify-between border-b border-border/80 bg-background/80 backdrop-blur-md px-4 md:hidden">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleToggleMobile}
            className="md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-xs font-bold">E-BOOK Portal</span>
          </div>
        </div>
        <Button variant="ghost" size="icon-xs" onClick={toggleDarkMode}>
          {darkMode ? <Sun className="h-4.5 w-4.5 text-yellow-500" /> : <Moon className="h-4.5 w-4.5 text-slate-700" />}
        </Button>
      </header>

      {/* MOBILE DRAWER SIDEBAR */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden animate-in fade-in duration-200">
          <div className="fixed inset-0 bg-background/85 backdrop-blur-sm" onClick={handleCloseMobile} />
          <aside className="relative flex w-64 flex-col justify-between border-r border-border bg-card p-5 animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wide">E-BOOK STORE</span>
                <Button variant="ghost" size="icon-xs" onClick={handleCloseMobile}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <SidebarNav sections={sections} pathname={location.pathname} onItemClick={handleCloseMobile} />
            </div>
            <div className="border-t border-border pt-4">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-center gap-2 animate-pulse"
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col md:pl-64">
        {/* Desktop Top Header Bar */}
        <header className="sticky top-0 z-20 hidden h-14 items-center justify-between border-b border-border/60 bg-background/80 backdrop-blur-md px-8 md:flex">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold tracking-tight text-foreground transition-all duration-300">
              {getActiveTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={toggleDarkMode}
              className="rounded-full hover:bg-accent/80 text-muted-foreground hover:text-foreground"
              title={darkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
            >
              {darkMode ? <Sun className="h-4.5 w-4.5 text-yellow-500 animate-spin-slow" /> : <Moon className="h-4.5 w-4.5 text-primary" />}
            </Button>
            
            {/* Divider */}
            <div className="h-4.5 w-px bg-border/60" />

            {/* Profile Brief Info */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold">{user?.fullName}</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary tracking-wide uppercase border border-primary/20">
                {user?.role}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 pt-18 md:p-8 md:pt-6">
          <div className="mx-auto max-w-7xl animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
