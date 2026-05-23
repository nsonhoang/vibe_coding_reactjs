import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import type { Role } from "@/services/user-service";

interface UserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isAddMode: boolean;
  formName: string;
  setFormName: (val: string) => void;
  formEmail: string;
  setFormEmail: (val: string) => void;
  formPhone: string;
  setFormPhone: (val: string) => void;
  formRole: string;
  setFormRole: (val: string) => void;
  formIsActive: boolean;
  setFormIsActive: (val: boolean) => void;
  roles: Role[];
  onSave: () => void;
}

export const UserDialog: React.FC<UserDialogProps> = ({
  isOpen,
  onClose,
  isAddMode,
  formName,
  setFormName,
  formEmail,
  setFormEmail,
  formPhone,
  setFormPhone,
  formRole,
  setFormRole,
  formIsActive,
  setFormIsActive,
  roles,
  onSave,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xs font-bold uppercase tracking-wider">
            {isAddMode ? "Quy trình tạo tài khoản mới" : "Chỉnh sửa tài khoản"}
          </DialogTitle>
          <DialogDescription className="text-[11px]">
            {isAddMode 
              ? "Quy trình bảo mật nâng cao dành cho thành viên mới."
              : "Vui lòng cập nhật các thông tin được phép thay đổi dưới đây."}
          </DialogDescription>
        </DialogHeader>

        {isAddMode ? (
          <div className="space-y-3.5 py-2 text-xs">
            <div className="p-3.5 rounded-lg border border-sky-500/20 bg-sky-500/5 text-sky-600 dark:text-sky-400 space-y-2 leading-relaxed">
              <p className="font-bold">⚠️ Quy trình Đăng ký & Kích hoạt Bảo mật:</p>
              <p className="text-[11px]">
                Để bảo vệ an toàn thông tin và xác thực tài khoản, việc đăng ký tài khoản mới phải được thực hiện thông qua luồng **Đăng ký (Register)** trên trang chủ để nhận mã OTP xác minh qua Email.
              </p>
              <p className="text-[11px] font-semibold">
                Sau khi người dùng đăng ký thành công, tài khoản sẽ xuất hiện tại danh sách này. Bạn có thể sử dụng quyền Quản trị để nâng cấp vai trò của họ lên STAFF hoặc ADMIN.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-muted-foreground">Họ và tên</label>
              <Input
                placeholder="Nguyễn Văn A"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="bg-card border-border text-xs"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="font-bold text-muted-foreground">Địa chỉ Email</label>
              <Input
                type="email"
                placeholder="name@bookstore.com"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="bg-card border-border text-xs"
                disabled={true}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-muted-foreground">Số điện thoại</label>
              <Input
                placeholder="09XXXXXXXX"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                className="bg-card border-border text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-muted-foreground">Nhóm quyền hạn (Role)</label>
              <select
                value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
                className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary h-[34px]"
              >
                <option value="" disabled>-- Chọn quyền --</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs cursor-pointer">
            {isAddMode ? "Đã rõ" : "Hủy bỏ"}
          </Button>
          {!isAddMode && (
            <Button size="sm" onClick={onSave} className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs cursor-pointer">
              Lưu thay đổi
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
