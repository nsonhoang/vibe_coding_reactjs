import React from "react";
import { ArrowRight, BookMarked, Users, Award, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onLoginClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onLoginClick }) => {
  return (
    <section className="relative px-6 py-20 text-center md:px-12 md:py-32 max-w-5xl mx-auto">
      {/* Platform Welcome Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-700 mb-6 shadow-sm">
        <Award className="h-3.5 w-3.5 text-sky-600" /> Hệ thống Phân phối & Quản trị Sách E-Commerce
      </div>
      
      {/* Slogan */}
      <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl bg-gradient-to-r from-slate-900 via-slate-800 to-sky-600 bg-clip-text text-transparent leading-tight md:leading-none">
        KHÁM PHÁ KHO TÀNG <br className="hidden md:inline"/>
        TRI THỨC SỐ VÔ TẬN
      </h1>
      
      <p className="mt-6 text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed md:text-base font-medium">
        Hệ thống cung cấp hàng ngàn đầu sách chọn lọc phong phú từ các tác giả danh tiếng thế giới. Trải nghiệm dịch vụ vận chuyển siêu tốc kết hợp giao diện tối giản tinh tế.
      </p>
      
      {/* CTA Buttons */}
      <div className="mt-8 flex justify-center gap-4">
        <Button 
          onClick={onLoginClick}
          className="bg-sky-600 text-white hover:bg-sky-500 font-bold px-6 text-xs h-10 rounded-lg shadow-lg shadow-sky-600/20 active:scale-95 transition-transform"
        >
          Trải nghiệm Cổng Quản lý <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <a 
          href="#trending"
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-6 text-xs font-bold text-slate-700 transition-all shadow-sm"
        >
          Xem Sách Nổi Bật
        </a>
      </div>

      {/* Core Platform Stats Grid */}
      <div className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Đầu Sách Chất Lượng", value: "10,000+", icon: BookMarked },
          { label: "Độc Giả Tin Cậy", value: "5,000+", icon: Users },
          { label: "Đối Tác Xuất Bản", value: "120+", icon: Award },
          { label: "Thời Gian Phục Vụ", value: "24/7", icon: ShieldCheck }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i} 
              className="rounded-xl border border-sky-100 bg-white shadow-sm p-5 text-center hover:border-sky-300 hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex justify-center mb-2.5 text-sky-600 group-hover:scale-110 transition-transform duration-300">
                <Icon className="h-5.5 w-5.5" />
              </div>
              <div className="text-xl font-extrabold text-slate-900">{stat.value}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">{stat.label}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
