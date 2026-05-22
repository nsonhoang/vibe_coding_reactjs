import React from "react";
import { Truck, CreditCard, ShieldCheck } from "lucide-react";

export const Features: React.FC = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-xl font-extrabold tracking-tight text-sky-950 uppercase">Trải Nghiệm Dịch Vụ Độc Quyền</h2>
        <p className="text-xs text-slate-500 mt-1">Các giá trị cốt lõi làm nên sự uy tín của E-Book Store</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Giao Hàng Siêu Tốc",
            desc: "Hợp tác chặt chẽ với các đối tác vận chuyển lớn (GHN, GHTK). Giao hàng nội thành trong ngày, liên tỉnh chỉ từ 1-2 ngày.",
            icon: Truck
          },
          {
            title: "Thanh Toán Đa Kênh",
            desc: "Hỗ trợ thanh toán linh hoạt qua chuyển khoản, COD, VNPay, thẻ tín dụng với các bước bảo mật cao cấp nhất.",
            icon: CreditCard
          },
          {
            title: "Đảm Bảo Bản Quyền",
            desc: "Toàn bộ đầu sách xuất bản đều được cam kết bản quyền chính ngạch, chất lượng in ấn giấy và bìa tinh xảo nhất.",
            icon: ShieldCheck
          }
        ].map((feat, i) => {
          const Icon = feat.icon;
          return (
            <div 
              key={i} 
              className="flex gap-4 rounded-xl border border-sky-100 bg-white p-5 hover:border-sky-300 hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 border border-sky-100 text-sky-600 group-hover:scale-105 transition-transform">
                <Icon className="h-5.5 w-5.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{feat.title}</h3>
                <p className="mt-2 text-[11px] text-slate-500 leading-relaxed font-semibold">{feat.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
