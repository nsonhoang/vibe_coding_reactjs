import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PromotionsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export const PromotionsPagination: React.FC<PromotionsPaginationProps> = React.memo(({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}) => {
  if (totalPages <= 0) return null;

  const renderPages = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "ellipsis", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
      <label className="sr-only">Phân trang danh sách</label>
      <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
        Đang hiển thị <span className="font-extrabold text-slate-700 dark:text-slate-300">{Math.min((currentPage - 1) * 10 + 1, totalItems)}</span>
        {" - "}
        <span className="font-extrabold text-slate-700 dark:text-slate-300">{Math.min(currentPage * 10, totalItems)}</span> trong tổng số{" "}
        <span className="font-extrabold text-primary">{totalItems}</span> ưu đãi
      </div>
      
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) onPageChange(currentPage - 1);
              }}
              aria-disabled={currentPage <= 1}
              className={currentPage <= 1 ? "pointer-events-none opacity-40" : "cursor-pointer"}
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
                    onPageChange(pg as number);
                  }}
                  isActive={currentPage === pg}
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
                if (currentPage < totalPages) onPageChange(currentPage + 1);
              }}
              aria-disabled={currentPage >= totalPages}
              className={currentPage >= totalPages ? "pointer-events-none opacity-40" : "cursor-pointer"}
              text="Sau"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
});

PromotionsPagination.displayName = "PromotionsPagination";
