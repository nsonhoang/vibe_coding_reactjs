import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Users, 
  TrendingUp, 
  ShoppingCart, 
  DollarSign,
  ShieldCheck,
  UserCheck,
  Activity
} from "lucide-react";

export const StatsCards: React.FC = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Revenue Card */}
      <Card className="relative overflow-hidden border-border bg-card/40 backdrop-blur-sm transition-all hover:translate-y-[-2px] hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Doanh thu tháng</CardTitle>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <DollarSign className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">148.500.000 ₫</div>
          <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-3 w-3" />
            <span>+18.2% so với tháng trước</span>
          </div>
        </CardContent>
      </Card>

      {/* Users Card */}
      <Card className="relative overflow-hidden border-border bg-card/40 backdrop-blur-sm transition-all hover:translate-y-[-2px] hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tổng tài khoản</CardTitle>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Users className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">1,248</div>
          <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-primary">
            <UserCheck className="h-3 w-3" />
            <span>96 tài khoản mới tuần này</span>
          </div>
        </CardContent>
      </Card>

      {/* Orders Card */}
      <Card className="relative overflow-hidden border-border bg-card/40 backdrop-blur-sm transition-all hover:translate-y-[-2px] hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Đơn đặt hàng</CardTitle>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <ShoppingCart className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">4,120</div>
          <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
            <TrendingUp className="h-3 w-3" />
            <span>+4.6% hôm nay</span>
          </div>
        </CardContent>
      </Card>

      {/* Security Card */}
      <Card className="relative overflow-hidden border-border bg-card/40 backdrop-blur-sm transition-all hover:translate-y-[-2px] hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bảo mật hệ thống</CardTitle>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">An toàn</div>
          <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
            <Activity className="h-3 w-3" />
            <span>0 phát hiện đe dọa</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
