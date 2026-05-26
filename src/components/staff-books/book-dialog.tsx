import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import type { Category } from "@/services/category-service";
import type { Author } from "@/services/author-service";
import type { Book, BookStatus } from "@/services/book-service";
import { toast } from "sonner";

import { CoverImagePanel } from "./cover-image-panel";
import { BookInfoForm } from "./book-info-form";
import { RelationSelectors } from "./relation-selectors";

interface BookDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isAddMode: boolean;
  book: Book | null;
  categories: Category[];
  authors: Author[];
  onSave: (data: FormData) => void;
  isSaving: boolean;
}

export const BookDialog: React.FC<BookDialogProps> = ({
  isOpen,
  onClose,
  isAddMode,
  book,
  categories,
  authors,
  onSave,
  isSaving,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [status, setStatus] = useState<BookStatus>("DRAFT");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  // Sync edit mode fields
  useEffect(() => {
    if (!isAddMode && book) {
      setTitle(book.title);
      setDescription(book.description || "");
      setPrice(book.price);
      setSelectedCategories(book.categories?.map((c) => c.id) || []);
      setSelectedAuthors(book.authors?.map((a) => a.id) || []);
      setStatus(book.status);
      setImagePreview(book.thumbnail ? (book.thumbnail.startsWith("http") ? book.thumbnail : `http://localhost:3000${book.thumbnail}`) : "");
      setImageFile(null);
    } else {
      setTitle("");
      setDescription("");
      setPrice(0);
      setSelectedCategories([]);
      setSelectedAuthors([]);
      setStatus("DRAFT");
      setImagePreview("");
      setImageFile(null);
    }
  }, [book, isAddMode, isOpen]);

  const handleFileSelect = (file: File, previewUrl: string) => {
    setImageFile(file);
    setImagePreview(previewUrl);
  };

  const handleToggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleToggleAuthor = (autId: string) => {
    setSelectedAuthors((prev) =>
      prev.includes(autId) ? prev.filter((id) => id !== autId) : [...prev, autId]
    );
  };

  const handleSubmit = () => {
    if (!title || price < 0) {
      toast.warning("Vui lòng nhập đầy đủ Tên sách và Giá trị hợp lệ.");
      return;
    }
    if (selectedCategories.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một Thể loại.");
      return;
    }
    if (selectedAuthors.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một Tác giả.");
      return;
    }
    if (isAddMode && !imageFile) {
      toast.warning("Vui lòng chọn ảnh bìa cho sách mới.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", String(price));
    formData.append("status", status);

    selectedCategories.forEach((catId) => {
      formData.append("categoryId[]", catId);
    });

    selectedAuthors.forEach((autId) => {
      formData.append("authorId[]", autId);
    });

    if (imageFile) {
      formData.append("file", imageFile);
    }

    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open && !isSaving) onClose(); }}>
      <DialogContent className="w-[95vw] md:max-w-6xl bg-card border border-primary/20 text-foreground max-h-[95vh] overflow-y-auto shadow-2xl rounded-xl px-8 py-6">
        <DialogHeader className="border-b border-border pb-3 mb-2">
          <DialogTitle className="text-sm font-bold uppercase tracking-wider text-primary">
            {isAddMode ? "✨ Khai báo đầu sách mới" : "📝 Hiệu chỉnh ấn phẩm thương mại"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Thiết kế giao diện ngang tối ưu hiển thị tổng quan tham chiếu đầy đủ không cần cuộn trang.
          </DialogDescription>
        </DialogHeader>

        {/* 3-Column Zero-Scroll Horizontal Grid */}
        <div className="grid grid-cols-12 gap-8 py-4 text-xs">
          {/* Column 1: Image panel (3 cols) */}
          <div className="col-span-12 lg:col-span-3 border-r border-border/40 pr-0 lg:pr-6 flex flex-col justify-between">
            <CoverImagePanel 
              imagePreview={imagePreview}
              imageFile={imageFile}
              isSaving={isSaving}
              onFileSelect={handleFileSelect}
            />
          </div>

          {/* Column 2: Core Info & Description (5 cols) */}
          <div className="col-span-12 lg:col-span-5 border-r border-border/40 px-0 lg:px-6 space-y-4">
            <BookInfoForm 
              title={title}
              setTitle={setTitle}
              price={price}
              setPrice={setPrice}
              status={status}
              setStatus={setStatus}
              description={description}
              setDescription={setDescription}
              isSaving={isSaving}
            />
          </div>

          {/* Column 3: Multi Selectors (4 cols) */}
          <div className="col-span-12 lg:col-span-4 pl-0 lg:pl-2 space-y-4">
            <RelationSelectors 
              categories={categories}
              selectedCategories={selectedCategories}
              onToggleCategory={handleToggleCategory}
              authors={authors}
              selectedAuthors={selectedAuthors}
              onToggleAuthor={handleToggleAuthor}
              isSaving={isSaving}
            />
          </div>
        </div>

        <DialogFooter className="border-t border-border/45 pt-4 mt-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSaving} className="text-xs h-9 font-bold px-4">
            Hủy bỏ
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={isSaving} className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs h-9 px-6 gap-2">
            {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Lưu ấn phẩm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
