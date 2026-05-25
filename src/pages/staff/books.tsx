import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { BooksGrid } from "@/components/staff-books/books-grid";
import { BookDialog } from "@/components/staff-books/book-dialog";
import { BooksFilters } from "@/components/staff-books/books-filters";

import { bookService, type Book, type BookStatus } from "@/services/book-service";
import { categoryService } from "@/services/category-service";
import { authorService } from "@/services/author-service";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

  // AlertDialog confirmation state
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);

  const limit = 10;

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 1. Fetch Books
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

  // 2. Fetch Categories
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories(),
  });

  // 3. Fetch Authors
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
      toast.success("Thêm mới sách thành công!");
    },
    onError: (err: any) => toast.error(`Lỗi tạo sách: ${err.message}`),
  });

  const updateBookMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => bookService.updateBook(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      setIsDialogOpen(false);
      toast.success("Cập nhật thông tin sách thành công!");
    },
    onError: (err: any) => toast.error(`Lỗi cập nhật thông tin: ${err.message}`),
  });

  const deleteBookMutation = useMutation({
    mutationFn: (id: string) => bookService.deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast.success("Đã xóa cuốn sách khỏi hệ thống thành công!");
    },
    onError: (err: any) => toast.error(`Lỗi xóa sách: ${err.message}`),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookStatus }) =>
      bookService.updateBook(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast.success("Cập nhật trạng thái sách thành công!");
    },
    onError: (err: any) => toast.error(`Lỗi thay đổi trạng thái: ${err.message}`),
  });

  // Callbacks
  const handleOpenAdd = useCallback(() => {
    setIsAddMode(true);
    setEditingBook(null);
    setIsDialogOpen(true);
  }, []);

  const handleOpenEdit = useCallback((b: Book) => {
    setIsAddMode(false);
    setEditingBook(b);
    setIsDialogOpen(true);
  }, []);

  const handleSave = useCallback((formData: FormData) => {
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
  }, [isAddMode, editingBook, createBookMutation, updateBookMutation]);

  const toggleBookStatus = useCallback((b: Book) => {
    const nextStatus = b.status === "ACTIVE" ? "HIDDEN" : "ACTIVE";
    toggleStatusMutation.mutate({ id: b.id, status: nextStatus });
  }, [toggleStatusMutation]);

  const handleDelete = useCallback((id: string) => {
    setBookToDelete(id);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setDebouncedSearch("");
    setSelectedCategory("");
    setSelectedAuthor("");
    setSelectedStatus("ALL");
    setPage(1);
  }, []);

  const paginatedResult = booksData?.data;
  const rawBooks = useMemo(() => paginatedResult?.data || paginatedResult?.items || [], [paginatedResult]);
  const books = useMemo(() => rawBooks.filter((b: Book) => selectedStatus === "ALL" || b.status === selectedStatus), [rawBooks, selectedStatus]);

  const totalItems = paginatedResult?.meta?.totalItems || 0;
  const totalPages = paginatedResult?.meta?.totalPages || 1;

  const categories = useMemo(() => categoriesData?.data || [], [categoriesData]);
  const authors = useMemo(() => authorsData?.data || [], [authorsData]);

  const renderPages = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "ellipsis", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "ellipsis", page - 1, page, page + 1, "ellipsis", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      <label className="sr-only">Quản lý kho sách thư viện</label>
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

      <BooksFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedAuthor={selectedAuthor}
        setSelectedAuthor={setSelectedAuthor}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        categories={categories}
        authors={authors}
        onClearFilters={handleClearFilters}
      />

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
        <div className="space-y-6">
          <BooksGrid
            books={books}
            onEdit={handleOpenEdit}
            onToggleStatus={toggleBookStatus}
            onDelete={handleDelete}
          />

          {/* Styled Pagination Controls */}
          {totalPages > 0 && (
            <div className="px-6 py-4 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 shadow-sm">
              <label className="sr-only">Phân trang danh sách sách</label>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Đang hiển thị{" "}
                <span className="font-extrabold text-slate-700 dark:text-slate-350">{Math.min((page - 1) * 10 + 1, totalItems)}</span>
                {" - "}
                <span className="font-extrabold text-slate-700 dark:text-slate-350">{Math.min(page * 10, totalItems)}</span> trong
                tổng số <span className="font-extrabold text-primary dark:text-primary-fixed-dim">{totalItems}</span> đầu sách
              </div>

              <Pagination className="mx-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page > 1) setPage(page - 1);
                      }}
                      aria-disabled={page <= 1}
                      className={page <= 1 ? "pointer-events-none opacity-40" : "cursor-pointer"}
                      text="Trước"
                    />
                  </PaginationItem>

                  {renderPages().map((pg, idx) => (
                    <PaginationItem key={idx}>
                      {pg === "ellipsis" ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(pg as number);
                          }}
                          isActive={page === pg}
                          className="cursor-pointer font-bold text-xs"
                        >
                          {pg}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page < totalPages) setPage(page + 1);
                      }}
                      aria-disabled={page >= totalPages}
                      className={page >= totalPages ? "pointer-events-none opacity-40" : "cursor-pointer"}
                      text="Sau"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}

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

      {/* Shadcn UI AlertDialog confirmation */}
      <AlertDialog open={!!bookToDelete} onOpenChange={(open) => !open && setBookToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận ngừng xuất bản sách?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có thực sự muốn ngừng xuất bản và xóa cuốn sách này khỏi hệ thống? Hành động này sẽ thay đổi trạng thái của sách.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Quay lại</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (bookToDelete) {
                  deleteBookMutation.mutate(bookToDelete);
                  setBookToDelete(null);
                }
              }}
            >
              Ngừng xuất bản & Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
