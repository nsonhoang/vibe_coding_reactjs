import React, { memo } from "react";
import { ArrowLeft, Gift } from "lucide-react";
import { PromotionsBookList } from "./promotions-book-list";
import { PromotionsBookDetail } from "./promotions-book-detail";
import { PromotionsMetaCard } from "./promotions-meta-card";
import type { Promotion } from "@/services/promotion-service";

interface PromotionsDetailViewProps {
  activeSelectedPromo: any;
  onBackToList: () => void;
  selectedBookIdForDetail: string;
  setSelectedBookIdForDetail: (id: string) => void;
  isLoadingBookDetail: boolean;
  bookDetail: any;
  onStartEdit: (promo: Promotion) => void;
  onRemovePromo: (id: string) => void;
  onSendNotification: (promo: Promotion) => void;
  formatDate: (dateStr: string) => string;
  getPromoStatus: (promo: Promotion) => { text: string; class: string };
}

export const PromotionsDetailView: React.FC<PromotionsDetailViewProps> = memo(({
  activeSelectedPromo,
  onBackToList,
  selectedBookIdForDetail,
  setSelectedBookIdForDetail,
  isLoadingBookDetail,
  bookDetail,
  onStartEdit,
  onRemovePromo,
  onSendNotification,
  formatDate,
  getPromoStatus,
}) => {
  return (
    <div className="space-y-6">
      {/* Detail Header navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button
          onClick={onBackToList}
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
          onSelectBookId={setSelectedBookIdForDetail}
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
            onEditPromo={onStartEdit}
            onRemovePromo={onRemovePromo}
            onSendNotification={onSendNotification}
            formatDate={formatDate}
            getPromoStatus={getPromoStatus}
          />
        </div>
      </div>
    </div>
  );
});

PromotionsDetailView.displayName = "PromotionsDetailView";
