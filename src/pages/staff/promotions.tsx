import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";

import { PromotionsForm } from "@/components/staff-promotions/promotions-form";
import { PromotionsListTable } from "@/components/staff-promotions/promotions-list-table";
import { PromotionsDetailView } from "@/components/staff-promotions/promotions-detail-view";
import { toLocalDateTimeString, formatDate, getPromoStatus } from "@/components/staff-promotions/promo-utils";

import { promotionService, type Promotion } from "@/services/promotion-service";
import { bookService } from "@/services/book-service";
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

export const StaffPromotions: React.FC = () => {
  const queryClient = useQueryClient();

  // Navigation states
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [selectedBookIdForDetail, setSelectedBookIdForDetail] = useState<string>("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Form states for creation/editing
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);
  const [promoName, setPromoName] = useState("");
  const [rate, setRate] = useState(10);
  const [startDate, setStartDate] = useState(toLocalDateTimeString(new Date()));
  const [endDate, setEndDate] = useState(toLocalDateTimeString(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)));

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  // Deletion confirmation state
  const [promoToDelete, setPromoToDelete] = useState<string | null>(null);

  // Sync debounced search keyword
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when any filter parameters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, startDateFilter, endDateFilter]);

  // 1. Fetch all books for selection
  const { data: booksData, isLoading: isLoadingBooks } = useQuery({
    queryKey: ["books-all-select"],
    queryFn: () => bookService.getBooks({ limit: 100 }),
  });
  const booksList = useMemo(() => booksData?.data?.data || booksData?.data?.items || [], [booksData]);

  // 2. Fetch promotions
  const { data: promotionsData, isLoading: isLoadingPromos, error } = useQuery({
    queryKey: ["promotions", page, debouncedSearch, statusFilter, startDateFilter, endDateFilter],
    queryFn: () =>
      promotionService.getPromotions({
        page,
        limit,
        keyword: debouncedSearch.trim() || undefined,
        isActive: statusFilter === "ACTIVE" ? true : statusFilter === "INACTIVE" ? false : undefined,
        startDate: startDateFilter ? new Date(startDateFilter).toISOString() : undefined,
        endDate: endDateFilter ? new Date(endDateFilter).toISOString() : undefined,
      }),
  });

  const paginatedResult = promotionsData?.data;
  const rawPromotions = useMemo(() => paginatedResult?.data || paginatedResult?.items || [], [paginatedResult]);
  
  const promotions = useMemo(() => {
    return rawPromotions.map((promo: any) => ({
      ...promo,
      books: promo.books && promo.books.length > 0
        ? promo.books
        : (booksList.filter((b: any) => promo.bookIds?.includes(b.id)).map((b: any) => ({
            id: b.id,
            title: b.title,
            price: b.price
          })) || []),
    }));
  }, [rawPromotions, booksList]);

  const totalItems = paginatedResult?.meta?.totalItems || 0;
  const totalPages = paginatedResult?.meta?.totalPages || 1;

  const activeSelectedPromo = useMemo(() => {
    if (!selectedPromo) return null;
    return promotions.find((p) => p.id === selectedPromo.id) || {
      ...selectedPromo,
      books: selectedPromo.books && selectedPromo.books.length > 0
        ? selectedPromo.books
        : (booksList.filter((b: any) => selectedPromo.bookIds?.includes(b.id)).map((b: any) => ({
            id: b.id,
            title: b.title,
            price: b.price
          })) || []),
    };
  }, [selectedPromo, promotions, booksList]);

  // 3. Query specific Book Details
  const { data: bookDetailData, isLoading: isLoadingBookDetail } = useQuery({
    queryKey: ["book-detail-promo", selectedBookIdForDetail],
    queryFn: () => bookService.getBookById(selectedBookIdForDetail),
    enabled: !!selectedBookIdForDetail,
  });
  const bookDetail = bookDetailData?.data;

  // Auto-select first book in details view
  useEffect(() => {
    if (activeSelectedPromo?.books && activeSelectedPromo.books.length > 0) {
      setSelectedBookIdForDetail(activeSelectedPromo.books[0].id);
    } else {
      setSelectedBookIdForDetail("");
    }
  }, [activeSelectedPromo]);

  // Mutations
  const createPromoMutation = useMutation({
    mutationFn: (data: any) => promotionService.createPromotion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      resetFormState();
      setIsAddingNew(false);
      toast.success("Đã thêm chương trình chiết khấu thành công!");
    },
    onError: (err: any) => toast.error(`Lỗi tạo ưu đãi: ${err.response?.data?.message || err.message}`),
  });

  const updatePromoMutation = useMutation({
    mutationFn: ({ id, data }: any) => promotionService.updatePromotion(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      resetFormState();
      if (res.data) setSelectedPromo(res.data);
      setEditingPromo(null);
      toast.success("Đã cập nhật chương trình chiết khấu thành công!");
    },
    onError: (err: any) => toast.error(`Lỗi cập nhật ưu đãi: ${err.response?.data?.message || err.message}`),
  });

  const deletePromoMutation = useMutation({
    mutationFn: (id: string) => promotionService.deletePromotion(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      if (selectedPromo?.id === id) setSelectedPromo(null);
      if (editingPromo?.id === id) {
        setEditingPromo(null);
        resetFormState();
      }
      toast.success("Đã gỡ bỏ chương trình chiết khấu thành công!");
    },
    onError: (err: any) => toast.error(`Lỗi gỡ bỏ ưu đãi: ${err.response?.data?.message || err.message}`),
  });

  const resetFormState = useCallback(() => {
    setPromoName("");
    setRate(10);
    setSelectedBookIds([]);
    setStartDate(toLocalDateTimeString(new Date()));
    setEndDate(toLocalDateTimeString(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)));
  }, []);

  const applyPromoSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!promoName.trim() || selectedBookIds.length === 0 || rate <= 0 || rate > 90) {
      toast.warning("Vui lòng điền tên chương trình, chọn ít nhất 1 đầu sách và đặt chiết khấu phù hợp.");
      return;
    }
    const startISO = new Date(startDate).toISOString();
    const endISO = new Date(endDate).toISOString();
    if (new Date(startDate) > new Date(endDate)) {
      toast.warning("Ngày bắt đầu không được lớn hơn ngày kết thúc.");
      return;
    }
    if (editingPromo) {
      updatePromoMutation.mutate({
        id: editingPromo.id,
        data: { name: promoName.trim(), discountRate: rate, startDate: startISO, endDate: endISO, bookIds: selectedBookIds },
      });
    } else {
      createPromoMutation.mutate({ name: promoName.trim(), discountRate: rate, startDate: startISO, endDate: endISO, bookIds: selectedBookIds });
    }
  }, [promoName, selectedBookIds, rate, startDate, endDate, editingPromo, createPromoMutation, updatePromoMutation]);

  const handleStartEdit = useCallback((promo: Promotion) => {
    setEditingPromo(promo);
    setPromoName(promo.name);
    setRate(promo.discountRate);
    setStartDate(toLocalDateTimeString(promo.startDate));
    setEndDate(toLocalDateTimeString(promo.endDate));
    setSelectedBookIds(promo.bookIds || promo.books?.map((b) => b.id) || []);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingPromo(null);
    setIsAddingNew(false);
    resetFormState();
  }, [resetFormState]);

  const removePromo = useCallback((id: string) => {
    setPromoToDelete(id);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setStartDateFilter("");
    setEndDateFilter("");
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedPromo(null);
    setSelectedBookIdForDetail("");
  }, []);

  const handleAddNew = useCallback(() => {
    resetFormState();
    setIsAddingNew(true);
  }, [resetFormState]);

  if (isLoadingBooks || isLoadingPromos) {
    return (
      <div className="flex flex-col justify-center items-center py-20 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground font-semibold">Đang tải dữ liệu chương trình khuyến mãi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-rose-500 font-semibold border border-rose-500/20 rounded-xl bg-rose-500/5 text-xs">
        Lỗi kết nối máy chủ: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <label className="sr-only">Quản lý chương trình khuyến mãi</label>
      {isAddingNew || editingPromo ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handleCancelEdit}
              className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg shadow-sm cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại danh sách
            </button>
            <h2 className="text-base font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              {editingPromo ? `Sửa ưu đãi: ${editingPromo.name}` : "Tạo chương trình ưu đãi mới"}
            </h2>
          </div>
          <div className="max-w-2xl mx-auto">
            <PromotionsForm
              books={booksList}
              selectedBookIds={selectedBookIds}
              setSelectedBookIds={setSelectedBookIds}
              rate={rate}
              setRate={setRate}
              promoName={promoName}
              setPromoName={setPromoName}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              onApplyPromo={applyPromoSubmit}
              isSubmitting={createPromoMutation.isPending || updatePromoMutation.isPending}
              isEditMode={!!editingPromo}
              onCancelEdit={handleCancelEdit}
            />
          </div>
        </div>
      ) : activeSelectedPromo ? (
        <PromotionsDetailView
          activeSelectedPromo={activeSelectedPromo}
          onBackToList={handleBackToList}
          selectedBookIdForDetail={selectedBookIdForDetail}
          setSelectedBookIdForDetail={setSelectedBookIdForDetail}
          isLoadingBookDetail={isLoadingBookDetail}
          bookDetail={bookDetail}
          onStartEdit={handleStartEdit}
          onRemovePromo={removePromo}
          formatDate={formatDate}
          getPromoStatus={getPromoStatus}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-855 dark:text-slate-100 uppercase tracking-wider">Ưu đãi giảm giá đầu sách</h2>
              <p className="text-xs text-slate-450 dark:text-slate-400 font-semibold mt-1">
                Theo dõi các đợt chiết khấu trực tiếp trên sản phẩm sách đang áp dụng trong hệ thống Bookstore
              </p>
            </div>
            <Button
              onClick={handleAddNew}
              className="bg-primary hover:bg-primary/95 text-white font-bold gap-1.5 h-10 px-5 text-xs rounded-lg shadow-md shadow-primary/10 cursor-pointer flex items-center"
            >
              <Plus className="h-4 w-4" />
              Thêm chương trình khuyến mãi
            </Button>
          </div>

          <PromotionsListTable
            promotions={promotions}
            onSelectPromo={setSelectedPromo}
            onRemovePromo={removePromo}
            isSubmitting={deletePromoMutation.isPending}
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={setPage}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            startDateFilter={startDateFilter}
            setStartDateFilter={setStartDateFilter}
            endDateFilter={endDateFilter}
            setEndDateFilter={setEndDateFilter}
            onClearFilters={handleClearFilters}
            formatDate={formatDate}
            getPromoStatus={getPromoStatus}
          />
        </div>
      )}

      {/* Modern Shadcn UI AlertDialog confirmation */}
      <AlertDialog open={!!promoToDelete} onOpenChange={(open) => !open && setPromoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận gỡ bỏ chương trình?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn gỡ bỏ chương trình chiết khấu này không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (promoToDelete) {
                  deletePromoMutation.mutate(promoToDelete);
                  setPromoToDelete(null);
                }
              }}
            >
              Gỡ bỏ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
