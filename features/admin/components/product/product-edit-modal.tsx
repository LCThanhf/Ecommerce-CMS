'use client'

import React, { useState, useEffect } from 'react'
import { AdminModal } from '../ui/admin-modal'
import { AdminInput } from '../ui/admin-input'
import { AdminLabel } from '../ui/admin-label'
import { AdminTextarea } from '../ui/admin-textarea'
import { AdminButton } from '../ui/admin-button'
import { AdminImageUpload } from '../ui/admin-image-upload'
import { Product } from '@/features/product/store/product.slice'

interface ProductEditModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  onUpdateProduct: (product: Product) => void
}

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
  isOpen,
  onClose,
  product,
  onUpdateProduct,
}) => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [subImage1, setSubImage1] = useState('')
  const [subImage2, setSubImage2] = useState('')
  const [subImage3, setSubImage3] = useState('')
  const [rating, setRating] = useState('5')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (product) {
      setName(product.name || '')
      setPrice(product.priceValue ? product.priceValue.toString() : '')
      setQuantity(product.quantity ? product.quantity.toString() : '1')
      setDescription(product.description || '')
      setImage(product.image || '')
      setSubImage1(product.subImage1 || '')
      setSubImage2(product.subImage2 || '')
      setSubImage3(product.subImage3 || '')
      setRating(product.rating ? product.rating.toString() : '5')
      setErrorMessage('')
    }
  }, [product, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!product) return

    if (!name.trim()) {
      setErrorMessage('Vui lòng nhập tên sản phẩm.')
      return
    }

    const priceNum = Number(price)
    if (!price || isNaN(priceNum) || priceNum <= 0) {
      setErrorMessage('Vui lòng nhập giá sản phẩm hợp lệ.')
      return
    }

    if (!description.trim()) {
      setErrorMessage('Vui lòng nhập mô tả sản phẩm.')
      return
    }

    if (!image.trim()) {
      setErrorMessage('Vui lòng tải lên ảnh sản phẩm.')
      return
    }

    if (!subImage1.trim() || !subImage2.trim() || !subImage3.trim()) {
      setErrorMessage('Vui lòng tải lên đủ 3 ảnh phụ.')
      return
    }

    const updatedProduct: Product = {
      ...product,
      name: name.trim(),
      priceValue: priceNum,
      price: `${priceNum.toLocaleString('vi-VN')} VNĐ`,
      quantity: Number(quantity) || 1,
      description: description.trim(),
      image: image.trim(),
      subImage1: subImage1.trim(),
      subImage2: subImage2.trim(),
      subImage3: subImage3.trim(),
      rating: Number(rating) || 5,
    }

    onUpdateProduct(updatedProduct)
    onClose()
  }

  const modalFooter = (
    <>
      <AdminButton
        type="button"
        variant="outline"
        onClick={onClose}
        className="px-6 border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-medium"
      >
        Hủy
      </AdminButton>
      <AdminButton
        type="button"
        variant="primary"
        onClick={() => {
          const formElement = document.getElementById('edit-product-form') as HTMLFormElement
          if (formElement) formElement.requestSubmit()
        }}
        className="px-6 bg-[#0F60FF] hover:bg-[#0C53DF] text-white font-medium"
      >
        Lưu
      </AdminButton>
    </>
  )

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Chỉnh sửa sản phẩm"
      footer={modalFooter}
    >
      <form id="edit-product-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Tên sản phẩm */}
        <div>
          <AdminLabel htmlFor="edit-product-name">
            Tên sản phẩm <span className="text-[#0F60FF]">*</span>
          </AdminLabel>
          <AdminInput
            id="edit-product-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên sản phẩm"
          />
        </div>

        {/* Giá */}
        <div>
          <AdminLabel htmlFor="edit-product-price">
            Giá <span className="text-[#0F60FF]">*</span>
          </AdminLabel>
          <AdminInput
            id="edit-product-price"
            type="number"
            min="0"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Nhập giá sản phẩm"
          />
        </div>

        {/* Số lượng */}
        <div>
          <AdminLabel htmlFor="edit-product-quantity">
            Số lượng <span className="text-[#0F60FF]">*</span>
          </AdminLabel>
          <AdminInput
            id="edit-product-quantity"
            type="number"
            min="0"
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Nhập số lượng sản phẩm"
          />
        </div>

        {/* Mô tả */}
        <div>
          <AdminLabel htmlFor="edit-product-description">
            Mô tả <span className="text-[#0F60FF]">*</span>
          </AdminLabel>
          <AdminTextarea
            id="edit-product-description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập mô tả"
            rows={4}
          />
        </div>

        {/* Ảnh sản phẩm */}
        <div>
          <AdminLabel htmlFor="edit-product-image">
            Ảnh sản phẩm <span className="text-[#0F60FF]">*</span>
          </AdminLabel>
          <AdminImageUpload
            id="edit-product-image"
            required
            value={image}
            onChange={(val) => setImage(val)}
          />
        </div>

        {/* 3 Ảnh phụ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <AdminLabel>Ảnh phụ 1 <span className="text-[#0F60FF]">*</span></AdminLabel>
            <AdminImageUpload
              id="edit-sub-image-1"
              required
              compact
              value={subImage1}
              onChange={(val) => setSubImage1(val)}
            />
          </div>
          <div>
            <AdminLabel>Ảnh phụ 2 <span className="text-[#0F60FF]">*</span></AdminLabel>
            <AdminImageUpload
              id="edit-sub-image-2"
              required
              compact
              value={subImage2}
              onChange={(val) => setSubImage2(val)}
            />
          </div>
          <div>
            <AdminLabel>Ảnh phụ 3 <span className="text-[#0F60FF]">*</span></AdminLabel>
            <AdminImageUpload
              id="edit-sub-image-3"
              required
              compact
              value={subImage3}
              onChange={(val) => setSubImage3(val)}
            />
          </div>
        </div>

        {/* Đánh giá */}
        <div>
          <AdminLabel htmlFor="edit-product-rating">
            Đánh giá (Sao) <span className="text-[#0F60FF]">*</span>
          </AdminLabel>
          <AdminInput
            id="edit-product-rating"
            type="number"
            min="1"
            max="5"
            step="0.1"
            required
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            placeholder="Nhập số sao (ví dụ: 4.5)"
          />
        </div>

        {/* Error message */}
        {errorMessage && (
          <p className="text-xs text-red-500 font-medium text-center">{errorMessage}</p>
        )}
      </form>
    </AdminModal>
  )
}

