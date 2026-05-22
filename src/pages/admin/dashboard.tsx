import React from "react";
import { StatsCards } from "@/components/admin-dashboard/stats-cards";
import { SalesAreaChart } from "@/components/admin-dashboard/sales-area-chart";
import { CategoriesBarChart } from "@/components/admin-dashboard/categories-bar-chart";
import { SystemLogsTable } from "@/components/admin-dashboard/system-logs-table";

const salesData = [
  { name: "T1", sales: 4000, orders: 240 },
  { name: "T2", sales: 3000, orders: 198 },
  { name: "T3", sales: 5000, orders: 310 },
  { name: "T4", sales: 8500, orders: 480 },
  { name: "T5", sales: 7000, orders: 390 },
  { name: "T6", sales: 9800, orders: 540 },
];

const categoryData = [
  { name: "Kinh tế", books: 120 },
  { name: "Văn học", books: 220 },
  { name: "Kỹ năng", books: 170 },
  { name: "Công nghệ", books: 95 },
  { name: "Ngoại ngữ", books: 80 },
];

const auditLogs = [
  { id: "LOG-001", user: "Nguyễn Văn A", action: "Thay đổi phân quyền STAFF", role: "ADMIN", ip: "192.168.1.5", time: "10 phút trước", status: "SUCCESS" },
  { id: "LOG-002", user: "Trần Thị B", action: "Khởi tạo mã giảm giá BOOK50", role: "ADMIN", ip: "192.168.1.12", time: "1 giờ trước", status: "SUCCESS" },
  { id: "LOG-003", user: "Lê Hoàng C", action: "Cập nhật trạng thái Đơn hàng #1034", role: "STAFF", ip: "10.0.0.4", time: "2 giờ trước", status: "SUCCESS" },
  { id: "LOG-004", user: "Hệ thống", action: "Gửi cảnh báo tồn kho thấp cho Book ID: 45", role: "SYSTEM", ip: "127.0.0.1", time: "3 giờ trước", status: "WARNING" },
  { id: "LOG-005", user: "Phạm Minh D", action: "Xóa tài khoản ID: 108", role: "ADMIN", ip: "192.168.1.5", time: "5 giờ trước", status: "SUCCESS" },
];

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 4 Stats Cards */}
      <StatsCards />

      {/* Chart Section */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Line / Area Chart */}
        <div className="md:col-span-2">
          <SalesAreaChart data={salesData} />
        </div>

        {/* Bar Chart */}
        <CategoriesBarChart data={categoryData} />
      </div>

      {/* Global System Logs */}
      <SystemLogsTable logs={auditLogs} />
    </div>
  );
};
