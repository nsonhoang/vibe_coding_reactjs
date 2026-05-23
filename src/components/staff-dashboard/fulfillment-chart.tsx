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
  { name: "T2", orders: 12 },
  { name: "T3", orders: 19 },
  { name: "T4", orders: 15 },
  { name: "T5", orders: 25 },
  { name: "T6", orders: 32 },
  { name: "T7", orders: 40 },
  { name: "CN", orders: 28 },
];

export const FulfillmentChart: React.FC = () => {
  return (
    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-850 dark:text-white">Tốc độ Đóng gói Đơn hàng</CardTitle>
            <CardDescription className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Hiệu suất vận hành trong 7 ngày qua</CardDescription>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-500/20">
            Tuần này
          </span>
        </div>
      </CardHeader>
      <CardContent className="h-64 pl-2 pr-4 pb-4">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <AreaChart data={orderData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00288e" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#00288e" stopOpacity={0.01}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.4)" strokeOpacity={0.6} />
            <XAxis 
              dataKey="name" 
              fontSize={11} 
              stroke="#94a3b8" 
              tickLine={false} 
              axisLine={false}
              dy={10}
            />
            <YAxis 
              fontSize={11} 
              stroke="#94a3b8" 
              tickLine={false} 
              axisLine={false}
              dx={-5}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "rgba(15, 23, 42, 0.95)", 
                borderColor: "#334155",
                borderRadius: "12px",
                color: "#f8fafc",
                fontSize: "12px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
              }} 
              labelStyle={{ fontWeight: "bold", color: "#94a3b8", marginBottom: "4px" }}
            />
            <Area 
              type="monotone" 
              dataKey="orders" 
              name="Đơn đóng gói" 
              stroke="#00288e" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorOrders)" 
              dot={{ r: 4, strokeWidth: 1, fill: "#ffffff", stroke: "#00288e" }}
              activeDot={{ r: 6, strokeWidth: 2, fill: "#00288e", stroke: "#ffffff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
