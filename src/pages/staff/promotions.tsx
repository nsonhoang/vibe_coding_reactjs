import React from "react";
import { Loader2, ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import { PromotionsForm } from "@/components/staff-promotions/promotions-form";
import { PromotionsListTable } from "@/components/staff-promotions/promotions-list-table";
import { PromotionsDetailView } from "@/components/staff-promotions/promotions-detail-view";
import { PromotionsDeleteDialog } from "@/components/staff-promotions/promotions-delete-dialog";
import { PromotionsNotifyDialog } from "@/components/staff-promotions/promotions-notify-dialog";
import { formatDate, getPromoStatus } from "@/components/staff-promotions/promo-utils";
import { usePromotions } from "@/hooks/use-promotions";

export const StaffPromotions: React.FC = () => {
  const {
    selectedPromo,
    setSelectedPromo,
    isAddingNew,
    editingPromo,
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
    
    isPendingDelete,
    isPendingNotify,
    isPendingSubmit,
  } = usePromotions();

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
              isSubmitting={isPendingSubmit}
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
          onSendNotification={handleOpenNotifyModal}
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
            isSubmitting={isPendingDelete}
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
      <PromotionsDeleteDialog
        isOpen={!!promoToDelete}
        onOpenChange={(open) => !open && setPromoToDelete(null)}
        onConfirm={confirmDeletePromo}
      />

      {/* Premium Widescreen Broadcast Promotion Notification Dialog */}
      <PromotionsNotifyDialog
        isOpen={isNotifyModalOpen}
        onOpenChange={(open) => {
          if (!open && !isPendingNotify) {
            setIsNotifyModalOpen(false);
          }
        }}
        promo={promoToNotify}
        notifyTitle={notifyTitle}
        setNotifyTitle={setNotifyTitle}
        notifyBody={notifyBody}
        setNotifyBody={setNotifyBody}
        onSubmit={handleSendNotificationSubmit}
        isPending={isPendingNotify}
      />
    </div>
  );
};
