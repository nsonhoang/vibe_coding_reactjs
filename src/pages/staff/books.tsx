import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle, Loader2 } from "lucide-react";
import { BooksGrid } from "@/components/staff-books/books-grid";
import { BookDialog } from "@/components/staff-books/book-dialog";
import { bookService, type Book } from "@/services/book-service";
import { categoryService } from "@/services/category-service";
import { authorService } from "@/services/author-service";

export const StaffBooks: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

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

  // 1. Fetch Books
  const { data: booksData, isLoading: isLoadingBooks, error: booksError } = useQuery({
    queryKey: ["books", debouncedSearch],
    queryFn: () => bookService.getBooks({ keyword: debouncedSearch, limit: 100 }),
  });

  // 2. Fetch Categories (for Dialog dropdown selection)
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories(),
  });

  // 3. Fetch Authors (for Dialog selection)
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
    mutationFn: ({ id, status }: { id: string; status: "ACTIVE" | "INACTIVE" }) =>
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
      // Vì updateBook nhận JSON thay vì multipart, hoặc convert từ FormData sang JSON object
      const data: any = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        price: Number(formData.get("price")),
        status: formData.get("status") as "ACTIVE" | "INACTIVE",
        categoryId: formData.getAll("categoryId[]") as string[],
        authorId: formData.getAll("authorId[]") as string[],
      };
      
      updateBookMutation.mutate({ id: editingBook.id, data });
    }
  };

  const toggleBookStatus = (b: Book) => {
    const nextStatus = b.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    toggleStatusMutation.mutate({ id: b.id, status: nextStatus });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có thực sự muốn ngừng xuất bản và xóa cuốn sách này khỏi hệ thống?")) {
      deleteBookMutation.mutate(id);
    }
  };

  const books = booksData?.data?.items || [];
  const categories = categoriesData?.data || [];
  const authors = authorsData?.data || [];

  return (
    <div className="space-y-6">
      {/* Search & Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute inset-y-0 left-3 h-4 w-4 my-auto text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm sách, tác giả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>
        <Button onClick={handleOpenAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md shadow-primary/10 gap-2 h-9 text-xs cursor-pointer">
          <PlusCircle className="h-4 w-4" />
          Thêm sách mới
        </Button>
      </div>

      {isLoadingBooks ? (
        <div className="flex flex-col justify-center items-center py-20 space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-semibold">Đang đồng bộ dữ liệu từ server...</p>
        </div>
      ) : booksError ? (
        <div className="p-8 text-center text-destructive font-semibold border border-destructive/20 rounded-md bg-destructive/5 text-xs">
          Không thể kết nối đến máy chủ: {booksError.message}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground font-medium text-xs">
          Không tìm thấy cuốn sách nào trong hệ thống.
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
