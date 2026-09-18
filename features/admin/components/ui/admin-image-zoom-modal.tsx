'use client'

import React, { useEffect } from 'react'
import { X } from 'lucide-react'

export interface AdminImageZoomModalProps {
  isOpen: boolean
  onClose: () => void
  src: string | null
  title?: string
}

export const AdminImageZoomModal: React.FC<AdminImageZoomModalProps> = ({
  isOpen,
  onClose,
  src,
  title,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`
      }
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || !src) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-200">
      {/* Dark backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Close button top-right */}
      <button
        type="button"
        onClick={onClose}
        className="fixed top-5 right-5 z-[110] p-2.5 rounded-full bg-black/10 hover:bg-black/35 text-white/90 hover:text-white transition-all cursor-pointer shadow-lg backdrop-blur-md"
        title="Đóng (Esc)"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Centered Image Container without dark frame/padding */}
      <div
        className="relative z-[105] flex flex-col items-center justify-center animate-in zoom-in-95 duration-200 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden rounded-xl shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={title || 'Enlarged view'}
            className="max-w-[85vw] max-h-[80vh] w-auto h-auto object-contain rounded-xl select-none block"
          />
        </div>

        {/* Title / Caption tag if provided */}
        {title && (
          <div className="mt-3 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white font-medium text-xs sm:text-sm shadow-lg text-center max-w-[80vw] truncate">
            {title}
          </div>
        )}
      </div>
    </div>
  )
}

