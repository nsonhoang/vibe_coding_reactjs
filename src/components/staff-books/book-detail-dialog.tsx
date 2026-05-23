import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Globe } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { imageBookService } from "@/services/image-book-service";
import { bookService } from "@/services/book-service";
import type { Book } from "@/services/book-service";

import { DetailGalleryPanel } from "./detail-gallery-panel";
import { DetailInfoPanel } from "./detail-info-panel";

interface BookDetailDialogProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
}

export const BookDetailDialog: React.FC<BookDetailDialogProps> = ({
  book,
  isOpen,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [selectedLargeImage, setSelectedLargeImage] = useState<string | null>(null);

  // Sync default large image to thumbnail
  const coverUrl = book.thumbnail
    ? (book.thumbnail.startsWith("http") ? book.thumbnail : `http://localhost:3000${book.thumbnail}`)
    : "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&q=80";

  // Fetch book details with React Query & bookService to get images relation
  const { data: bookDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["book-details", book.id],
    queryFn: () => bookService.getBookById(book.id),
    enabled: isOpen && !!book.id,
  });

  const currentBook = bookDetails?.data || book;
  const detailImages = currentBook.images || [];

  // Mutation to upload new book sub-images
  const uploadImagesMutation = useMutation({
    mutationFn: (files: File[]) => imageBookService.uploadImages(book.id, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book-details", book.id] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (err: any) => {
      alert(`Lỗi upload ảnh phụ: ${err.response?.data?.message || err.message}`);
    },
  });

  // Mutation to delete a sub-image
  const deleteImageMutation = useMutation({
    mutationFn: (id: string) => imageBookService.deleteImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book-details", book.id] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
      setSelectedLargeImage(null);
    },
    onError: (err: any) => {
      alert(`Lỗi xóa ảnh phụ: ${err.response?.data?.message || err.message}`);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="w-[95vw] md:max-w-6xl bg-card border border-primary/20 text-foreground overflow-y-auto max-h-[95vh] shadow-2xl rounded-xl px-8 py-6">
        <DialogHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <Globe className="h-4 w-4 animate-spin-slow text-primary" />
                Tổng quan học thuật & Ấn phẩm thương mại
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Xem chi tiết thông tin phát hành, tóm tắt nội dung chính và quản lý thư viện hình ảnh chi tiết.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-12 gap-8 py-6 text-xs leading-relaxed">
          {/* Left Column: Visual Hub (5 columns) */}
          <div className="col-span-12 md:col-span-5 border-r border-border/40 pr-0 md:pr-6 flex flex-col justify-between">
            <DetailGalleryPanel 
              bookId={book.id}
              bookTitle={currentBook.title}
              coverUrl={coverUrl}
              detailImages={detailImages}
              selectedLargeImage={selectedLargeImage}
              setSelectedLargeImage={setSelectedLargeImage}
              isLoadingDetails={isLoadingDetails}
              uploadImagesMutation={uploadImagesMutation}
              deleteImageMutation={deleteImageMutation}
            />
          </div>

          {/* Right Column: Information & Metadata (7 columns) */}
          <div className="col-span-12 md:col-span-7 pl-0 md:pl-2 flex flex-col justify-between">
            <DetailInfoPanel book={currentBook} />

            {/* Modal Bottom control */}
            <div className="border-t border-border/40 pt-4 flex justify-end mt-4">
              <Button 
                onClick={onClose} 
                className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs h-9 px-6 cursor-pointer"
              >
                Đóng thông tin
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
