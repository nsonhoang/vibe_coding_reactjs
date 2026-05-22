import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface CategoryDataPoint {
  name: string;
  books: number;
}

interface CategoriesBarChartProps {
  data: CategoryDataPoint[];
}

export const CategoriesBarChart: React.FC<CategoriesBarChartProps> = ({ data }) => {
  return (
    <Card className="border-border bg-card/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xs font-bold uppercase tracking-wider">Sách theo thể loại</CardTitle>
        <CardDescription className="text-[11px]">Phân bổ số lượng đầu sách trong hệ thống</CardDescription>
      </CardHeader>
      <CardContent className="h-72 pl-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(var(--primary))" stopOpacity={1}/>
                <stop offset="100%" stopColor="oklch(0.7 0.12 215)" stopOpacity={0.6}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(var(--border) / 40%)" />
            <XAxis dataKey="name" fontSize={10} stroke="oklch(var(--muted-foreground))" tickLine={false} axisLine={false} />
            <YAxis fontSize={10} stroke="oklch(var(--muted-foreground))" tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "oklch(var(--card))", 
                borderColor: "oklch(var(--border))",
                borderRadius: "6px"
              }} 
            />
            <Bar dataKey="books" name="Đầu sách" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
