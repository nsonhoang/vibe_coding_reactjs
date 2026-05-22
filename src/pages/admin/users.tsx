import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Loader2 } from "lucide-react";
import { UsersTable } from "@/components/admin-users/users-table";
import { UserDialog } from "@/components/admin-users/user-dialog";
import type { UserResponseDto } from "@/services/user-service";

import { roleService, userService } from "@/services/user-service";


export const AdminUsers: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editingUser, setEditingUser] = useState<UserResponseDto | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);

  // Form states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
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
  const users = usersResponse?.data?.items || [];

  // 3. Create User Mutation
  // const createUserMutation = useMutation({
  //   mutationFn: (data: { email: string; name: string; roleId: string }) => 
  //     userService.createUser(data),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["users"] });
  //     setIsDialogOpen(false);
  //   },
  //   onError: (err: any) => {
  //     alert(`Không thể tạo tài khoản mới: ${err.response?.data?.message || err.message}`);
  //   },
  // });

  // 4. Update User Mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; roleId?: string; isActive?: boolean } }) => 
      userService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsDialogOpen(false);
    },
    onError: (err: any) => {
      alert(`Không thể cập nhật tài khoản: ${err.response?.data?.message || err.message}`);
    },
  });

  // Mở Dialog Thêm mới
  const handleOpenAdd = () => {
    setIsAddMode(true);
    setFormName("");
    setFormEmail("");
    // Chọn role đầu tiên làm mặc định nếu có
    setFormRole(roles[0]?.id || "");
    setFormIsActive(true);
    setIsDialogOpen(true);
  };

  // Mở Dialog Chỉnh sửa
  const handleOpenEdit = (user: UserResponseDto) => {
    setIsAddMode(false);
    setEditingUser(user);
    setFormName(user.fullName || "");
    setFormEmail(user.email);
    // Lấy role ID từ object hoặc string
    const roleId = typeof user.role === "object" && user.role ? user.role.id : String(user.role || "");
    setFormRole(roleId);
    setFormIsActive(user.isActive);
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
          roleId: formRole,
          isActive: formIsActive,
        },
      });
    }
  };

  // Thay đổi trạng thái tài khoản (Block / Active)
  const toggleUserStatus = (id: string, currentStatus: boolean) => {
    updateUserMutation.mutate({
      id,
      data: {
        isActive: !currentStatus,
      },
    });
  };

  // Xóa tài khoản (Backend chưa có delete, ta có thể cảnh báo chặn thay thế)
  const handleDeleteUser = (id: string) => {
    if (window.confirm("Xóa vĩnh viễn không được hỗ trợ để đảm bảo tính toàn vẹn dữ liệu. Bạn có muốn khóa tài khoản này lại không?")) {
      updateUserMutation.mutate({
        id,
        data: {
          isActive: false,
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute inset-y-0 left-3 h-4 w-4 my-auto text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên hoặc email từ máy chủ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-card border-border text-xs"
          />
        </div>
        <Button 
          onClick={handleOpenAdd} 
          disabled={isLoadingRoles}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md shadow-primary/10 gap-2 h-9 text-xs cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          Tạo tài khoản mới
        </Button>
      </div>

      {/* Loading state */}
      {isLoadingUsers ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-xs">Đang đồng bộ danh sách tài khoản từ cơ sở dữ liệu...</span>
        </div>
      ) : usersError ? (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-center py-8 rounded-lg text-xs font-bold">
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

      {/* Dialog for Add / Edit */}
      <UserDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        isAddMode={isAddMode}
        formName={formName}
        setFormName={setFormName}
        formEmail={formEmail}
        setFormEmail={setFormEmail}
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
