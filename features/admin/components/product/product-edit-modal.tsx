'use client'

import React, { useState, useEffect } from 'react'
import { AdminModal } from '../ui/admin-modal'
import { AdminInput } from '../ui/admin-input'
import { AdminLabel } from '../ui/admin-label'
import { AdminTextarea } from '../ui/admin-textarea'
import { AdminButton } from '../ui/admin-button'
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
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (product) {
      setName(product.name || '')
      setPrice(product.priceValue ? product.priceValue.toString() : '')
      setQuantity(product.quantity ? product.quantity.toString() : '1')
      setDescription(product.description || '')
      setImage(product.image || '')
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

    const priceNum = Number(price.replace(/[^0-9]/g, '')) || 0
    if (!priceNum) {
      setErrorMessage('Vui lòng nhập giá sản phẩm hợp lệ.')
      return
    }

    const updatedProduct: Product = {
      ...product,
      name: name.trim(),
      priceValue: priceNum,
      price: `$${priceNum.toLocaleString('en-US')}`,
      quantity: Number(quantity) || 1,
      description: description.trim() || 'Lorem ipsum dolor sit amet',
      image: image.trim() || '',
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
        onClick={(e) => {
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
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Nhập số lượng sản phẩm"
          />
        </div>

        {/* Mô tả */}
        <div>
          <AdminLabel htmlFor="edit-product-description">Mô tả</AdminLabel>
          <AdminTextarea
            id="edit-product-description"
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
          <AdminInput
            id="edit-product-image"
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
