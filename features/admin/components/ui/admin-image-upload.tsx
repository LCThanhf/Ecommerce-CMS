'use client'

import React, { useRef, useState } from 'react'
import { Upload, X, ZoomIn } from 'lucide-react'
import { AdminButton } from './admin-button'
import { AdminImageZoomModal } from './admin-image-zoom-modal'

export interface AdminImageUploadProps {
  id?: string
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
  required?: boolean
  className?: string
  error?: string
  compact?: boolean
}

export const AdminImageUpload: React.FC<AdminImageUploadProps> = ({
  id = 'product-image-upload',
  value,
  onChange,
  disabled = false,
  required = false,
  className = '',
  error,
  compact = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isZoomOpen, setIsZoomOpen] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onChange(reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleTriggerUpload = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className={`w-full ${className}`}>
      <input
        ref={fileInputRef}
        id={id}
        type="file"
        accept="image/*"
        required={required && !value}
        disabled={disabled}
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className="relative flex items-center gap-4 p-3 border border-slate-200 rounded-[6px] bg-slate-50">
          {/* Clickable Image Thumbnail with Zoom hover effect */}
          <div
            onClick={() => setIsZoomOpen(true)}
            className="relative w-16 h-16 rounded-md overflow-hidden bg-white border border-slate-200 flex-shrink-0 flex items-center justify-center cursor-pointer group shadow-2xs"
            title="Nhấp để phóng to ảnh"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <ZoomIn className="w-4 h-4 text-white" />
            </div>
          </div>

          {!compact && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-700 truncate">Đã tải ảnh lên</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Nhấp vào ảnh để phóng to hoặc bấm Thay đổi</p>
            </div>
          )}

          <div className={`flex items-center gap-1 sm:gap-2 ${compact ? 'flex-1 justify-end' : ''}`}>
            {!compact && (
              <AdminButton
                type="button"
                variant="outline"
                size="sm"
                onClick={handleTriggerUpload}
                disabled={disabled}
                className="text-xs h-8 px-2 sm:px-3 whitespace-nowrap"
              >
                <Upload className="w-3.5 h-3.5 mr-1 sm:mr-1.5" />
                Thay đổi
              </AdminButton>
            )}
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-slate-100 transition"
              title="Xóa ảnh"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleTriggerUpload}
          className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-[6px] cursor-pointer transition ${
            error
              ? 'border-red-300 bg-red-50/50 hover:bg-red-50'
              : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 hover:border-slate-300'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-center gap-2">
            <AdminButton
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleTriggerUpload()
              }}
              disabled={disabled}
              className="px-2 sm:px-4 py-2 text-xs font-medium bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-xs whitespace-nowrap"
            >
              <Upload className="w-3.5 h-3.5 mr-1 sm:mr-1.5 text-[#0F60FF]" />
              {compact ? 'Tải ảnh' : 'Tải ảnh lên'}
            </AdminButton>
          </div>
          {!compact && (
            <p className="text-[11px] text-slate-400 mt-2 text-center">
              Nhấp vào nút để chọn và tải ảnh từ máy tính (PNG, JPG, WEBP)
            </p>
          )}
        </div>
      )}

      {/* Enlarged Image Zoom Modal */}
      <AdminImageZoomModal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        src={value || null}
        title="Ảnh sản phẩm / người dùng"
      />
    </div>
  )
}

