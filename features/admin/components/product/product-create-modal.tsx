'use client'

import React, { useState } from 'react'
import { AdminModal } from '../ui/admin-modal'
import { AdminInput } from '../ui/admin-input'
import { AdminLabel } from '../ui/admin-label'
import { AdminTextarea } from '../ui/admin-textarea'
import { AdminButton } from '../ui/admin-button'
import { AdminImageUpload } from '../ui/admin-image-upload'
import { Product } from '@/features/product/store/product.slice'

interface ProductCreateModalProps {
  isOpen: boolean
  onClose: () => void
  onAddProduct: (product: Product) => void
}

export const ProductCreateModal: React.FC<ProductCreateModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
}) => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

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

    const newProduct: Product = {
      id: Date.now(),
      name: name.trim(),
      priceValue: priceNum,
      price: `$${priceNum.toLocaleString('en-US')}`,
      quantity: Number(quantity) || 1,
      description: description.trim(),
      image: image.trim(),
      rating: 5,
    }

    onAddProduct(newProduct)

    // Reset form & close modal
    setName('')
    setPrice('')
    setQuantity('')
    setDescription('')
    setImage('')
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
          const formElement = document.getElementById('create-product-form') as HTMLFormElement
          if (formElement) formElement.requestSubmit()
        }}
        className="px-6 bg-[#0F60FF] hover:bg-[#0C53DF] text-white font-medium"
      >
        Tạo mới
      </AdminButton>
    </>
  )

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo mới sản phẩm"
      footer={modalFooter}
    >
      <form id="create-product-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Tên sản phẩm */}
        <div>
          <AdminLabel htmlFor="product-name">
            Tên sản phẩm <span className="text-[#0F60FF]">*</span>
          </AdminLabel>
          <AdminInput
            id="product-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên sản phẩm"
          />
        </div>

        {/* Giá */}
        <div>
          <AdminLabel htmlFor="product-price">
            Giá <span className="text-[#0F60FF]">*</span>
          </AdminLabel>
          <AdminInput
            id="product-price"
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
          <AdminLabel htmlFor="product-quantity">
            Số lượng <span className="text-[#0F60FF]">*</span>
          </AdminLabel>
          <AdminInput
            id="product-quantity"
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
          <AdminLabel htmlFor="product-description">
            Mô tả <span className="text-[#0F60FF]">*</span>
          </AdminLabel>
          <AdminTextarea
            id="product-description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập mô tả"
            rows={4}
          />
        </div>

        {/* Ảnh sản phẩm */}
        <div>
          <AdminLabel htmlFor="product-image">
            Ảnh sản phẩm <span className="text-[#0F60FF]">*</span>
          </AdminLabel>
          <AdminImageUpload
            id="product-image"
            required
            value={image}
            onChange={(val) => setImage(val)}
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

