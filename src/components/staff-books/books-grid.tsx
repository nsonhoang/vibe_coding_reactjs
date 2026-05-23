import React, { useState } from "react";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, CheckCircle, Trash2, Image as ImageIcon } from "lucide-react";
import type { Book } from "@/services/book-service";
import { BookDetailDialog } from "./book-detail-dialog";

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
  const [selectedDetailBook, setSelectedDetailBook] = useState<Book | null>(null);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {books.map((book) => {
          const authorNames = book.authors?.map((a) => a.name).join(", ") || "Chưa rõ";
          const isActive = book.status === "ACTIVE";
          
          // Cover image URL with local fallback
          const coverUrl = book.thumbnail
            ? (book.thumbnail.startsWith("http") ? book.thumbnail : `http://localhost:3000${book.thumbnail}`)
            : "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&q=80";

          return (
            <Card 
              key={book.id} 
              onClick={() => setSelectedDetailBook(book)}
              className={`overflow-hidden border border-border/80 bg-card/65 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:translate-y-[-4px] flex flex-col justify-between cursor-pointer group ${!isActive ? "opacity-60" : ""}`}
            >
              <div>
                {/* Cover Image Wrapper */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-accent/20">
                  <img 
                    src={coverUrl} 
                    alt={book.title} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 right-2.5">
                    {(() => {
                      switch (book.status) {
                        case "ACTIVE":
                          return (
                            <Badge className="bg-emerald-500 text-white font-bold border-none text-[9px] py-0.5 rounded px-2">
                              Đang bán
                            </Badge>
                          );
                        case "HIDDEN":
                          return (
                            <Badge className="bg-amber-500 text-white font-bold border-none text-[9px] py-0.5 rounded px-2">
                              Tạm ẩn
                            </Badge>
                          );
                        case "DRAFT":
                          return (
                            <Badge className="bg-blue-500 text-white font-bold border-none text-[9px] py-0.5 rounded px-2">
                              Bản nháp
                            </Badge>
                          );
                        case "ARCHIVED":
                          return (
                            <Badge className="bg-slate-500 text-white font-bold border-none text-[9px] py-0.5 rounded px-2">
                              Lưu trữ
                            </Badge>
                          );
                        default:
                          return (
                            <Badge className="bg-destructive text-white font-bold border-none text-[9px] py-0.5 rounded px-2">
                              Ngừng bán
                            </Badge>
                          );
                      }
                    })()}
                  </div>
                </div>

                {/* Card Contents */}
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm line-clamp-1 text-foreground group-hover:text-primary transition-colors leading-tight" title={book.title}>
                    {book.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-muted-foreground truncate max-w-[70%] font-medium">Tác giả: {authorNames}</p>
                    <p className="text-xs font-extrabold text-primary shrink-0">{book.price.toLocaleString()} ₫</p>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <CardFooter 
                className="p-3.5 pt-2 justify-between items-center border-t border-border/40 bg-accent/5"
                onClick={(e) => e.stopPropagation()} // Prevent card click trigger on button bar
              >
                <span className="text-[9px] font-bold text-muted-foreground/60 font-mono">ID: {book.id.substring(0, 8)}</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => onEdit(book)}
                    className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    title="Chỉnh sửa thông tin"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => onToggleStatus(book)}
                    className="h-7 w-7 text-amber-500 hover:text-amber-600 hover:bg-amber-500/10 transition-colors"
                    title="Đổi trạng thái bán"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => onDelete(book.id)}
                    className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
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

      {/* API-Integrated Book Detail Dialog */}
      {selectedDetailBook && (
        <BookDetailDialog 
          book={selectedDetailBook} 
          isOpen={!!selectedDetailBook} 
          onClose={() => setSelectedDetailBook(null)} 
        />
      )}
    </>
  );
};


