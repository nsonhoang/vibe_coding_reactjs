import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Eye, Edit2, AlertOctagon, HelpCircle } from "lucide-react";

interface PermissionRow {
  module: string;
  description: string;
  adminAccess: "FULL" | "READ_ONLY" | "NONE";
  staffAccess: "FULL" | "READ_ONLY" | "NONE";
}

const permissions: PermissionRow[] = [
  { module: "Tài khoản & Phân quyền", description: "Tạo tài khoản, phân bổ nhóm quyền Admin/Staff", adminAccess: "FULL", staffAccess: "NONE" },
  { module: "Mã giảm giá (Vouchers)", description: "Cấu hình chương trình coupon toàn shop", adminAccess: "FULL", staffAccess: "NONE" },
  { module: "Nhật ký hệ thống (Audit Logs)", description: "Truy xuất log hoạt động của các thành viên", adminAccess: "FULL", staffAccess: "NONE" },
  { module: "Quản lý Sách", description: "Thêm, sửa, xóa thông tin sách, ảnh bìa sách", adminAccess: "FULL", staffAccess: "FULL" },
  { module: "Danh mục & Tác giả", description: "Quản lý danh mục sách và thông tin tác giả", adminAccess: "FULL", staffAccess: "FULL" },
  { module: "Đơn hàng & Giao nhận", description: "Theo dõi đơn hàng, cập nhật trạng thái vận chuyển", adminAccess: "FULL", staffAccess: "FULL" },
  { module: "Chương trình ưu đãi", description: "Cài đặt giảm giá trực tiếp trên từng đầu sách", adminAccess: "FULL", staffAccess: "FULL" },
  { module: "Kiểm kho (Inventory)", description: "Cập nhật số lượng nhập kho, theo dõi hàng tồn", adminAccess: "FULL", staffAccess: "FULL" },
];

export const AdminRoles: React.FC = () => {
  const getAccessBadge = (level: "FULL" | "READ_ONLY" | "NONE") => {
    switch (level) {
      case "FULL":
        return (
          <Badge className="bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-500/20 gap-1 text-[9px] uppercase tracking-wide">
            <ShieldCheck className="h-3 w-3" />
            Toàn quyền (CRUD)
          </Badge>
        );
      case "READ_ONLY":
        return (
          <Badge className="bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-500/20 gap-1 text-[9px] uppercase tracking-wide">
            <Eye className="h-3 w-3" />
            Chỉ đọc (Read)
          </Badge>
        );
      default:
        return (
          <Badge className="bg-destructive/10 border-destructive/20 text-destructive font-bold hover:bg-destructive/20 gap-1 text-[9px] uppercase tracking-wide">
            <AlertOctagon className="h-3 w-3" />
            Từ chối (None)
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Introduction Card */}
      <Card className="border-border bg-gradient-to-r from-sky-500/5 to-transparent">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider">Hệ thống phân quyền (RBAC)</CardTitle>
            <CardDescription className="text-[11px]">
              Quyền hạn truy cập các chức năng dựa trên vai trò người dùng (Role-Based Access Control)
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      {/* Permissions Table Card */}
      <Card className="border-border bg-card/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xs font-bold uppercase tracking-wider">Ma trận cấp quyền Module</CardTitle>
          <CardDescription className="text-[11px]">Bảng tra cứu chi tiết đặc quyền truy cập của Admin và Staff trên hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/80 text-muted-foreground pb-2 font-semibold">
                  <th className="py-2.5">Module hệ thống</th>
                  <th className="py-2.5">Chi tiết mô tả chức năng</th>
                  <th className="py-2.5">Quyền hạn ADMIN</th>
                  <th className="py-2.5">Quyền hạn STAFF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {permissions.map((p) => (
                  <tr key={p.module} className="hover:bg-accent/40 transition-colors">
                    <td className="py-3.5 font-bold text-foreground">{p.module}</td>
                    <td className="py-3.5 text-muted-foreground max-w-sm">{p.description}</td>
                    <td className="py-3.5">{getAccessBadge(p.adminAccess)}</td>
                    <td className="py-3.5">{getAccessBadge(p.staffAccess)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Help Note */}
      <div className="flex gap-2.5 items-start rounded-lg border border-border bg-card/10 p-4 text-xs">
        <HelpCircle className="h-4.5 w-4.5 shrink-0 text-primary" />
        <div className="space-y-1">
          <p className="font-bold">Mẹo cấu hình an toàn:</p>
          <p className="text-muted-foreground leading-relaxed">
            Các API của hệ thống e-commerce book được bảo mật bằng JWT và được xác thực tại cổng gateway NestJS. 
            Mọi thay đổi vai trò (Role Change) ở giao diện sẽ chỉ có hiệu lực khi token JWT mới được cấp lại thông qua luồng refresh token hoặc đăng nhập lại.
          </p>
        </div>
      </div>
    </div>
  );
};
