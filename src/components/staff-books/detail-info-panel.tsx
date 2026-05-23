import React from "react";
import { Badge } from "@/components/ui/badge";
import { Coins, CheckCircle, User, Tag } from "lucide-react";
import type { Book } from "@/services/book-service";

interface DetailInfoPanelProps {
  book: Book;
}

export const DetailInfoPanel: React.FC<DetailInfoPanelProps> = ({ book }) => {
  return (
    <div className="space-y-5 flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Header Titles */}
        <div>
          <span className="text-[10px] font-bold text-primary font-mono tracking-widest block uppercase">Ấn Phẩm Sách Số: {book.id.toUpperCase()}</span>
          <h2 className="text-base font-extrabold text-foreground tracking-tight mt-1 leading-snug">{book.title}</h2>
        </div>

        {/* Status and Price Grid */}
        <div className="grid grid-cols-2 gap-4 border border-border/50 rounded-lg p-3 bg-accent/5">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground font-semibold text-[10px] uppercase">
              <Coins className="h-3.5 w-3.5 text-primary" />
              Giá kinh doanh niêm yết
            </div>
            <p className="text-sm font-extrabold text-primary pl-5">{book.price.toLocaleString()} ₫</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground font-semibold text-[10px] uppercase">
              <CheckCircle className="h-3.5 w-3.5 text-primary" />
              Trạng thái phân phối
            </div>
            <div className="pl-5 mt-0.5">
              {(() => {
                switch (book.status) {
                  case "ACTIVE":
                    return <Badge className="bg-emerald-500 text-[9px] py-0 border-none font-bold">Đang phát hành</Badge>;
                  case "HIDDEN":
                    return <Badge className="bg-amber-500 text-[9px] py-0 border-none font-bold">Tạm ẩn hệ thống</Badge>;
                  case "DRAFT":
                    return <Badge className="bg-blue-500 text-[9px] py-0 border-none font-bold">Bản nháp lưu kho</Badge>;
                  case "ARCHIVED":
                    return <Badge className="bg-slate-500 text-[9px] py-0 border-none font-bold">Lưu trữ nội bộ</Badge>;
                  default:
                    return <Badge className="bg-destructive text-[9px] py-0 border-none font-bold">Ngừng giao dịch</Badge>;
                }
              })()}
            </div>
          </div>
        </div>

        {/* Metadata Panel */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs">
            <User className="h-4 w-4 text-primary shrink-0" />
            <span className="font-bold text-muted-foreground w-18 block text-[10px] uppercase">Tác giả:</span>
            <span className="font-semibold text-foreground truncate">{book.authors?.map((a) => a.name).join(", ") || "Chưa cập nhật"}</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Tag className="h-4 w-4 text-primary shrink-0" />
            <span className="font-bold text-muted-foreground w-18 block text-[10px] uppercase">Thể loại:</span>
            <span className="font-semibold text-foreground truncate">{book.categories?.map((c) => c.name).join(", ") || "Chưa cập nhật"}</span>
          </div>
        </div>

        {/* Description Panel */}
        <div className="space-y-1.5 border-t border-border/40 pt-4">
          <label className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider block">Mô tả tóm tắt tác phẩm</label>
          <div className="bg-accent/5 border border-border/40 rounded-lg p-4 min-h-[160px] max-h-[220px] overflow-y-auto leading-relaxed text-xs text-foreground/90 whitespace-pre-line font-medium shadow-inner">
            {book.description || "Không có nội dung mô tả cho đầu sách này."}
          </div>
        </div>
      </div>
    </div>
  );
};
