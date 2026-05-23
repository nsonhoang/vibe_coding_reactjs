import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle, Loader2, ChevronLeft, ChevronRight, X, Filter } from "lucide-react";
import { BooksGrid } from "@/components/staff-books/books-grid";
import { BookDialog } from "@/components/staff-books/book-dialog";
import { bookService, type Book, type BookStatus } from "@/services/book-service";
import { categoryService } from "@/services/category-service";
import { authorService } from "@/services/author-service";

export const StaffBooks: React.FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"ALL" | "ACTIVE" | "HIDDEN" | "DRAFT" | "ARCHIVED">("ALL");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(true);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Limit strictly 10
  const limit = 10;

  // Debounce search input
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 1. Fetch Books with API Filters and Limit 10
  const { data: booksData, isLoading: isLoadingBooks, error: booksError } = useQuery({
    queryKey: ["books", page, debouncedSearch, selectedCategory, selectedAuthor],
    queryFn: () =>
      bookService.getBooks({
        page,
        limit,
        keyword: debouncedSearch || undefined,
        categoryId: selectedCategory || undefined,
        authorId: selectedAuthor || undefined,
      }),
  });

  // 2. Fetch Categories (for Dialog dropdown selection & filters)
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories(),
  });

  // 3. Fetch Authors (for Dialog selection & filters)
  const { data: authorsData } = useQuery({
    queryKey: ["authors"],
    queryFn: () => authorService.getAuthors(),
  });

  // 4. Mutations
  const createBookMutation = useMutation({
    mutationFn: (formData: FormData) => bookService.createBook(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      setIsDialogOpen(false);
    },
    onError: (err: any) => {
      alert(`Lỗi tạo sách: ${err.message}`);
    },
  });

  const updateBookMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => bookService.updateBook(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      setIsDialogOpen(false);
    },
    onError: (err: any) => {
      alert(`Lỗi cập nhật thông tin: ${err.message}`);
    },
  });

  const deleteBookMutation = useMutation({
    mutationFn: (id: string) => bookService.deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (err: any) => {
      alert(`Lỗi xóa sách: ${err.message}`);
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookStatus }) =>
      bookService.updateBook(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (err: any) => {
      alert(`Lỗi thay đổi trạng thái: ${err.message}`);
    },
  });

  const handleOpenAdd = () => {
    setIsAddMode(true);
    setEditingBook(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (b: Book) => {
    setIsAddMode(false);
    setEditingBook(b);
    setIsDialogOpen(true);
  };

  const handleSave = (formData: FormData) => {
    if (isAddMode) {
      createBookMutation.mutate(formData);
    } else if (editingBook) {
      const data: any = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        price: Number(formData.get("price")),
        file: (formData.get("file") as File) || undefined,
        status: formData.get("status") as BookStatus,
        categoryId: formData.getAll("categoryId[]") as string[],
        authorId: formData.getAll("authorId[]") as string[],
      };

      updateBookMutation.mutate({ id: editingBook.id, data });
    }
  };

  const toggleBookStatus = (b: Book) => {
    const nextStatus = b.status === "ACTIVE" ? "HIDDEN" : "ACTIVE";
    toggleStatusMutation.mutate({ id: b.id, status: nextStatus });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có thực sự muốn ngừng xuất bản và xóa cuốn sách này khỏi hệ thống?")) {
      deleteBookMutation.mutate(id);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setSelectedCategory("");
    setSelectedAuthor("");
    setSelectedStatus("ALL");
    setPage(1);
  };

  // Get paginated books & metadata
  const paginatedResult = booksData?.data;
  const rawBooks = paginatedResult?.data || paginatedResult?.items || [];
  const books = rawBooks.filter((b: Book) => selectedStatus === "ALL" || b.status === selectedStatus);

  const totalItems = paginatedResult?.meta?.totalItems || 0;
  const totalPages = paginatedResult?.meta?.totalPages || 1;

  const categories = categoriesData?.data || [];
  const authors = authorsData?.data || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Quản lý kho sách</h2>
          <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
            Theo dõi, cập nhật và thiết lập danh mục tác phẩm nghệ thuật thư viện của bạn.
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="bg-primary hover:bg-primary/95 text-white font-bold gap-2 h-10 px-5 text-xs rounded-lg shadow-sm shadow-primary/15 cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          Thêm sách mới
        </Button>
      </div>

      {/* Filter Bar Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Keyword Search */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Từ khóa</label>
            <div className="relative">
              <Search className="absolute inset-y-0 left-3 h-3.5 w-3.5 my-auto text-slate-400" />
              <Input
                placeholder="Tên sách, tác giả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs font-semibold rounded-lg h-9 w-full focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary outline-none"
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Thể loại</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary h-9 transition-all cursor-pointer"
            >
              <option value="">Tất cả thể loại</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Author Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Tác giả</label>
            <select
              value={selectedAuthor}
              onChange={(e) => {
                setSelectedAuthor(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary h-9 transition-all cursor-pointer"
            >
              <option value="">Tất cả tác giả</option>
              {authors.map((aut: any) => (
                <option key={aut.id} value={aut.id}>
                  {aut.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Switcher Toggle pills */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Trạng thái</label>
            <div className="flex gap-1 p-1 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-800 h-9">
              {(["ALL", "ACTIVE", "HIDDEN", "DRAFT"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`flex-1 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                    selectedStatus === st
                      ? "bg-primary text-white shadow-sm shadow-primary/10"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {st === "ALL" ? "Tất cả" : st === "ACTIVE" ? "Mở bán" : st === "HIDDEN" ? "Ẩn" : "Nháp"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Clear Filters Button */}
        {(searchTerm || selectedCategory || selectedAuthor || selectedStatus !== "ALL") && (
          <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-lg text-xs font-extrabold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer animate-fade-in"
            >
              <X className="h-3.5 w-3.5" />
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {isLoadingBooks ? (
        <div className="flex flex-col justify-center items-center py-20 space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Đang tải danh sách tác phẩm nghệ thuật...</p>
        </div>
      ) : booksError ? (
        <div className="p-8 text-center text-red-650 dark:text-red-405 font-bold border border-red-200 dark:border-red-800/50 rounded-xl bg-red-50 dark:bg-red-950/20 text-xs shadow-sm">
          Không thể kết nối đến máy chủ: {booksError.message}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-24 text-slate-500 dark:text-slate-400 font-bold border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs">
          Không tìm thấy cuốn sách nào khớp với bộ lọc của bạn.
        </div>
      ) : (
        /* Grid of Books + Pagination Wrapper */
        <div className="space-y-6">
          <BooksGrid
            books={books}
            onEdit={handleOpenEdit}
            onToggleStatus={toggleBookStatus}
            onDelete={handleDelete}
          />

          {/* Styled Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between bg-white dark:bg-slate-900 shadow-sm">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Đang hiển thị{" "}
                <span className="font-extrabold text-slate-700 dark:text-slate-350">{Math.min((page - 1) * 10 + 1, totalItems)}</span>
                {" - "}
                <span className="font-extrabold text-slate-700 dark:text-slate-350">{Math.min(page * 10, totalItems)}</span> trong
                tổng số <span className="font-extrabold text-primary dark:text-primary-fixed-dim">{totalItems}</span> đầu sách
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                  className="p-1.5 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setPage(pg)}
                    className={`w-7.5 h-7.5 rounded text-xs font-extrabold transition-all cursor-pointer ${
                      page === pg
                        ? "bg-primary text-white shadow-sm shadow-primary/20"
                        : "border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {pg}
                  </button>
                ))}

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                  className="p-1.5 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <BookDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        isAddMode={isAddMode}
        book={editingBook}
        categories={categories}
        authors={authors}
        onSave={handleSave}
        isSaving={createBookMutation.isPending || updateBookMutation.isPending}
      />
    </div>
  );
};
