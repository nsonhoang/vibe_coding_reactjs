import React, { memo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface UsersPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  page: number;
  setPage: (p: number | ((prev: number) => number)) => void;
}

export const UsersPagination: React.FC<UsersPaginationProps> = memo(({
  currentPage,
  totalPages,
  totalItems,
  page,
  setPage,
}) => {
  if (totalPages <= 1) return null;

  const renderPages = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "ellipsis", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "ellipsis", page - 1, page, page + 1, "ellipsis", totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/40 dark:bg-slate-850/10 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 mt-4 select-none">
      <label className="sr-only">Phân trang người dùng</label>
      {/* Descriptive counter */}
      <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
        Hiển thị trang <span className="font-extrabold text-primary dark:text-primary-fixed-dim">{currentPage}</span> / <span className="font-extrabold">{totalPages}</span> (Tổng số <span className="font-extrabold">{totalItems}</span> người dùng)
      </div>

      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) setPage(page - 1);
              }}
              aria-disabled={page <= 1}
              className={page <= 1 ? "pointer-events-none opacity-40" : "cursor-pointer"}
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
                    setPage(pg as number);
                  }}
                  isActive={page === pg}
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
                if (page < totalPages) setPage(page + 1);
              }}
              aria-disabled={page >= totalPages}
              className={page >= totalPages ? "pointer-events-none opacity-40" : "cursor-pointer"}
              text="Sau"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
});

UsersPagination.displayName = "UsersPagination";
