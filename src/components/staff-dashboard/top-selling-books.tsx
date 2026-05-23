import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";

interface TopBook {
  title: string;
  author: string;
  sales: number;
  image: string;
}

const mockTopBooks: TopBook[] = [
  {
    title: "The Silent Horizon",
    author: "J.L. Aridson",
    sales: 1204,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6fXg0DzLKU8YXATrTYsFPhnDrZry_v7f6a_BgMGCdyvFZkRVXQDmthA7_QiD56MTnj9VHoY3wFwbOIzHo4uocVExA3qjhq8DeJ60pTv4lZMBPHpv9PlzfLJNki4GtU26a0cpZEybrzA-cUDBKElzims7ht1YeesaIoXO3jCRVJvbfeaNoWGDeOaf88C4xrHl0QNxzZTxKcYB4y8rFmvIHKeRj7Zd39x_TMzGdrxRke4acbjiv9uGl_n5BiyqAdMNj_O9G6ORMYdA",
  },
  {
    title: "Architecture of Tomorrow",
    author: "Elena Vance",
    sales: 942,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuKyBme8lp-VWHe4lvd2hqkX1h3DfAHp2HdLd3pf7kcTRBYER1szg-PiA4bIEjr2F0QhuI86mishQCMcRDOMxYGAsCdaPpJXS33NffR7CghXpO3WDsCmRdpmC7E833BGCFrmp0j-clDKxOxPBBBueLkfpvHIwec_vDAGOIWqNbH0sjnaMjGIg-4Bf72yIzSKvhi7DjGK6Pnvothp8d9wdtO8L-NFdPCF88xOC_QvCcYhmzqvu0PA4S8a87UrvQGTi60yjQwkwRW6YI",
  },
  {
    title: "Wilderness Spirits",
    author: "Marcus Thorne",
    sales: 876,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIiL2fqMJ8PFqXCMNP9gziKjKy_86bNHgwIXrtNVZixfJNVq_GWKvOKWaFs7R4tHpemMENCMO9-wz8rkSzN3OGckl-NV5XPq9Wn5EfIhhuNUW8fQAlJSYGhhRoJHW-WRBxc_K4YvGaQN0H3tUmaS2peN23-3IME9jpCXoDzGr__88ZZW17QKZxLh8XaY2WRv0UzdRKEjIIYMSq9iD5h9FkilXE5wbbjrEuOzO2slSj9BtA7m-KkAIi3N11vz_Yqlk-OUgDQmLUarU",
  },
];

export const TopSellingBooks: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between h-full shadow-sm">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-base font-bold text-slate-850 dark:text-white flex items-center gap-2">
          <BookOpen className="h-4.5 w-4.5 text-[#00288e]" />
          Sách Bán Chạy Nhất
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-4 flex-1">
          {mockTopBooks.map((book, idx) => (
            <div
              key={idx}
              onClick={() => navigate("/staff/books")}
              className="flex items-center gap-4 p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all cursor-pointer group"
            >
              <div className="w-12 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-slate-200 dark:border-slate-700">
                <img
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src={book.image}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-[#00288e] dark:group-hover:text-blue-400 transition-colors">
                  {book.title}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate font-medium">
                  {book.author}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold font-mono text-[#00288e] dark:text-blue-400">
                  {book.sales.toLocaleString()}
                </p>
                <p className="text-[9px] text-slate-400 font-medium">Lượt bán</p>
              </div>
            </div>
          ))}
        </div>
        <Button
          onClick={() => navigate("/staff/inventory")}
          variant="outline"
          className="w-full mt-2 text-xs font-bold border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 h-9 rounded-lg cursor-pointer transition-colors"
        >
          Xem toàn bộ kho sách
        </Button>
      </CardContent>
    </Card>
  );
};
