import React from "react";
import { Star } from "lucide-react";

interface MockBook {
  id: string;
  title: string;
  author: string;
  category: string;
  price: string;
  rating: number;
  gradient: string;
}

const mockBooks: MockBook[] = [
  {
    id: "B-001",
    title: "Đắc Nhân Tâm",
    author: "Dale Carnegie",
    category: "Kỹ năng sống",
    price: "86,000đ",
    rating: 5,
    gradient: "from-sky-400 to-blue-500"
  },
  {
    id: "B-002",
    title: "Nhà Giả Kim",
    author: "Paulo Coelho",
    category: "Văn học",
    price: "79,000đ",
    rating: 4.8,
    gradient: "from-amber-300 to-orange-400"
  },
  {
    id: "B-003",
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Công nghệ",
    price: "320,000đ",
    rating: 5,
    gradient: "from-emerald-400 to-teal-500"
  },
  {
    id: "B-004",
    title: "Nghĩ Giàu & Làm Giàu",
    author: "Napoleon Hill",
    category: "Kinh tế",
    price: "115,000đ",
    rating: 4.7,
    gradient: "from-rose-400 to-red-500"
  },
  {
    id: "B-005",
    title: "Thế Giới Phẳng",
    author: "Thomas L. Friedman",
    category: "Kinh tế",
    price: "248,000đ",
    rating: 4.6,
    gradient: "from-indigo-400 to-blue-600"
  }
];

export const BookCarousel: React.FC = () => {
  return (
    <section id="trending" className="border-t border-sky-100 bg-white py-16 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-sky-950 uppercase">Sách Nổi Bật Tuần Này</h2>
            <p className="text-xs text-slate-500 mt-1">Những tác phẩm được bạn đọc săn đón nhiều nhất trên hệ thống</p>
          </div>
          <span className="text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-100 rounded-lg px-3 py-1.5 uppercase tracking-wider select-none">
            Lướt ngang ➜
          </span>
        </div>

        {/* Horizontal scroll container */}
        <div className="flex gap-6 overflow-x-auto pb-4 pt-2 px-1 scrollbar-thin scrollbar-thumb-sky-100 scrollbar-track-transparent">
          {mockBooks.map((book) => (
            <div 
              key={book.id}
              className="group relative flex w-64 shrink-0 flex-col rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all duration-300 hover:border-sky-300 hover:bg-white hover:shadow-xl hover:shadow-sky-500/5 hover:-translate-y-1"
            >
              {/* Visual Book Cover mock */}
              <div className={`relative h-64 w-full rounded-lg bg-gradient-to-br ${book.gradient} p-4 flex flex-col justify-between shadow-sm overflow-hidden`}>
                <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition-colors duration-300" />
                
                {/* Book spine simulation */}
                <div className="absolute top-0 bottom-0 left-0 w-3 bg-white/20 blur-[0.5px] border-r border-white/10" />
                
                <div className="flex justify-end z-10">
                  <span className="rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-0.5 text-[9px] font-bold text-sky-950 shadow-sm">
                    {book.category}
                  </span>
                </div>
                
                <div className="z-10 pl-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white/80">{book.author}</span>
                  <h3 className="text-sm font-extrabold text-white tracking-wide mt-0.5 line-clamp-2 leading-snug drop-shadow-md">
                    {book.title}
                  </h3>
                </div>
              </div>

              <div className="mt-4 flex flex-col justify-between flex-1">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{book.title}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{book.author}</p>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-600">{book.price}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-bold text-slate-600">{book.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
