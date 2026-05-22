import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

const orderData = [
  { name: "Mon", orders: 12 },
  { name: "Tue", orders: 19 },
  { name: "Wed", orders: 15 },
  { name: "Thu", orders: 25 },
  { name: "Fri", orders: 32 },
  { name: "Sat", orders: 40 },
  { name: "Sun", orders: 28 },
];

export const FulfillmentChart: React.FC = () => {
  return (
    <Card className="border-border bg-card/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xs font-bold uppercase tracking-wider">Đơn hàng hoàn thành tuần này</CardTitle>
        <CardDescription className="text-[11px]">Tốc độ xử lý đơn hàng của nhân viên vận hành</CardDescription>
      </CardHeader>
      <CardContent className="h-64 pl-2">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <AreaChart data={orderData}>
            <defs>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="oklch(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(var(--border) / 50%)" />
            <XAxis dataKey="name" fontSize={11} stroke="oklch(var(--muted-foreground))" tickLine={false} axisLine={false} />
            <YAxis fontSize={11} stroke="oklch(var(--muted-foreground))" tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "oklch(var(--card))", 
                borderColor: "oklch(var(--border))",
                borderRadius: "6px"
              }} 
            />
            <Area type="monotone" dataKey="orders" name="Đơn đóng gói" stroke="oklch(var(--primary))" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOrders)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
