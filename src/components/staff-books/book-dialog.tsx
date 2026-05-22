import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Image as ImageIcon, Upload, Loader2, Check } from "lucide-react";
import type { Category } from "@/services/category-service";
import type { Author } from "@/services/author-service";
import type { Book } from "@/services/book-service";

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
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setStatus("ACTIVE");
      setImagePreview("");
      setImageFile(null);
    }
  }, [book, isAddMode, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const toggleAuthor = (autId: string) => {
    setSelectedAuthors((prev) =>
      prev.includes(autId) ? prev.filter((id) => id !== autId) : [...prev, autId]
    );
  };

  const handleSubmit = () => {
    if (!title || price < 0) {
      alert("Vui lòng nhập đầy đủ Tên sách và Giá trị hợp lệ.");
      return;
    }
    if (selectedCategories.length === 0) {
      alert("Vui lòng chọn ít nhất một Thể loại.");
      return;
    }
    if (selectedAuthors.length === 0) {
      alert("Vui lòng chọn ít nhất một Tác giả.");
      return;
    }
    if (isAddMode && !imageFile) {
      alert("Vui lòng chọn ảnh bìa cho sách mới.");
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
      <DialogContent className="max-w-2xl bg-card border-border text-foreground overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xs font-bold uppercase tracking-wider">
            {isAddMode ? "Thêm mới đầu sách vào kho lưu trữ" : "Cập nhật thông tin sách"}
          </DialogTitle>
          <DialogDescription className="text-[11px]">
            Khai báo chi tiết giá trị bán, thông tin xuất bản và cập nhật ảnh bìa sách.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6 py-2 text-xs">
          {/* Left Cover Image Panel */}
          <div className="col-span-1 space-y-4">
            <div className="relative aspect-[3/4] w-full rounded-md border border-border bg-accent/20 overflow-hidden flex flex-col items-center justify-center p-2 text-center text-muted-foreground">
              {imagePreview ? (
                <img src={imagePreview} alt="Cover Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="space-y-1">
                  <ImageIcon className="h-8 w-8 mx-auto opacity-40" />
                  <span className="text-[9px]">Chưa có ảnh</span>
                </div>
              )}
            </div>
            
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            
            <Button
              variant="outline"
              size="xs"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSaving}
              className="w-full text-[10px] gap-1.5 h-8 cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" />
              Tải ảnh bìa
            </Button>
            {imageFile && (
              <p className="text-[9px] text-emerald-500 font-bold text-center truncate">
                Đã chọn: {imageFile.name}
              </p>
            )}
          </div>

          {/* Right Information Fields */}
          <div className="col-span-2 space-y-3.5">
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground">Tên sách</label>
              <Input
                placeholder="E.g. Đắc Nhân Tâm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-card border-border"
                disabled={isSaving}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Giá bán (₫)</label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="bg-card border-border"
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Trạng thái bán</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary h-[34px]"
                  disabled={isSaving}
                >
                  <option value="ACTIVE">Cho phép mở bán</option>
                  <option value="INACTIVE">Tạm dừng mở bán</option>
                </select>
              </div>
            </div>

            {/* Thể loại (Multi-select) */}
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground">Thể loại (Chọn một hoặc nhiều)</label>
              <div className="grid grid-cols-2 gap-2 max-h-[100px] overflow-y-auto p-2 border border-border rounded bg-accent/10">
                {categories.map((cat) => {
                  const isChecked = selectedCategories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`flex items-center justify-between p-1.5 rounded border text-left text-[10px] font-semibold transition-all ${
                        isChecked
                          ? "border-primary/80 bg-primary/10 text-primary"
                          : "border-border/60 hover:bg-accent/30 text-foreground/80"
                      }`}
                      disabled={isSaving}
                    >
                      <span>{cat.name}</span>
                      {isChecked && <Check className="h-3 w-3 shrink-0 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tác giả (Multi-select) */}
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground">Tác giả (Chọn một hoặc nhiều)</label>
              <div className="grid grid-cols-2 gap-2 max-h-[100px] overflow-y-auto p-2 border border-border rounded bg-accent/10">
                {authors.map((aut) => {
                  const isChecked = selectedAuthors.includes(aut.id);
                  return (
                    <button
                      key={aut.id}
                      type="button"
                      onClick={() => toggleAuthor(aut.id)}
                      className={`flex items-center justify-between p-1.5 rounded border text-left text-[10px] font-semibold transition-all ${
                        isChecked
                          ? "border-primary/80 bg-primary/10 text-primary"
                          : "border-border/60 hover:bg-accent/30 text-foreground/80"
                      }`}
                      disabled={isSaving}
                    >
                      <span>{aut.name}</span>
                      {isChecked && <Check className="h-3 w-3 shrink-0 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-muted-foreground">Mô tả tóm tắt sách</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả nội dung..."
                rows={3}
                className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary resize-none"
                disabled={isSaving}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSaving} className="text-xs">
            Hủy bỏ
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={isSaving} className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs gap-2">
            {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Lưu sách
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
