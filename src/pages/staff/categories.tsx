import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoriesPanel } from "@/components/staff-categories/categories-panel";
import { AuthorsPanel } from "@/components/staff-categories/authors-panel";
import { categoryService } from "@/services/category-service";
import { authorService } from "@/services/author-service";
import { Loader2 } from "lucide-react";

export const StaffCategories: React.FC = () => {
  const queryClient = useQueryClient();

  // Form states
  const [catName, setCatName] = useState("");
  const [athName, setAthName] = useState("");
  const [athBio, setAthBio] = useState("");

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
    },
    onError: (err: any) => {
      alert(`Lỗi thêm thể loại: ${err.message}`);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err: any) => {
      alert(`Lỗi xóa thể loại: ${err.message}`);
    },
  });

  // 3. Author Mutations
  const createAuthorMutation = useMutation({
    mutationFn: (data: { name: string; info: string }) => authorService.createAuthor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      setAthName("");
      setAthBio("");
    },
    onError: (err: any) => {
      alert(`Lỗi thêm tác giả: ${err.message}`);
    },
  });

  const deleteAuthorMutation = useMutation({
    mutationFn: (id: string) => authorService.deleteAuthor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
    },
    onError: (err: any) => {
      alert(`Lỗi xóa tác giả: ${err.message}`);
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
    if (window.confirm("Bạn muốn xóa thể loại này? Các đầu sách thuộc thể loại này sẽ chuyển sang 'Chưa phân loại'.")) {
      deleteCategoryMutation.mutate(id);
    }
  };

  const handleDeleteAuthor = (id: string) => {
    if (window.confirm("Bạn muốn xóa tác giả này khỏi hệ thống?")) {
      deleteAuthorMutation.mutate(id);
    }
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
    </div>
  );
};
