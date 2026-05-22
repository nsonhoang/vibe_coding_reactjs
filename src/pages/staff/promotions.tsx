import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Gift, Loader2 } from "lucide-react";
import { PromotionsForm } from "@/components/staff-promotions/promotions-form";
import { PromotionsTable } from "@/components/staff-promotions/promotions-table";
import { promotionService } from "@/services/promotion-service";
import { bookService } from "@/services/book-service";

export const StaffPromotions: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedBookId, setSelectedBookId] = useState("");
  const [promoName, setPromoName] = useState("");
  const [rate, setRate] = useState(10);

  // 1. Fetch all books (for selecting)
  const { data: booksData, isLoading: isLoadingBooks } = useQuery({
    queryKey: ["books", ""],
    queryFn: () => bookService.getBooks({ limit: 100 }),
  });

  const books = booksData?.data?.items || [];

  // Sync default book selection
  useEffect(() => {
    if (books.length > 0 && !selectedBookId) {
      setSelectedBookId(books[0].id);
    }
  }, [books, selectedBookId]);

  // 2. Fetch promotions
  const { data: promotionsData, isLoading: isLoadingPromos, error } = useQuery({
    queryKey: ["promotions"],
    queryFn: () => promotionService.getPromotions(),
  });

  const promotions = promotionsData?.data?.items || [];

  // 3. Mutations
  const createPromoMutation = useMutation({
    mutationFn: (data: { name: string; discountRate: number; bookIds: string[] }) => {
      const today = new Date();
      const nextYear = new Date();
      nextYear.setFullYear(today.getFullYear() + 1);

      return promotionService.createPromotion({
        name: data.name,
        discountRate: data.discountRate,
        startDate: today.toISOString(),
        endDate: nextYear.toISOString(),
        bookIds: data.bookIds,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      setPromoName("");
      setRate(10);
      alert("Đã tạo chương trình khuyến mãi thành công!");
    },
    onError: (err: any) => {
      alert(`Lỗi tạo khuyến mãi: ${err.message}`);
    },
  });

  const deletePromoMutation = useMutation({
    mutationFn: (id: string) => promotionService.deletePromotion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      alert("Đã xóa chương trình khuyến mãi!");
    },
    onError: (err: any) => {
      alert(`Lỗi xóa khuyến mãi: ${err.message}`);
    },
  });

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoName.trim() || !selectedBookId || rate <= 0 || rate > 90) {
      alert("Vui lòng điền đầy đủ và chính xác thông tin khuyến mãi.");
      return;
    }
    createPromoMutation.mutate({
      name: promoName.trim(),
      discountRate: rate,
      bookIds: [selectedBookId],
    });
  };

  const removePromo = (id: string) => {
    if (window.confirm("Bạn có muốn xóa chương trình chiết khấu này khỏi đầu sách?")) {
      deletePromoMutation.mutate(id);
    }
  };

  if (isLoadingBooks || isLoadingPromos) {
    return (
      <div className="flex flex-col justify-center items-center py-20 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground font-semibold">Đang tải thông tin ưu đãi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-destructive font-semibold border border-destructive/20 rounded-md bg-destructive/5 text-xs">
        Lỗi kết nối máy chủ: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Promotion Config Header */}
      <Card className="border-border bg-gradient-to-r from-sky-500/5 to-transparent">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <Gift className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider">Ưu đãi giảm giá đầu sách</CardTitle>
            <CardDescription className="text-[11px]">
              Áp dụng chương trình chiết khấu trực tiếp trên từng sản phẩm sách
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Add Promotion Form */}
        <PromotionsForm
          books={books}
          selectedBookId={selectedBookId}
          setSelectedBookId={setSelectedBookId}
          rate={rate}
          setRate={setRate}
          promoName={promoName}
          setPromoName={setPromoName}
          onApplyPromo={applyPromo}
          isSubmitting={createPromoMutation.isPending}
        />

        {/* Promotions list table */}
        <PromotionsTable
          promotions={promotions}
          onRemovePromo={removePromo}
          isSubmitting={deletePromoMutation.isPending}
        />
      </div>
    </div>
  );
};
