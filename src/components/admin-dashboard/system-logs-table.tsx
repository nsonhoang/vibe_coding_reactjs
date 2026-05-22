import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle } from "lucide-react";

interface AuditLog {
  id: string;
  user: string;
  action: string;
  role: string;
  ip: string;
  time: string;
  status: string;
}

interface SystemLogsTableProps {
  logs: AuditLog[];
}

export const SystemLogsTable: React.FC<SystemLogsTableProps> = ({ logs }) => {
  return (
    <Card className="border-border bg-card/20 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-xs font-bold uppercase tracking-wider">Nhật ký hoạt động hệ thống</CardTitle>
          <CardDescription className="text-[11px]">Giám sát hoạt động thời gian thực của Admin và Staff</CardDescription>
        </div>
        <Badge className="bg-primary/10 border-primary/20 text-primary uppercase font-bold text-[9px] hover:bg-primary/20 gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
          </span>
          Thời gian thực
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 text-muted-foreground pb-2 font-semibold">
                <th className="py-2.5">ID Log</th>
                <th className="py-2.5">Tác nhân</th>
                <th className="py-2.5">Hành động</th>
                <th className="py-2.5">Quyền hạn</th>
                <th className="py-2.5">Địa chỉ IP</th>
                <th className="py-2.5">Thời điểm</th>
                <th className="py-2.5">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-accent/40 transition-colors">
                  <td className="py-3 font-semibold text-muted-foreground">{log.id}</td>
                  <td className="py-3 font-bold">{log.user}</td>
                  <td className="py-3 text-foreground/80">{log.action}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      log.role === "ADMIN" 
                        ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                        : log.role === "STAFF"
                          ? "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
                          : "bg-muted text-muted-foreground"
                    }`}>
                      {log.role}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-[10px] text-muted-foreground">{log.ip}</td>
                  <td className="py-3 text-muted-foreground">{log.time}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                      log.status === "SUCCESS" ? "text-emerald-600" : "text-amber-500"
                    }`}>
                      {log.status === "SUCCESS" ? (
                        <Activity className="h-3 w-3" />
                      ) : (
                        <AlertTriangle className="h-3 w-3" />
                      )}
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
