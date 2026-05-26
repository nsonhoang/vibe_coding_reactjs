import React from "react";
import { Input } from "@/components/ui/input";
import type { BookStatus } from "@/services/book-service";
import { formatVNDInput, parseVNDInput } from "@/lib/utils";

interface BookInfoFormProps {
  title: string;
  setTitle: (val: string) => void;
  price: number;
  setPrice: (val: number) => void;
  status: BookStatus;
  setStatus: (val: BookStatus) => void;
  description: string;
  setDescription: (val: string) => void;
  isSaving: boolean;
}

export const BookInfoForm: React.FC<BookInfoFormProps> = ({
  title,
  setTitle,
  price,
  setPrice,
  status,
  setStatus,
  description,
  setDescription,
  isSaving,
}) => {
  return (
    <div className="space-y-3.5">
      <div className="space-y-1.5">
        <label className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider block">Tên sách / Tiêu đề</label>
        <Input
          placeholder="E.g. Cha Giàu Cha Nghèo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-card border-border/80 h-9 text-xs focus-visible:ring-primary focus-visible:border-primary"
          disabled={isSaving}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider block">Giá bán (VND)</label>
          <div className="relative">
            <Input
              type="text"
              value={formatVNDInput(price)}
              onChange={(e) => setPrice(parseVNDInput(e.target.value))}
              placeholder="0"
              className="bg-card border-border/80 h-9 pr-9 text-xs focus-visible:ring-primary font-mono font-bold"
              disabled={isSaving}
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px] font-extrabold pointer-events-none select-none">
              ₫
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider block">Trạng thái</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full rounded-md border border-border/80 bg-card px-2 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary h-9 transition-all cursor-pointer"
            disabled={isSaving}
          >
            <option value="DRAFT">Bản nháp lưu kho (DRAFT)</option>
            <option value="ACTIVE">Đang phân phối (ACTIVE)</option>
            <option value="HIDDEN">Tạm ẩn hệ thống (HIDDEN)</option>
            <option value="ARCHIVED">Lưu trữ nội bộ (ARCHIVED)</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider block">Mô tả tác phẩm (Soạn thảo chi tiết)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tóm tắt nội dung sách, điểm nổi bật..."
          rows={7}
          className="w-full rounded-md border border-border bg-card px-3.5 py-2.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[175px] resize-none leading-relaxed border-border/85"
          disabled={isSaving}
        />
      </div>
    </div>
  );
};
