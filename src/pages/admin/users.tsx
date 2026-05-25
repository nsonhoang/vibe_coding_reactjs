import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Send, Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { UsersTable } from "@/components/admin-users/users-table";
import { UserDialog } from "@/components/admin-users/user-dialog";
import { UsersFilters } from "@/components/admin-users/users-filters";
import { UsersPagination } from "@/components/admin-users/users-pagination";
import { UsersStatsGrid } from "@/components/admin-users/users-stats-grid";

import type { UserResponseDto, UserStatus } from "@/services/user-service";
import { roleService, userService } from "@/services/user-service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const AdminUsers: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"createdAt" | "name" | "email">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // Dialog & Form states
  const [editingUser, setEditingUser] = useState<UserResponseDto | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);

  // AlertDialog State
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Debouncing search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page to 1 when search or filter options change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sortBy, sortOrder, selectedRole, selectedStatus]);

  // 1. Fetch Users from Server
  const { data: usersResponse, isLoading: isLoadingUsers, error: usersError } = useQuery({
    queryKey: ["users", page, debouncedSearch, sortBy, sortOrder],
    queryFn: () => userService.getUsers({ 
      page, 
      limit: 10, 
      keyword: debouncedSearch, 
      sortBy, 
      sortOrder 
    }),
  });

  // 2. Fetch User Roles
  const { data: rolesResponse, isLoading: isLoadingRoles } = useQuery({
    queryKey: ["roles"],
    queryFn: () => roleService.getRoles(),
  });

  const roles = useMemo(() => rolesResponse?.data || [], [rolesResponse]);
  const rawUsers = useMemo(() => usersResponse?.data?.data || [], [usersResponse]);

  // 3. Client Side Hybrid Filter for Role & Status
  const users = useMemo(() => {
    return rawUsers.filter((user) => {
      if (selectedRole) {
        const roleId = typeof user.role === "object" && user.role ? user.role.id : String(user.role || "");
        if (roleId !== selectedRole) return false;
      }
      if (selectedStatus && user.status !== selectedStatus) {
        return false;
      }
      return true;
    });
  }, [rawUsers, selectedRole, selectedStatus]);

  const totalItems = usersResponse?.data?.meta?.totalItems || usersResponse?.data?.meta?.total || 0;
  const totalPages = usersResponse?.data?.meta?.totalPages || 1;
  const currentPage = usersResponse?.data?.meta?.currentPage || usersResponse?.data?.meta?.page || 1;

  // Mutations
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; phone?: string; roleId?: string; status?: UserStatus } }) => 
      userService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsDialogOpen(false);
      toast.success("Cập nhật thông tin tài khoản thành công!");
    },
    onError: (err: any) => {
      toast.error(`Không thể cập nhật tài khoản: ${err.response?.data?.message || err.message}`);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Xóa tài khoản người dùng thành công!");
    },
    onError: (err: any) => {
      toast.error(`Không thể xóa tài khoản: ${err.response?.data?.message || err.message}`);
    },
  });

  // Handlers optimized with useCallback
  const handleOpenAdd = useCallback(() => {
    setIsAddMode(true);
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormRole(roles[0]?.id || "");
    setFormIsActive(true);
    setIsDialogOpen(true);
  }, [roles]);

  const handleOpenEdit = useCallback((user: UserResponseDto) => {
    setIsAddMode(false);
    setEditingUser(user);
    setFormName(user.name || "");
    setFormEmail(user.email);
    setFormPhone(user.phone || "");
    const roleId = typeof user.role === "object" && user.role ? user.role.id : String(user.role || "");
    setFormRole(roleId);
    setFormIsActive(user.status === "ACTIVE");
    setIsDialogOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!formName || !formEmail || !formRole) {
      toast.warning("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (isAddMode) {
      toast.info("Chức năng tạo tài khoản từ quản trị đang được phát triển.");
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
  }, [formName, formEmail, formRole, isAddMode, editingUser, formPhone, formIsActive, updateUserMutation]);

  const toggleUserStatus = useCallback((id: string, currentStatus: boolean) => {
    updateUserMutation.mutate({
      id,
      data: {
        status: !currentStatus ? "ACTIVE" : "INACTIVE",
      },
    });
  }, [updateUserMutation]);

  const handleDeleteUser = useCallback((id: string) => {
    setUserToDelete(id);
  }, []);

  const handleNavigateToVouchers = useCallback(() => {
    navigate("/admin/vouchers");
  }, [navigate]);

  return (
    <div className="space-y-6">
      <label className="sr-only">Quản trị danh sách người dùng</label>
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
            onClick={() => toast.info("Gửi thông báo broadcast hệ thống...")}
          >
            <Send className="h-3.5 w-3.5" />
            Gửi thông báo
          </Button>
          <Button 
            onClick={handleNavigateToVouchers}
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
            onClick={handleNavigateToVouchers}
            className="flex-1 py-4 px-6 font-bold text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-350 transition-all cursor-pointer"
          >
            Khuyến mãi / Voucher
          </button>
        </div>

        {/* Inner Content Padding */}
        <div className="p-5 space-y-5">
          <UsersFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            roles={roles}
            onOpenAdd={handleOpenAdd}
            isLoadingRoles={isLoadingRoles}
          />

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
            <>
              <UsersTable
                users={users}
                onEdit={handleOpenEdit}
                onToggleStatus={toggleUserStatus}
                onDelete={handleDeleteUser}
              />

              <UsersPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                page={page}
                setPage={setPage}
              />
            </>
          )}
        </div>
      </div>

      <UsersStatsGrid onNavigateToVouchers={handleNavigateToVouchers} />

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

      {/* Shadcn UI AlertDialog confirmation */}
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa tài khoản người dùng?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản người dùng này không? Hành động này không thể hoàn tác và mọi thông tin liên quan sẽ bị xóa sạch khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (userToDelete) {
                  deleteUserMutation.mutate(userToDelete);
                  setUserToDelete(null);
                }
              }}
            >
              Xóa vĩnh viễn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
