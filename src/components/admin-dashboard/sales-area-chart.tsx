import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SalesDataPoint {
  name: string;
  sales: number;
  orders: number;
}

interface SalesAreaChartProps {
  data: SalesDataPoint[];
}

export const SalesAreaChart: React.FC<SalesAreaChartProps> = ({ data }) => {
  return (
    <Card className="border-border bg-card/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xs font-bold uppercase tracking-wider">Doanh thu & Số lượng đơn đặt hàng</CardTitle>
        <CardDescription className="text-[11px]">Dữ liệu 6 tháng gần nhất của toàn nền tảng</CardDescription>
      </CardHeader>
      <CardContent className="h-72 pl-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(var(--primary))" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="oklch(var(--primary))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.7 0.12 215)" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="oklch(0.7 0.12 215)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(var(--border) / 40%)" />
            <XAxis dataKey="name" fontSize={11} stroke="oklch(var(--muted-foreground))" tickLine={false} axisLine={false} />
            <YAxis fontSize={11} stroke="oklch(var(--muted-foreground))" tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "oklch(var(--card))", 
                borderColor: "oklch(var(--border))",
                borderRadius: "6px"
              }} 
            />
            <Area type="monotone" dataKey="sales" name="Doanh thu (₫)" stroke="oklch(var(--primary))" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" activeDot={{ r: 6 }} />
            <Area type="monotone" dataKey="orders" name="Đơn hàng" stroke="oklch(0.7 0.12 215)" strokeWidth={2} fillOpacity={1} fill="url(#colorOrders)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
