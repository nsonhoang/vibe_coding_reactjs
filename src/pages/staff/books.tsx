import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle, Loader2 } from "lucide-react";
import { BooksGrid } from "@/components/staff-books/books-grid";
import { BookDialog } from "@/components/staff-books/book-dialog";
import { bookService, type Book, type BookStatus } from "@/services/book-service";
import { categoryService } from "@/services/category-service";
import { authorService } from "@/services/author-service";

export const StaffBooks: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"ALL" | "ACTIVE" | "HIDDEN" | "DRAFT" | "ARCHIVED">("ALL");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(true);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Debounce search input
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 1. Fetch Books with API Filters
  const { data: booksData, isLoading: isLoadingBooks, error: booksError } = useQuery({
    queryKey: ["books", debouncedSearch, selectedCategory, selectedAuthor],
    queryFn: () => bookService.getBooks({ 
      keyword: debouncedSearch, 
      categoryId: selectedCategory || undefined,
      authorId: selectedAuthor || undefined,
      limit: 100 
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
        file: formData.get("file") as File || undefined,
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

  // Get raw books & apply client-side status filter
  const rawBooks = booksData?.data?.data || booksData?.data?.items || [];
  const books = rawBooks.filter(
    (b: Book) => selectedStatus === "ALL" || b.status === selectedStatus
  );

  const categories = categoriesData?.data || [];
  const authors = authorsData?.data || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Quản lý kho sách</h2>
          <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">Theo dõi, cập nhật và thiết lập danh mục tác phẩm nghệ thuật thư viện của bạn.</p>
        </div>
        <Button 
          onClick={handleOpenAdd} 
          className="bg-primary hover:bg-primary/95 text-white font-bold gap-2 h-10 px-5 text-xs rounded-lg shadow-sm shadow-primary/15 cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          Thêm sách mới
        </Button>
      </div>

      {/* Filter Bar Grid (Bento style based on books_inventory.html) */}
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
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary h-9 transition-all cursor-pointer"
            >
              <option value="">Tất cả thể loại</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Author Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Tác giả</label>
            <select
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary h-9 transition-all cursor-pointer"
            >
              <option value="">Tất cả tác giả</option>
              {authors.map((aut: any) => (
                <option key={aut.id} value={aut.id}>{aut.name}</option>
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
      </div>

      {isLoadingBooks ? (
        <div className="flex flex-col justify-center items-center py-20 space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Đang tải danh sách tác phẩm nghệ thuật...</p>
        </div>
      ) : booksError ? (
        <div className="p-8 text-center text-red-600 font-semibold border border-red-200 rounded-xl bg-red-50 text-xs">
          Không thể kết nối đến máy chủ: {booksError.message}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-24 text-slate-500 dark:text-slate-400 font-bold border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs">
          Không tìm thấy cuốn sách nào trong hệ thống của bạn.
        </div>
      ) : (
        /* Grid of Books */
        <BooksGrid
          books={books}
          onEdit={handleOpenEdit}
          onToggleStatus={toggleBookStatus}
          onDelete={handleDelete}
        />
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
