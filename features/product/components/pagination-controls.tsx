import React from 'react'

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) => {
  if (totalPages <= 1) return null

  return (
    <div className="mt-8 flex items-center justify-center gap-2 pb-6">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="flex h-10 w-10 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-600 transition hover:bg-neutral-50 disabled:opacity-50 disabled:hover:bg-white"
        aria-label="Previous Page"
      >
        &lt;
      </button>

      {Array.from({ length: totalPages }).map((_, index) => {
        const pageNum = index + 1
        const isActive = pageNum === currentPage
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`flex h-10 w-10 items-center justify-center rounded-md border text-sm font-semibold transition ${
              isActive
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {pageNum}
          </button>
        )
      })}

      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="flex h-10 w-10 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-600 transition hover:bg-neutral-50 disabled:opacity-50 disabled:hover:bg-white"
        aria-label="Next Page"
      >
        &gt;
      </button>
    </div>
  )
}

export default PaginationControls
