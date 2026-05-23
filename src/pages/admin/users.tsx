import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  UserPlus, 
  Loader2, 
  Send,
  UserCheck,
  Ticket,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus,
  Megaphone
} from "lucide-react";
import { UsersTable } from "@/components/admin-users/users-table";
import { UserDialog } from "@/components/admin-users/user-dialog";
import type { UserResponseDto, UserStatus } from "@/services/user-service";

import { roleService, userService } from "@/services/user-service";

export const AdminUsers: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editingUser, setEditingUser] = useState<UserResponseDto | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);

  // Form states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);

  // Debouncing search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 1. Fetch Users
  const { data: usersResponse, isLoading: isLoadingUsers, error: usersError } = useQuery({
    queryKey: ["users", debouncedSearch],
    queryFn: () => userService.getUsers({ keyword: debouncedSearch, limit: 100 }),
  });

  // 2. Fetch Roles
  const { data: rolesResponse, isLoading: isLoadingRoles } = useQuery({
    queryKey: ["roles"],
    queryFn: () => roleService.getRoles(),
  });

  const roles = rolesResponse?.data || [];
  const users = usersResponse?.data?.data || [];

  // 4. Update User Mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; phone?: string; roleId?: string; status?: UserStatus } }) => 
      userService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsDialogOpen(false);
    },
    onError: (err: any) => {
      alert(`Không thể cập nhật tài khoản: ${err.response?.data?.message || err.message}`);
    },
  });

  // 5. Delete User Mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      alert("Xóa tài khoản người dùng thành công!");
    },
    onError: (err: any) => {
      alert(`Không thể xóa tài khoản: ${err.response?.data?.message || err.message}`);
    },
  });

  // Mở Dialog Thêm mới
  const handleOpenAdd = () => {
    setIsAddMode(true);
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    // Chọn role đầu tiên làm mặc định nếu có
    setFormRole(roles[0]?.id || "");
    setFormIsActive(true);
    setIsDialogOpen(true);
  };

  // Mở Dialog Chỉnh sửa
  const handleOpenEdit = (user: UserResponseDto) => {
    setIsAddMode(false);
    setEditingUser(user);
    setFormName(user.name || "");
    setFormEmail(user.email);
    setFormPhone(user.phone || "");
    // Lấy role ID từ object hoặc string
    const roleId = typeof user.role === "object" && user.role ? user.role.id : String(user.role || "");
    setFormRole(roleId);
    setFormIsActive(user.status === "ACTIVE");
    setIsDialogOpen(true);
  };

  // Lưu thông tin từ Dialog
  const handleSave = () => {
    if (!formName || !formEmail || !formRole) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (isAddMode) {
      console.log("Add mode is not supported yet");
    } else if (editingUser) {
      updateUserMutation.mutate({
        id: editingUser.id,
        data: {
          name: formName,
          phone: formPhone || undefined,
          roleId: formRole,
          status: formIsActive ? "ACTIVE" : "INACTIVE",
        },
      });
    }
  };

  // Thay đổi trạng thái tài khoản (Block / Active)
  const toggleUserStatus = (id: string, currentStatus: boolean) => {
    updateUserMutation.mutate({
      id,
      data: {
        status: !currentStatus ? "ACTIVE" : "INACTIVE",
      },
    });
  };

  // Xóa tài khoản bằng API thực tế
  const handleDeleteUser = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản người dùng này không? Hành động này không thể hoàn tác.")) {
      deleteUserMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <h2 className="font-extrabold text-2xl tracking-tight text-primary dark:text-primary-fixed-dim">Quản trị Hệ thống</h2>
          <p className="text-xs text-slate-500 mt-1.5">Quản lý tài khoản người dùng và các chương trình khuyến mãi hiện hành.</p>
        </div>
        <div className="flex gap-2.5">
          <Button 
            variant="outline"
            className="flex items-center gap-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold shadow-sm h-9 cursor-pointer"
            onClick={() => alert("Gửi thông báo broadcast hệ thống...")}
          >
            <Send className="h-3.5 w-3.5" />
            Gửi thông báo
          </Button>
          <Button 
            onClick={() => navigate("/admin/vouchers")}
            className="flex items-center gap-2 bg-[#00288e] hover:bg-[#00288e]/95 text-white text-xs font-bold shadow-md shadow-[#00288e]/10 h-9 cursor-pointer rounded-lg"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Tạo Voucher mới
          </Button>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850/20">
          <button className="flex-1 py-4 px-6 font-bold text-xs text-primary dark:text-primary-fixed-dim border-b-2 border-primary dark:border-primary-fixed-dim transition-all cursor-pointer">
            Người dùng
          </button>
          <button 
            onClick={() => navigate("/admin/vouchers")}
            className="flex-1 py-4 px-6 font-bold text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-350 transition-all cursor-pointer"
          >
            Khuyến mãi / Voucher
          </button>
        </div>

        {/* Inner Content Padding */}
        <div className="p-5 space-y-5">
          {/* Control Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute inset-y-0 left-3 h-4 w-4 my-auto text-slate-400" />
              <Input
                placeholder="Tìm kiếm người dùng bằng họ tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-card border-slate-200 dark:border-slate-800 text-xs focus:ring-1 focus:ring-primary h-9 rounded-lg"
              />
            </div>
            <Button 
              onClick={handleOpenAdd} 
              disabled={isLoadingRoles}
              className="bg-[#00288e] hover:bg-[#00288e]/95 text-white font-bold shadow-md shadow-[#00288e]/10 gap-2 h-9 text-xs cursor-pointer rounded-lg px-4"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Tạo tài khoản mới
            </Button>
          </div>

          {/* Loading state */}
          {isLoadingUsers ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-xs">Đang đồng bộ danh sách tài khoản từ cơ sở dữ liệu...</span>
            </div>
          ) : usersError ? (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-650 text-center py-10 rounded-2xl text-xs font-bold">
              Lỗi đồng bộ dữ liệu: {(usersError as any).message || "Không thể kết nối đến máy chủ API"}
            </div>
          ) : (
            /* Users Card Table */
            <UsersTable
              users={users}
              onEdit={handleOpenEdit}
              onToggleStatus={toggleUserStatus}
              onDelete={handleDeleteUser}
            />
          )}
        </div>
      </div>

      {/* Stats Bento Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg text-primary dark:text-primary-fixed-dim">
              <UserCheck className="h-5 w-5" />
            </div>
            <span className="text-emerald-500 font-bold text-xs flex items-center gap-0.5">
              <TrendingUp className="h-3.5 w-3.5" /> 12%
            </span>
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-wider">Người dùng mới (Tháng này)</p>
            <h3 className="font-extrabold text-2xl text-slate-800 dark:text-white mt-1">1,284</h3>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-lg text-amber-500">
              <Ticket className="h-5 w-5" />
            </div>
            <span className="text-amber-500 font-bold text-xs flex items-center gap-0.5">
              <Minus className="h-3.5 w-3.5" /> 0%
            </span>
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-wider">Voucher đang hoạt động</p>
            <h3 className="font-extrabold text-2xl text-slate-800 dark:text-white mt-1">24</h3>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg text-emerald-500">
              <DollarSign className="h-5 w-5" />
            </div>
            <span className="text-red-500 font-bold text-xs flex items-center gap-0.5">
              <TrendingDown className="h-3.5 w-3.5" /> 5%
            </span>
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-wider">Tổng chiết khấu (VNĐ)</p>
            <h3 className="font-extrabold text-2xl text-slate-800 dark:text-white mt-1">18.5M</h3>
          </div>
        </div>
      </div>

      {/* Marketing Campaign Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-850 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 group shadow-lg shadow-indigo-500/10">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="relative z-10 space-y-2.5 text-center sm:text-left">
          <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest inline-block">
            Chiến dịch mùa hè
          </span>
          <h2 className="text-white font-extrabold text-lg tracking-tight">
            Tăng tốc doanh số với Voucher Combo mới
          </h2>
          <p className="text-indigo-200 max-w-xl text-xs leading-relaxed">
            Thiết lập các chương trình giảm giá chéo giữa các thể loại sách để khuyến khích người dùng mua nhiều hơn trong mùa hè này.
          </p>
        </div>
        <div className="relative z-10 shrink-0">
          <button 
            onClick={() => navigate("/admin/vouchers")}
            className="bg-white hover:bg-slate-50 text-indigo-700 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xl transition-all hover:scale-[1.03] active:scale-95 cursor-pointer"
          >
            Bắt đầu ngay
          </button>
        </div>
      </div>

      {/* Dialog for Add / Edit */}
      <UserDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        isAddMode={isAddMode}
        formName={formName}
        setFormName={setFormName}
        formEmail={formEmail}
        setFormEmail={setFormEmail}
        formPhone={formPhone}
        setFormPhone={setFormPhone}
        formRole={formRole}
        setFormRole={setFormRole}
        formIsActive={formIsActive}
        setFormIsActive={setFormIsActive}
        roles={roles}
        onSave={handleSave}
      />
    </div>
  );
};

