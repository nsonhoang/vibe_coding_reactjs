import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Định dạng số thành chuỗi phân tách hàng nghìn bằng dấu chấm (.) của Việt Nam
 * Ví dụ: 150000 -> "150.000"
 */
export function formatVNDInput(value: number | string | undefined): string {
  if (value === undefined || value === null || value === "") return "";
  
  // Loại bỏ các ký tự không phải số
  const rawValue = String(value).replace(/\D/g, "");
  if (!rawValue) return "";
  
  // Áp dụng định dạng dấu chấm phân tách hàng nghìn
  return rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Chuyển đổi chuỗi định dạng VND ngược lại thành số nguyên nguyên bản
 * Ví dụ: "150.000" -> 150000
 */
export function parseVNDInput(value: string): number {
  if (!value) return 0;
  // Loại bỏ toàn bộ ký tự phi số
  const rawNumber = value.replace(/\D/g, "");
  return rawNumber ? Number(rawNumber) : 0;
}
