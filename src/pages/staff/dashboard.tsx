import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ShoppingCart, Package, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StaffStatsCards } from "@/components/staff-dashboard/staff-stats-cards";
import { FulfillmentChart } from "@/components/staff-dashboard/fulfillment-chart";
import { PendingOrders } from "@/components/staff-dashboard/pending-orders";
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

  const orders = ordersData?.data?.items || [];
  const books = booksData?.data?.items || [];
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
      {/* 4 Operations Stats Cards */}
      <StaffStatsCards
        pendingOrdersCount={pendingOrdersCount}
        lowStockCount={lowStockCount}
        inTransitCount={inTransitCount}
        totalBooksCount={totalBooksCount}
      />

      {/* Chart Section */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Fulfillment area chart */}
        <div className="md:col-span-2">
          <FulfillmentChart />
        </div>

        {/* Quick Operations panel */}
        <Card className="border-border bg-card/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xs font-bold uppercase tracking-wider">Lối tắt vận hành nhanh</CardTitle>
            <CardDescription className="text-[11px]">Các nghiệp vụ nhân viên thường thực hiện</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 pt-2">
            <Button 
              variant="outline" 
              onClick={() => navigate("/staff/books")}
              className="w-full justify-start text-xs font-bold gap-3 h-10 hover:border-primary/40 hover:bg-primary/5 cursor-pointer"
            >
              <BookOpen className="h-4.5 w-4.5 text-primary" />
              Đăng bán sách mới
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/staff/orders")}
              className="w-full justify-start text-xs font-bold gap-3 h-10 hover:border-primary/40 hover:bg-primary/5 cursor-pointer"
            >
              <ShoppingCart className="h-4.5 w-4.5 text-primary" />
              Kiểm tra & duyệt đơn hàng
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/staff/inventory")}
              className="w-full justify-start text-xs font-bold gap-3 h-10 hover:border-primary/40 hover:bg-primary/5 cursor-pointer"
            >
              <Package className="h-4.5 w-4.5 text-primary" />
              Cập nhật thẻ kho
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Pending Orders Action List */}
      <PendingOrders
        orders={pendingOrders.slice(0, 5)}
        onViewAll={() => navigate("/staff/orders")}
        onProcessOrder={handleProcessOrder}
      />
    </div>
  );
};
