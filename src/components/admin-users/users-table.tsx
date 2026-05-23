import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import type { UserResponseDto } from "@/services/user-service";

interface UsersTableProps {
  users: UserResponseDto[];
  onEdit: (user: UserResponseDto) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}

const UserCheckingStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  // Helper to extract initials
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Helper to determine avatar color class
  const getAvatarBg = (roleName: string) => {
    const role = roleName.toUpperCase();
    if (role.includes("ADMIN")) {
      return "bg-indigo-150 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40";
    }
    if (role.includes("STAFF")) {
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-250 dark:border-emerald-800/40";
    }
    return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-350 border border-slate-200 dark:border-slate-700/40";
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800">
              <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Người dùng</th>
              <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Thông tin liên hệ</th>
              <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Vai trò</th>
              <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {users.map((user) => {
              const roleName = typeof user.role === "object" && user.role ? user.role.name : String(user.role || "");
              const isUserActive = user.status === UserCheckingStatus.ACTIVE;

              return (
                <tr key={user.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-850/20 transition-colors group">
                  {/* Column 1: Người dùng (Initials avatar + Name + ID) */}
                  <td className="px-6 py-4.5">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xs select-none shrink-0 ${getAvatarBg(roleName)}`}>
                        {getInitials(user.name || "User")}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-slate-850 dark:text-slate-200 text-xs truncate">
                          {user.name || "Chưa thiết lập"}
                        </p>
                        <p className="font-mono text-[9px] text-slate-400 mt-0.5 truncate">
                          ID: #{user.id.slice(-6).toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Thông tin liên hệ (Email + Phone) */}
                  <td className="px-6 py-4.5">
                    <p className="text-slate-700 dark:text-slate-300 text-xs font-mono truncate">
                      {user.email}
                    </p>
                    {user.phone ? (
                      <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                        {user.phone}
                      </p>
                    ) : (
                      <p className="text-[10px] text-slate-350 italic mt-0.5">
                        Chưa cập nhật SĐT
                      </p>
                    )}
                  </td>

                  {/* Column 3: Vai trò */}
                  <td className="px-6 py-4.5">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-bold ${
                      roleName.toUpperCase().includes("ADMIN") 
                        ? "bg-indigo-50/60 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                        : roleName.toUpperCase().includes("STAFF")
                        ? "bg-emerald-50/60 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    }`}>
                      {roleName}
                    </span>
                  </td>

                  {/* Column 4: Trạng thái (Switch toggle) */}
                  <td className="px-6 py-4.5">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(user.id, isUserActive)}
                      className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-slate-200 dark:bg-slate-800"
                      style={{
                        backgroundColor: isUserActive ? "#10B981" : undefined
                      }}
                      title={isUserActive ? "Nhấp để chặn tài khoản" : "Nhấp để kích hoạt tài khoản"}
                    >
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          isUserActive ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </td>

                  {/* Column 5: Thao tác */}
                  <td className="px-6 py-4.5 text-right space-x-1">
                    <button
                      type="button"
                      onClick={() => onEdit(user)}
                      title="Chỉnh sửa thông tin"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer inline-flex items-center"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(user.id)}
                      title="Xóa vĩnh viễn tài khoản"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-650 hover:bg-red-500/10 transition-all cursor-pointer inline-flex items-center"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-400 dark:text-slate-500 text-xs font-semibold">
                  Không tìm thấy tài khoản người dùng nào thỏa mãn bộ lọc.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
