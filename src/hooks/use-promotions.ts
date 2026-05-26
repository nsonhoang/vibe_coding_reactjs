import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { promotionService, type Promotion } from "@/services/promotion-service";
import { bookService } from "@/services/book-service";
import { toLocalDateTimeString } from "@/components/staff-promotions/promo-utils";

export const usePromotions = () => {
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

  // Notification broadcast modal state
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyBody, setNotifyBody] = useState("");
  const [promoToNotify, setPromoToNotify] = useState<Promotion | null>(null);

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

  // Reset form
  const resetFormState = useCallback(() => {
    setPromoName("");
    setRate(10);
    setSelectedBookIds([]);
    setStartDate(toLocalDateTimeString(new Date()));
    setEndDate(toLocalDateTimeString(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)));
  }, []);

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

  const notifyPromoMutation = useMutation({
    mutationFn: ({ id, title, body }: { id: string; title: string; body: string }) =>
      promotionService.notifyPromotion(id, { title, body }),
    onSuccess: () => {
      setIsNotifyModalOpen(false);
      toast.success("Đã gửi thông báo ưu đãi thành công đến tất cả thành viên!");
    },
    onError: (err: any) => {
      toast.error(`Lỗi gửi thông báo: ${err.response?.data?.message || err.message}`);
    },
  });

  const handleOpenNotifyModal = useCallback((promo: Promotion) => {
    setPromoToNotify(promo);
    setNotifyTitle(`🔥 Siêu ưu đãi: ${promo.name} đã bắt đầu!`);
    setNotifyBody(`Nhận ngay chiết khấu hấp dẫn giảm giá cực sâu -${promo.discountRate}% cho hàng loạt cuốn sách cực hot tại Bookstore. Đừng bỏ lỡ, mua ngay hôm nay!`);
    setIsNotifyModalOpen(true);
  }, []);

  const handleSendNotificationSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!promoToNotify) return;
    if (!notifyTitle.trim() || !notifyBody.trim()) {
      toast.warning("Vui lòng nhập đầy đủ tiêu đề và nội dung thông báo.");
      return;
    }
    notifyPromoMutation.mutate({
      id: promoToNotify.id,
      title: notifyTitle.trim(),
      body: notifyBody.trim(),
    });
  }, [promoToNotify, notifyTitle, notifyBody, notifyPromoMutation]);

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

  const confirmDeletePromo = useCallback(() => {
    if (promoToDelete) {
      deletePromoMutation.mutate(promoToDelete);
      setPromoToDelete(null);
    }
  }, [promoToDelete, deletePromoMutation]);

  return {
    selectedPromo,
    setSelectedPromo,
    isAddingNew,
    setIsAddingNew,
    editingPromo,
    setEditingPromo,
    selectedBookIdForDetail,
    setSelectedBookIdForDetail,
    page,
    setPage,
    
    selectedBookIds,
    setSelectedBookIds,
    promoName,
    setPromoName,
    rate,
    setRate,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    startDateFilter,
    setStartDateFilter,
    endDateFilter,
    setEndDateFilter,
    
    promoToDelete,
    setPromoToDelete,
    isNotifyModalOpen,
    setIsNotifyModalOpen,
    notifyTitle,
    setNotifyTitle,
    notifyBody,
    setNotifyBody,
    promoToNotify,
    
    booksList,
    isLoadingBooks,
    promotions,
    isLoadingPromos,
    error,
    totalPages,
    totalItems,
    activeSelectedPromo,
    isLoadingBookDetail,
    bookDetail,
    
    handleOpenNotifyModal,
    handleSendNotificationSubmit,
    applyPromoSubmit,
    handleStartEdit,
    handleCancelEdit,
    removePromo,
    confirmDeletePromo,
    handleClearFilters,
    handleBackToList,
    handleAddNew,
    
    isPendingDelete: deletePromoMutation.isPending,
    isPendingNotify: notifyPromoMutation.isPending,
    isPendingSubmit: createPromoMutation.isPending || updatePromoMutation.isPending,
  };
};
