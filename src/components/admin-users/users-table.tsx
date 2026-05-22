import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Ban, CheckCircle, Trash2 } from "lucide-react";
import type { UserResponseDto } from "@/services/user-service";

interface UsersTableProps {
  users: UserResponseDto[];
  onEdit: (user: UserResponseDto) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  return (
    <Card className="border-border bg-card/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xs font-bold uppercase tracking-wider">Quản lý người dùng</CardTitle>
        <CardDescription className="text-[11px]">Danh sách nhân viên, đối tác và tài khoản quản trị</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 text-muted-foreground pb-2 font-semibold">
                <th className="py-2.5">Tài khoản</th>
                <th className="py-2.5">Email</th>
                <th className="py-2.5">Quyền hạn</th>
                <th className="py-2.5">Ngày tạo</th>
                <th className="py-2.5">Trạng thái</th>
                <th className="py-2.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {users.map((user) => {
                const roleName = typeof user.role === "object" && user.role ? user.role.name : String(user.role || "");
                const formattedDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "N/A";

                return (
                  <tr key={user.id} className="hover:bg-accent/40 transition-colors">
                    <td className="py-3 font-bold text-foreground">{user.fullName || "Chưa thiết lập"}</td>
                    <td className="py-3 font-mono text-muted-foreground">{user.email}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold ${
                        roleName.toUpperCase().includes("ADMIN") 
                          ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                          : "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
                      }`}>
                        {roleName}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">{formattedDate}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        user.isActive 
                          ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" 
                          : "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-destructive"}`} />
                        {user.isActive ? "Hoạt động" : "Bị chặn"}
                      </span>
                    </td>
                    <td className="py-3 text-right space-x-1.5">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        type="button"
                        onClick={() => onEdit(user)}
                        title="Chỉnh sửa thông tin"
                        className="cursor-pointer"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        type="button"
                        onClick={() => onToggleStatus(user.id, user.isActive)}
                        className={`cursor-pointer ${user.isActive ? "text-amber-500 hover:text-amber-600 hover:bg-amber-500/10" : "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"}`}
                        title={user.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                      >
                        {user.isActive ? <Ban className="h-3.5 w-3.5" /> : <CheckCircle className="h-3.5 w-3.5" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        type="button"
                        onClick={() => onDelete(user.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                        title="Xóa tài khoản"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    Không tìm thấy tài khoản người dùng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
