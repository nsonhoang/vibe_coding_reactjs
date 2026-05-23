import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ShoppingCart, Package, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StaffStatsCards } from "@/components/staff-dashboard/staff-stats-cards";
import { FulfillmentChart } from "@/components/staff-dashboard/fulfillment-chart";
import { PendingOrders } from "@/components/staff-dashboard/pending-orders";
import { TopSellingBooks } from "@/components/staff-dashboard/top-selling-books";
import { orderService } from "@/services/order-service";
import { bookService } from "@/services/book-service";
import { inventoryService } from "@/services/inventory-service";

export const StaffDashboard: React.FC = () => {
  const navigate = useNavigate();

  // 1. Fetch Orders in parallel
  const { data: ordersData, isLoading: isLoadingOrders } = useQuery({
    queryKey: ["orders", "dashboard"],
    queryFn: () => orderService.getOrders({ limit: 100 }),
  });

  // 2. Fetch Books
  const { data: booksData, isLoading: isLoadingBooks } = useQuery({
    queryKey: ["books", "dashboard"],
    queryFn: () => bookService.getBooks({ limit: 100 }),
  });

  // 3. Fetch Inventory
  const { data: inventoryData, isLoading: isLoadingInventory } = useQuery({
    queryKey: ["inventory", "dashboard"],
    queryFn: () => inventoryService.getInventory(),
  });

  const orders = ordersData?.data?.data || ordersData?.data?.items || [];
  const books = booksData?.data?.data || booksData?.data?.items || [];
  const inventory = inventoryData?.data || [];

  // 4. Calculate Stats dynamically
  const pendingOrders = orders.filter((o) => o.status === "PENDING");
  const pendingOrdersCount = pendingOrders.length;
  const inTransitCount = orders.filter((o) => o.status === "SHIPPED" || o.status === "PROCESSING").length;
  const lowStockCount = inventory.filter((it) => it.stock <= it.minAlert).length;
  const totalBooksCount = books.length;

  const handleProcessOrder = () => {
    navigate("/staff/orders");
  };

  const isLoading = isLoadingOrders || isLoadingBooks || isLoadingInventory;

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground font-semibold">Đang tổng hợp báo cáo vận hành...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Operating Header Block */}
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/60 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-850 dark:text-white">Trung Tâm Điều Hành</h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Báo cáo hiệu suất đóng gói đơn hàng và giám sát vận hành thực tế</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-550 animate-pulse"></span>
          <span className="font-bold text-slate-500 dark:text-slate-400">Trạng thái: Hoạt động ổn định</span>
        </div>
      </div>

      {/* 4 Operations Stats Cards */}
      <StaffStatsCards
        pendingOrdersCount={pendingOrdersCount}
        lowStockCount={lowStockCount}
        inTransitCount={inTransitCount}
        totalBooksCount={totalBooksCount}
      />

      {/* Chart & Sidebar Row */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Fulfillment area chart */}
        <div className="md:col-span-2">
          <FulfillmentChart />
        </div>

        {/* Top Selling Books Sidebar */}
        <div className="md:col-span-1">
          <TopSellingBooks />
        </div>
      </div>

      {/* Quick Launchpad Shortcuts */}
      <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-base font-bold text-slate-850 dark:text-white">
            Lối Tắt Vận Hành Nhanh
          </CardTitle>
          <CardDescription className="text-xs text-slate-400 dark:text-slate-500">
            Các nghiệp vụ nhân viên thường thực hiện hàng ngày
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 grid gap-4 sm:grid-cols-3">
          <Button 
            variant="outline" 
            onClick={() => navigate("/staff/books")}
            className="justify-start text-xs font-bold gap-3 h-11 border-slate-200 dark:border-slate-800 hover:border-blue-500/40 hover:bg-blue-500/5 cursor-pointer w-full text-slate-700 dark:text-slate-250 rounded-xl transition-all duration-200"
          >
            <BookOpen className="h-4.5 w-4.5 text-[#00288e]" />
            Đăng bán sách mới
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate("/staff/orders")}
            className="justify-start text-xs font-bold gap-3 h-11 border-slate-200 dark:border-slate-800 hover:border-blue-500/40 hover:bg-blue-500/5 cursor-pointer w-full text-slate-700 dark:text-slate-250 rounded-xl transition-all duration-200"
          >
            <ShoppingCart className="h-4.5 w-4.5 text-[#00288e]" />
            Kiểm tra & duyệt đơn hàng
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate("/staff/inventory")}
            className="justify-start text-xs font-bold gap-3 h-11 border-slate-200 dark:border-slate-800 hover:border-blue-500/40 hover:bg-blue-500/5 cursor-pointer w-full text-slate-700 dark:text-slate-250 rounded-xl transition-all duration-200"
          >
            <Package className="h-4.5 w-4.5 text-[#00288e]" />
            Cập nhật thẻ kho
          </Button>
        </CardContent>
      </Card>

      {/* Pending Orders Action List */}
      <PendingOrders
        orders={pendingOrders.slice(0, 5)}
        onViewAll={() => navigate("/staff/orders")}
        onProcessOrder={handleProcessOrder}
      />
    </div>
  );
};
