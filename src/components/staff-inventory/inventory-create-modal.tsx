import React, { useState, useEffect } from "react";
import { X, Loader2, Search, BookOpen, Check } from "lucide-react";
import { bookService, type Book } from "@/services/book-service";
import type { InventoryItem } from "@/services/inventory-service";
import { toast } from "sonner";

interface InventoryCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingInventoryItems: InventoryItem[];
  onSuccess: (bookId: string) => Promise<any> | void;
}

export const InventoryCreateModal: React.FC<InventoryCreateModalProps> = ({
  isOpen,
  onClose,
  existingInventoryItems,
  onSuccess,
}) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBookId, setSelectedBookId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load books when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchBooks = async () => {
        setIsLoadingBooks(true);
        try {
          // Fetch up to 100 books to search/select from
          const res = await bookService.getBooks({ limit: 100 });
          setBooks(res.data.items || res.data.data || []);
        } catch (error: any) {
          toast.error("Không thể tải danh sách đầu sách: " + (error.message || ""));
        } finally {
          setIsLoadingBooks(false);
        }
      };
      fetchBooks();
      setSelectedBookId("");
      setSearchQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter books that already have inventory records
  const existingBookIds = new Set(existingInventoryItems.map((item) => item.bookId));
  const availableBooks = books.filter((book) => !existingBookIds.has(book.id));

  // Filter based on search query
  const filteredBooks = availableBooks.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.authors?.some((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookId) {
      toast.warning("Vui lòng chọn một đầu sách.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSuccess(selectedBookId); // Callback will handle service invocation & query invalidation
      onClose();
    } catch (error: any) {
      toast.error("Lỗi khi tạo kho chứa: " + (error.message || ""));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/20">
          <div>
            <h3 className="text-sm font-black text-slate-850 dark:text-slate-100 uppercase tracking-wider">
              Khởi tạo kho chứa mới
            </h3>
            <p className="text-[10px] text-slate-450 dark:text-slate-400 font-semibold mt-0.5">
              Cấp phát vị trí và định danh tồn kho cho các đầu sách mới nhập hệ thống
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-3">
            <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
              Chọn sách cần thiết lập kho *
            </label>

            {/* Live Filter Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
              <input
                type="text"
                placeholder="Nhập tên sách hoặc tên tác giả để tìm kiếm nhanh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
              />
            </div>

            {/* Books List Grid / Container */}
            <div className="border border-slate-100 dark:border-slate-800 rounded-xl max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 bg-slate-50/50 dark:bg-slate-850/20">
              {isLoadingBooks ? (
                <div className="flex justify-center items-center py-10 space-x-2 text-slate-500 text-xs">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span>Đang tải các đầu sách khả dụng...</span>
                </div>
              ) : filteredBooks.length === 0 ? (
                <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-xs">
                  Không tìm thấy sách nào chưa có kho chứa phù hợp.
                </div>
              ) : (
                filteredBooks.map((book) => {
                  const isSelected = selectedBookId === book.id;
                  const thumbnailSrc = book.thumbnail
                    ? book.thumbnail.startsWith("http")
                      ? book.thumbnail
                      : `http://localhost:3000${book.thumbnail}`
                    : "";

                  return (
                    <div
                      key={book.id}
                      onClick={() => setSelectedBookId(book.id)}
                      className={`flex items-center gap-3 p-3 cursor-pointer transition-all ${
                        isSelected
                          ? "bg-primary/5 dark:bg-primary/10 border-l-4 border-primary"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/40 border-l-4 border-transparent"
                      }`}
                    >
                      <div className="h-10 w-8 rounded bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-250/20 shadow-sm">
                        {thumbnailSrc ? (
                          <img
                            src={thumbnailSrc}
                            alt={book.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <BookOpen className="h-4 w-4 text-slate-450" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {book.title}
                        </h4>
                        <p className="text-[10px] text-slate-450 dark:text-slate-450 font-semibold truncate mt-0.5">
                          Tác giả: {book.authors?.map((a) => a.name).join(", ") || "Không rõ"}
                        </p>
                      </div>

                      <div className="flex-shrink-0">
                        {isSelected ? (
                          <span className="p-1 bg-primary text-white rounded-full block">
                            <Check className="h-3 w-3" />
                          </span>
                        ) : (
                          <span className="h-4 w-4 rounded-full border border-slate-300 dark:border-slate-700 block" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl flex items-start gap-2 text-[10px] text-amber-600 dark:text-amber-400 font-semibold leading-relaxed">
            <span className="font-extrabold uppercase mt-0.5 bg-amber-500/10 px-1.5 py-0.5 rounded text-[8px]">Chú ý</span>
            <p>Kho chứa ban đầu sẽ có số lượng mặc định là 0. Bạn có thể sử dụng chức năng "Nhập kho" ngay sau đó để thay đổi số lượng thực tế.</p>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-350 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedBookId}
              className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/10 disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang thiết lập...
                </>
              ) : (
                "Khởi tạo kho chứa"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
