import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoriesPanel } from "@/components/staff-categories/categories-panel";
import { AuthorsPanel } from "@/components/staff-categories/authors-panel";
import { categoryService } from "@/services/category-service";
import { authorService } from "@/services/author-service";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
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

export const StaffCategories: React.FC = () => {
  const queryClient = useQueryClient();

  // Form states
  const [catName, setCatName] = useState("");
  const [athName, setAthName] = useState("");
  const [athBio, setAthBio] = useState("");

  // Confirmation States
  const [catToDelete, setCatToDelete] = useState<string | null>(null);
  const [authorToDelete, setAuthorToDelete] = useState<string | null>(null);

  // 1. Queries
  const { data: categoriesData, isLoading: isLoadingCats, error: catsError } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories(),
  });

  const { data: authorsData, isLoading: isLoadingAuthors, error: authorsError } = useQuery({
    queryKey: ["authors"],
    queryFn: () => authorService.getAuthors(),
  });

  // 2. Category Mutations
  const createCategoryMutation = useMutation({
    mutationFn: (name: string) => categoryService.createCategory({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setCatName("");
      toast.success("Thêm mới thể loại thành công!");
    },
    onError: (err: any) => {
      toast.error(`Lỗi thêm thể loại: ${err.message}`);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Đã xóa thể loại thành công!");
    },
    onError: (err: any) => {
      toast.error(`Lỗi xóa thể loại: ${err.message}`);
    },
  });

  // 3. Author Mutations
  const createAuthorMutation = useMutation({
    mutationFn: (data: { name: string; info: string }) => authorService.createAuthor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      setAthName("");
      setAthBio("");
      toast.success("Thêm mới tác giả thành công!");
    },
    onError: (err: any) => {
      toast.error(`Lỗi thêm tác giả: ${err.message}`);
    },
  });

  const deleteAuthorMutation = useMutation({
    mutationFn: (id: string) => authorService.deleteAuthor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      toast.success("Đã xóa tác giả khỏi hệ thống thành công!");
    },
    onError: (err: any) => {
      toast.error(`Lỗi xóa tác giả: ${err.message}`);
    },
  });

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    createCategoryMutation.mutate(catName.trim());
  };

  const handleAddAuthor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!athName.trim()) return;
    createAuthorMutation.mutate({ name: athName.trim(), info: athBio.trim() });
  };

  const handleDeleteCategory = (id: string) => {
    setCatToDelete(id);
  };

  const handleDeleteAuthor = (id: string) => {
    setAuthorToDelete(id);
  };

  const categories = categoriesData?.data || [];
  const authors = authorsData?.data || [];

  if (isLoadingCats || isLoadingAuthors) {
    return (
      <div className="flex flex-col justify-center items-center py-20 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground font-semibold">Đang tải danh mục & tác giả từ hệ thống...</p>
      </div>
    );
  }

  if (catsError || authorsError) {
    return (
      <div className="p-8 text-center text-destructive font-semibold border border-destructive/20 rounded-md bg-destructive/5 text-xs">
        Lỗi kết nối API: {((catsError || authorsError) as any)?.message}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <label className="sr-only">Quản lý thể loại và tác giả</label>
      {/* CATEGORIES COLUMN */}
      <div className="space-y-6">
        <CategoriesPanel
          categories={categories}
          catName={catName}
          setCatName={setCatName}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      </div>

      {/* AUTHORS COLUMN */}
      <div className="space-y-6">
        <AuthorsPanel
          authors={authors}
          athName={athName}
          setAthName={setAthName}
          athBio={athBio}
          setAthBio={setAthBio}
          onAddAuthor={handleAddAuthor}
          onDeleteAuthor={handleDeleteAuthor}
        />
      </div>

      {/* Category deletion alert */}
      <AlertDialog open={!!catToDelete} onOpenChange={(open) => !open && setCatToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa thể loại sách?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn muốn xóa thể loại này? Các đầu sách thuộc thể loại này sẽ chuyển sang trạng thái "Chưa phân loại". Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (catToDelete) {
                  deleteCategoryMutation.mutate(catToDelete);
                  setCatToDelete(null);
                }
              }}
            >
              Xóa thể loại
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Author deletion alert */}
      <AlertDialog open={!!authorToDelete} onOpenChange={(open) => !open && setAuthorToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa tác giả?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn muốn xóa tác giả này khỏi hệ thống? Các đầu sách liên kết với tác giả này vẫn được bảo toàn nhưng thông tin tác giả sẽ bị gỡ bỏ.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (authorToDelete) {
                  deleteAuthorMutation.mutate(authorToDelete);
                  setAuthorToDelete(null);
                }
              }}
            >
              Xóa tác giả
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
