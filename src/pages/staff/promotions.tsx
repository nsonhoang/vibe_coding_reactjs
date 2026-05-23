import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Loader2, ArrowLeft, Plus } from "lucide-react";

// Import modular decoupled subcomponents
import { PromotionsForm } from "@/components/staff-promotions/promotions-form";
import { PromotionsListTable } from "@/components/staff-promotions/promotions-list-table";
import { PromotionsBookList } from "@/components/staff-promotions/promotions-book-list";
import { PromotionsBookDetail } from "@/components/staff-promotions/promotions-book-detail";
import { PromotionsMetaCard } from "@/components/staff-promotions/promotions-meta-card";

import { promotionService, type Promotion } from "@/services/promotion-service";
import { bookService } from "@/services/book-service";

export const StaffPromotions: React.FC = () => {
  const queryClient = useQueryClient();

  // Navigation states
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);

  // Split-view state for book selection inside a promotion
  const [selectedBookIdForDetail, setSelectedBookIdForDetail] = useState<string>("");

  // Pagination page state
  const [page, setPage] = useState(1);
  const limit = 10;

  // Helper to format Date to YYYY-MM-DDTHH:MM local string for datetime-local
  const toLocalDateTimeString = (dateInput: Date | string) => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "";
    const tzOffset = d.getTimezoneOffset() * 60000;
    const localISO = new Date(d.getTime() - tzOffset).toISOString();
    return localISO.substring(0, 16);
  };

  // Form states for creation/editing
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);
  const [promoName, setPromoName] = useState("");
  const [rate, setRate] = useState(10);
  const [startDate, setStartDate] = useState(toLocalDateTimeString(new Date()));
  const [endDate, setEndDate] = useState(
    toLocalDateTimeString(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
  );

  // Filters state (Outside List)
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  // Sync debounced search keyword
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when any filter parameters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, startDateFilter, endDateFilter]);

  // 1. Fetch all books for form dropdown selection (maximum backend limit is 100)
  const { data: booksData, isLoading: isLoadingBooks } = useQuery({
    queryKey: ["books-all-select"],
    queryFn: () => bookService.getBooks({ limit: 100 }),
  });
  const booksList = booksData?.data?.data || booksData?.data?.items || [];

  // 2. Fetch promotions with active backend-driven pagination and filters
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
  const rawPromotions = paginatedResult?.data || paginatedResult?.items || [];
  
  // Resolve books list for each promotion by filtering from the booksList in memory
  const promotions = rawPromotions.map((promo: any) => ({
    ...promo,
    books: promo.books && promo.books.length > 0
      ? promo.books
      : (booksList.filter((b: any) => promo.bookIds?.includes(b.id)).map((b: any) => ({
          id: b.id,
          title: b.title,
          price: b.price
        })) || []),
  }));

  const totalItems = paginatedResult?.meta?.totalItems || 0;
  const totalPages = paginatedResult?.meta?.totalPages || 1;

  // Derive the active selected promotion (with resolved books) so that it stays up to date
  const activeSelectedPromo = selectedPromo
    ? promotions.find((p) => p.id === selectedPromo.id) || {
        ...selectedPromo,
        books: selectedPromo.books && selectedPromo.books.length > 0
          ? selectedPromo.books
          : (booksList.filter((b: any) => selectedPromo.bookIds?.includes(b.id)).map((b: any) => ({
              id: b.id,
              title: b.title,
              price: b.price
            })) || []),
      }
    : null;

  // 3. Query specific Book Details for the split-pane detailed section
  const { data: bookDetailData, isLoading: isLoadingBookDetail } = useQuery({
    queryKey: ["book-detail-promo", selectedBookIdForDetail],
    queryFn: () => bookService.getBookById(selectedBookIdForDetail),
    enabled: !!selectedBookIdForDetail,
  });
  const bookDetail = bookDetailData?.data;

  // Automatically select the first book in details view when promotion changes
  useEffect(() => {
    if (activeSelectedPromo && activeSelectedPromo.books && activeSelectedPromo.books.length > 0) {
      setSelectedBookIdForDetail(activeSelectedPromo.books[0].id);
    } else {
      setSelectedBookIdForDetail("");
    }
  }, [activeSelectedPromo]);

  // 4. Create Promotion Mutation
  const createPromoMutation = useMutation({
    mutationFn: (data: {
      name: string;
      discountRate: number;
      startDate: string;
      endDate: string;
      bookIds: string[];
    }) => {
      return promotionService.createPromotion(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      resetFormState();
      setIsAddingNew(false);
      alert("Đã thêm chương trình chiết khấu thành công!");
    },
    onError: (err: any) => {
      alert(`Lỗi tạo ưu đãi: ${err.response?.data?.message || err.message}`);
    },
  });

  // 5. Update Promotion Mutation
  const updatePromoMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; discountRate?: number; startDate?: string; endDate?: string; bookIds?: string[] } }) => {
      return promotionService.updatePromotion(id, data);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      resetFormState();
      // If we were editing, return back to detail view with updated values
      if (res.data) {
        setSelectedPromo(res.data);
      }
      setEditingPromo(null);
      alert("Đã cập nhật chương trình chiết khấu thành công!");
    },
    onError: (err: any) => {
      alert(`Lỗi cập nhật ưu đãi: ${err.response?.data?.message || err.message}`);
    },
  });

  // 6. Delete Promotion Mutation
  const deletePromoMutation = useMutation({
    mutationFn: (id: string) => promotionService.deletePromotion(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      if (selectedPromo?.id === id) {
        setSelectedPromo(null);
      }
      if (editingPromo?.id === id) {
        setEditingPromo(null);
        resetFormState();
      }
      alert("Đã gỡ bỏ chương trình chiết khấu thành công!");
    },
    onError: (err: any) => {
      alert(`Lỗi gỡ bỏ ưu đãi: ${err.response?.data?.message || err.message}`);
    },
  });

  const resetFormState = () => {
    setPromoName("");
    setRate(10);
    setSelectedBookIds([]);
    setStartDate(toLocalDateTimeString(new Date()));
    setEndDate(
      toLocalDateTimeString(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
    );
  };

  const applyPromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoName.trim() || selectedBookIds.length === 0 || rate <= 0 || rate > 90) {
      alert("Vui lòng điền tên chương trình, chọn ít nhất 1 đầu sách và đặt chiết khấu phù hợp.");
      return;
    }

    const startISO = new Date(startDate).toISOString();
    const endISO = new Date(endDate).toISOString();

    if (new Date(startDate) > new Date(endDate)) {
      alert("Ngày bắt đầu không được lớn hơn ngày kết thúc.");
      return;
    }

    if (editingPromo) {
      updatePromoMutation.mutate({
        id: editingPromo.id,
        data: {
          name: promoName.trim(),
          discountRate: rate,
          startDate: startISO,
          endDate: endISO,
          bookIds: selectedBookIds,
        },
      });
    } else {
      createPromoMutation.mutate({
        name: promoName.trim(),
        discountRate: rate,
        startDate: startISO,
        endDate: endISO,
        bookIds: selectedBookIds,
      });
    }
  };

  const handleStartEdit = (promo: Promotion) => {
    setEditingPromo(promo);
    setPromoName(promo.name);
    setRate(promo.discountRate);
    setStartDate(toLocalDateTimeString(promo.startDate));
    setEndDate(toLocalDateTimeString(promo.endDate));
    setSelectedBookIds(promo.bookIds || promo.books?.map((b) => b.id) || []);
  };

  const handleCancelEdit = () => {
    setEditingPromo(null);
    setIsAddingNew(false);
    resetFormState();
  };

  const removePromo = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn gỡ bỏ chương trình chiết khấu này không?")) {
      deletePromoMutation.mutate(id);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setStartDateFilter("");
    setEndDateFilter("");
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getPromoStatus = (promo: Promotion) => {
    const now = new Date();
    const start = new Date(promo.startDate);
    const end = new Date(promo.endDate);

    if (!promo.isActive) return { text: "Tạm dừng", class: "bg-slate-500/10 text-slate-600 dark:text-slate-400" };
    if (now < start) return { text: "Sắp diễn ra", class: "bg-amber-500/10 text-amber-600 dark:text-amber-400" };
    if (now > end) return { text: "Đã kết thúc", class: "bg-rose-500/10 text-rose-600 dark:text-rose-400" };
    return { text: "Đang hoạt động", class: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" };
  };

  if (isLoadingBooks || isLoadingPromos) {
    return (
      <div className="flex flex-col justify-center items-center py-20 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground font-semibold">
          Đang tải dữ liệu chương trình khuyến mãi...
        </p>
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

  // RENDER VIEW 3: Form Add / Edit
  if (isAddingNew || editingPromo) {
    return (
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
    );
  }

  // RENDER VIEW 2: Detail Split View
  if (activeSelectedPromo) {
    return (
      <div className="space-y-6">
        {/* Detail Header navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <button
            onClick={() => {
              setSelectedPromo(null);
              setSelectedBookIdForDetail("");
            }}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-lg shadow-sm cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách ưu đãi
          </button>
          <div>
            <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Gift className="h-4.5 w-4.5 text-primary" />
              Chi tiết: {activeSelectedPromo.name}
            </h2>
          </div>
        </div>

        {/* Split Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left panel: Books under this promotion (Col span: 8) */}
          <PromotionsBookList
            books={activeSelectedPromo.books || []}
            discountRate={activeSelectedPromo.discountRate}
            selectedBookId={selectedBookIdForDetail}
            onSelectBookId={(id) => setSelectedBookIdForDetail(id)}
          >
            {/* Slot the detailed viewer inside */}
            {selectedBookIdForDetail && (
              <PromotionsBookDetail
                isLoading={isLoadingBookDetail}
                book={bookDetail}
              />
            )}
          </PromotionsBookList>

          {/* Right panel: Meta card overview (Col span: 4) */}
          <div className="col-span-12 lg:col-span-4">
            <PromotionsMetaCard
              promotion={activeSelectedPromo}
              onEditPromo={(p) => handleStartEdit(p)}
              onRemovePromo={(id) => removePromo(id)}
              formatDate={formatDate}
              getPromoStatus={getPromoStatus}
            />
          </div>
        </div>
      </div>
    );
  }

  // RENDER VIEW 1: Main Promotion List with filters (Default Page view)
  return (
    <div className="space-y-6">
      {/* Page header and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-850 dark:text-slate-100 uppercase tracking-wider">
            Ưu đãi giảm giá đầu sách
          </h2>
          <p className="text-xs text-slate-450 dark:text-slate-400 font-semibold mt-1">
            Theo dõi các đợt chiết khấu trực tiếp trên sản phẩm sách đang áp dụng trong hệ thống Bookstore
          </p>
        </div>
        <Button
          onClick={() => {
            resetFormState();
            setIsAddingNew(true);
          }}
          className="bg-primary hover:bg-primary/95 text-white font-bold gap-1.5 h-10 px-5 text-xs rounded-lg shadow-md shadow-primary/10 cursor-pointer flex items-center"
        >
          <Plus className="h-4 w-4" />
          Thêm chương trình khuyến mãi
        </Button>
      </div>

      {/* Reusable Main Table list */}
      <PromotionsListTable
        promotions={promotions}
        onSelectPromo={(promo) => setSelectedPromo(promo)}
        onRemovePromo={(id) => removePromo(id)}
        isSubmitting={deletePromoMutation.isPending}
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={(p) => setPage(p)}
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
  );
};
