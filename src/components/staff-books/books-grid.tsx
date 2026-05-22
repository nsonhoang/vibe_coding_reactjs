import React from "react";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, CheckCircle, Trash2 } from "lucide-react";
import type { Book } from "@/services/book-service";

interface BooksGridProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onToggleStatus: (book: Book) => void;
  onDelete: (id: string) => void;
}

export const BooksGrid: React.FC<BooksGridProps> = ({
  books,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {books.map((book) => {
        const authorNames = book.authors?.map((a) => a.name).join(", ") || "Chưa rõ";
        const categoryNames = book.categories?.map((c) => c.name).join(", ") || "Chưa phân loại";
        const isActive = book.status === "ACTIVE";
        
        // Dùng ảnh bìa từ API hoặc fallback
        const coverUrl = book.thumbnail
          ? (book.thumbnail.startsWith("http") ? book.thumbnail : `http://localhost:3000${book.thumbnail}`)
          : "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&q=80";

        return (
          <Card key={book.id} className={`overflow-hidden border-border bg-card/45 backdrop-blur-sm transition-all hover:shadow-lg hover:translate-y-[-2px] flex flex-col justify-between ${!isActive ? "opacity-60" : ""}`}>
            <div>
              {/* Cover Image Wrapper */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-accent/40">
                <img 
                  src={coverUrl} 
                  alt={book.title} 
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
                <Badge className="absolute top-2 left-2 bg-slate-900/80 text-white font-mono hover:bg-slate-900/90 text-[9px] border-none py-0.5 rounded px-2">
                  {categoryNames}
                </Badge>
              </div>

              {/* Card Contents */}
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-xs line-clamp-1 text-foreground" title={book.title}>
                    {book.title}
                  </h3>
                  <span className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[8px] font-bold ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-destructive/10 text-destructive"
                  }`}>
                    {isActive ? "Đang bán" : "Ngừng bán"}
                  </span>
                </div>
                
                <p className="text-[10px] text-muted-foreground font-semibold">Tác giả: {authorNames}</p>
                <p className="text-[11px] font-extrabold text-primary">{book.price.toLocaleString()} ₫</p>
                <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">{book.description || "Không có mô tả."}</p>
              </div>
            </div>

            {/* Actions Footer */}
            <CardFooter className="p-4 pt-0 justify-between gap-2 border-t border-border/40 bg-accent/15 mt-3">
              <span className="text-[9px] font-bold text-muted-foreground/80 font-mono mt-3">ID: {book.id.substring(0, 8)}</span>
              <div className="flex items-center gap-1.5 mt-3">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onEdit(book)}
                  title="Chỉnh sửa thông tin"
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onToggleStatus(book)}
                  className="text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
                  title="Đổi trạng thái bán"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onDelete(book.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  title="Ngừng xuất bản (Xóa)"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};
