import type { Promotion } from "@/services/promotion-service";

export const toLocalDateTimeString = (dateInput: Date | string) => {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  const tzOffset = d.getTimezoneOffset() * 60000;
  const localISO = new Date(d.getTime() - tzOffset).toISOString();
  return localISO.substring(0, 16);
};

export const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return dateStr;
  }
};

export const getPromoStatus = (promo: Promotion) => {
  const now = new Date();
  const start = new Date(promo.startDate);
  const end = new Date(promo.endDate);
  if (!promo.isActive) return { text: "Tạm dừng", class: "bg-slate-500/10 text-slate-600 dark:text-slate-400" };
  if (now < start) return { text: "Sắp diễn ra", class: "bg-amber-500/10 text-amber-600 dark:text-amber-400" };
  if (now > end) return { text: "Đã kết thúc", class: "bg-rose-500/10 text-rose-600 dark:text-rose-400" };
  return { text: "Đang hoạt động", class: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" };
};
