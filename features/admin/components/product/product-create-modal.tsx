'use client'

import React, { useState } from 'react'
import { AdminModal } from '../ui/admin-modal'
import { AdminInput } from '../ui/admin-input'
import { AdminLabel } from '../ui/admin-label'
import { AdminTextarea } from '../ui/admin-textarea'
import { AdminButton } from '../ui/admin-button'
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

    const priceNum = Number(price.replace(/[^0-9]/g, '')) || 0
    if (!priceNum) {
      setErrorMessage('Vui lòng nhập giá sản phẩm hợp lệ.')
      return
    }

    const newProduct: Product = {
      id: Date.now(),
      name: name.trim(),
      priceValue: priceNum,
      price: `$${priceNum.toLocaleString('en-US')}`,
      quantity: Number(quantity) || 1,
      description: description.trim() || 'Lorem ipsum dolor sit amet',
      image: image.trim() || '',
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
        onClick={(e) => {
          const formElement = document.getElementById('create-product-form') as HTMLFormElement
          if (formElement) formElement.requestSubmit()
        }}
        className="px-6 bg-[#1867FF] hover:bg-[#1056E0] text-white font-medium"
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
            Tên sản phẩm <span className="text-[#1867FF]">*</span>
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
            Giá <span className="text-[#1867FF]">*</span>
          </AdminLabel>
          <AdminInput
            id="product-price"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Nhập giá sản phẩm"
          />
        </div>

        {/* Số lượng */}
        <div>
          <AdminLabel htmlFor="product-quantity">
            Số lượng <span className="text-[#1867FF]">*</span>
          </AdminLabel>
          <AdminInput
            id="product-quantity"
            type="number"
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Nhập số lượng sản phẩm"
          />
        </div>

        {/* Mô tả */}
        <div>
          <AdminLabel htmlFor="product-description">Mô tả</AdminLabel>
          <AdminTextarea
            id="product-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập mô tả"
            rows={4}
          />
        </div>

        {/* Ảnh sản phẩm */}
        <div>
          <AdminLabel htmlFor="product-image">
            Ảnh sản phẩm <span className="text-[#1867FF]">*</span>
          </AdminLabel>
          <AdminInput
            id="product-image"
            required
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Nhập link ảnh sản phẩm"
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
