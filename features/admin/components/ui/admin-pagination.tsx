import React from 'react'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'

interface AdminPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export const AdminPagination: React.FC<AdminPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 bg-white border-t border-slate-100 text-xs text-slate-500 font-medium">
      {/* Left: Items per page selector */}
      <div className="flex items-center gap-2">
        <span>Showing</span>
        <div className="relative inline-flex items-center">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-7.5 rounded-[6px] border border-slate-200 bg-white pl-2.5 pr-5.5 text-xs text-slate-700 font-medium focus:border-[#0F60FF] focus:outline-none cursor-pointer appearance-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-1.5 pointer-events-none stroke-[2]" />
        </div>
        <span>of {totalItems}</span>
      </div>

      {/* Right: Page navigation buttons */}
      <div className="flex items-center gap-1.5 select-none">
        {/* Previous page arrow */}
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="h-8 w-8 inline-flex items-center justify-center rounded-[8px] bg-[#F1F2F6] hover:bg-[#E7E9ED] text-[#8B909A] disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
          aria-label="Previous Page"
        >
          <ChevronLeft className="h-4.5 w-4.5 stroke-[2.25]" />
        </button>

        {/* Page numbers */}
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`h-8 w-8 inline-flex items-center justify-center rounded-[8px] text-[13px] font-semibold transition cursor-pointer ${
              page === currentPage
                ? 'bg-[#0F60FF] text-white shadow-xs'
                : 'bg-[#F1F2F6] hover:bg-[#E7E9ED] text-[#8B909A]'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next page arrow */}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="h-8 w-8 inline-flex items-center justify-center rounded-[8px] bg-[#F1F2F6] hover:bg-[#E7E9ED] text-[#8B909A] disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
          aria-label="Next Page"
        >
          <ChevronRight className="h-4.5 w-4.5 stroke-[2.25]" />
        </button>
      </div>
    </div>
  )
}
