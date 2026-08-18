'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Search, Plus, ZoomIn, ArrowUpDown, ArrowUp, ArrowDown, X, Star } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import {
  AdminTable,
  AdminTableHeader,
  AdminTableHead,
  AdminTableBody,
  AdminTableRow,
  AdminTableCell,
} from '../ui/admin-table'
import { AdminPagination } from '../ui/admin-pagination'
import { AdminButton } from '../ui/admin-button'
import { AdminInput } from '../ui/admin-input'
import { AdminConfirmModal } from '../ui/admin-confirm-modal'
import { AdminImageZoomModal } from '../ui/admin-image-zoom-modal'
import { ProductCreateModal } from './product-create-modal'
import { ProductEditModal } from './product-edit-modal'
import { Product, addProduct, deleteProduct, updateProduct, fetchProductsSuccess } from '@/features/product/store/product.slice'
import type { RootState } from '@/store/store'
import { api } from '@/services/api'
import editIcon from '@/app/assets/edit.svg'
import trashIcon from '@/app/assets/trash.svg'

type SortField = 'name' | 'price' | 'quantity' | 'rating' | null
type SortOrder = 'asc' | 'desc' | null

export const ProductListPage: React.FC = () => {
  const dispatch = useDispatch()
  const products = useSelector((state: RootState) => state.products.items)

  const [isMounted, setIsMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null>(null)
  const [productToDeleteId, setProductToDeleteId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [zoomedImage, setZoomedImage] = useState<{ src: string; title: string } | null>(null)

  // Column Header Sorting State
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)

  useEffect(() => {
    setIsMounted(true)
    const loadProducts = async () => {
      try {
        const data = await api.get<any[]>('/productions')
        const mappedProducts: Product[] = data.map(p => ({
          id: p.id,
          name: p.name,
          priceValue: p.price,
          price: `${p.price.toLocaleString('vi-VN')} VNĐ`,
          quantity: p.stockQuantity,
          description: p.description,
          image: p.imageUrl,
          subImage1: p.subImage1,
          subImage2: p.subImage2,
          subImage3: p.subImage3,
          rating: p.rating
        }))
        dispatch(fetchProductsSuccess(mappedProducts))
      } catch (error) {
        console.error('Failed to load products', error)
      }
    }
    loadProducts()
  }, [dispatch])

  // Handle header column click for sorting/filtering
  const handleSort = (field: 'name' | 'price' | 'quantity' | 'rating') => {
    setCurrentPage(1)
    if (sortField !== field) {
      setSortField(field)
      setSortOrder('asc')
    } else if (sortOrder === 'asc') {
      setSortOrder('desc')
    } else {
      setSortField(null)
      setSortOrder(null)
    }
  }

  // Helper to extract numeric price for sorting
  const getPriceNumber = (p: Product) => {
    if (typeof p.priceValue === 'number' && !isNaN(p.priceValue)) {
      return p.priceValue
    }
    if (typeof p.price === 'string') {
      const num = parseInt(p.price.replace(/\D/g, ''), 10)
      if (!isNaN(num)) return num
    }
    return 0
  }

  const renderSortIcon = (field: 'name' | 'price' | 'quantity' | 'rating') => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-slate-500 transition" />
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="h-3 w-3 text-[#0F60FF] font-bold" />
    ) : (
      <ArrowDown className="h-3 w-3 text-[#0F60FF] font-bold" />
    )
  }

  if (!isMounted) {
    return (
      <div className="w-full space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-3 mb-6">
          <div className="h-8 w-72 bg-slate-100 rounded-md animate-pulse" />
          <div className="h-8 w-24 bg-slate-100 rounded-md animate-pulse" />
        </div>
        <div className="bg-white rounded-xl shadow-2xs border border-slate-100 p-8 text-center text-slate-400">
          Đang tải danh sách sản phẩm...
        </div>
      </div>
    )
  }

  // Filter products by search query
  const filteredProducts = products.filter((product) =>
    (product.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Sort products based on active header sort filter
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortField || !sortOrder) return 0

    if (sortField === 'name') {
      const cmp = (a.name || '').localeCompare(b.name || '', 'vi', { sensitivity: 'base' })
      return sortOrder === 'asc' ? cmp : -cmp
    }

    if (sortField === 'price') {
      const valA = getPriceNumber(a)
      const valB = getPriceNumber(b)
      return sortOrder === 'asc' ? valA - valB : valB - valA
    }

    if (sortField === 'quantity') {
      const valA = a.quantity ?? 0
      const valB = b.quantity ?? 0
      return sortOrder === 'asc' ? valA - valB : valB - valA
    }

    if (sortField === 'rating') {
      const valA = a.rating ?? 0
      const valB = b.rating ?? 0
      return sortOrder === 'asc' ? valA - valB : valB - valA
    }

    return 0
  })

  // Pagination logic
  const totalItems = sortedProducts.length
  const totalPages = Math.ceil(sortedProducts.length / pageSize) || 1
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleAddProduct = async (newProduct: Product) => {
    try {
      const payload = {
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.priceValue,
        stockQuantity: newProduct.quantity,
        imageUrl: newProduct.image,
        subImage1: newProduct.subImage1,
        subImage2: newProduct.subImage2,
        subImage3: newProduct.subImage3,
        rating: newProduct.rating
      }
      const saved = await api.post<any>('/productions', payload)
      
      const createdProduct: Product = {
        id: saved.id,
        name: saved.name,
        priceValue: saved.price,
        price: `${saved.price.toLocaleString('vi-VN')} VNĐ`,
        quantity: saved.stockQuantity,
        description: saved.description,
        image: saved.imageUrl,
        subImage1: saved.subImage1,
        subImage2: saved.subImage2,
        subImage3: saved.subImage3,
        rating: saved.rating
      }
      dispatch(addProduct(createdProduct))
    } catch (error) {
      console.error('Failed to add product', error)
    }
  }

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      const payload = {
        id: updatedProduct.id,
        name: updatedProduct.name,
        description: updatedProduct.description,
        price: updatedProduct.priceValue,
        stockQuantity: updatedProduct.quantity,
        imageUrl: updatedProduct.image,
        subImage1: updatedProduct.subImage1,
        subImage2: updatedProduct.subImage2,
        subImage3: updatedProduct.subImage3,
        rating: updatedProduct.rating
      }
      await api.put(`/productions/${updatedProduct.id}`, payload)
      dispatch(updateProduct(updatedProduct))
    } catch (error) {
      console.error('Failed to update product', error)
    }
  }

  const handleDeleteProductConfirm = async () => {
    if (productToDeleteId !== null) {
      try {
        await api.delete(`/productions/${productToDeleteId}`)
        dispatch(deleteProduct(productToDeleteId))
        setProductToDeleteId(null)
      } catch (error) {
        console.error('Failed to delete product', error)
      }
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Control Bar: Search & Action Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-3 mb-4">
        {/* Search Input Box */}
        <div className="relative w-full sm:w-72">
          <AdminInput
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Tìm kiếm"
            className="h-8 pl-3.5 pr-9 bg-white shadow-2xs text-xs font-medium border-slate-200"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>

        {/* Create Button */}
        <AdminButton
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="h-8 w-full sm:w-auto bg-[#0F60FF] hover:bg-[#0C53DF] text-white px-3.5 text-xs font-medium inline-flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>Tạo mới</span>
        </AdminButton>
      </div>

      {/* Product Data Table Container */}
      <div className="bg-white rounded-xl shadow-2xs border border-slate-100 overflow-hidden overflow-x-auto">
        <AdminTable className="min-w-[1000px]">
          <AdminTableHeader>
            {/* Tên sản phẩm */}
            <AdminTableHead className="w-[18%]">
              <button
                type="button"
                onClick={() => handleSort('name')}
                className={`group inline-flex items-center gap-1.5 hover:text-slate-800 transition cursor-pointer select-none ${
                  sortField === 'name' ? 'text-[#0F60FF] font-bold' : ''
                }`}
              >
                <span>TÊN SẢN PHẨM</span>
                {renderSortIcon('name')}
              </button>
            </AdminTableHead>

            {/* Giá */}
            <AdminTableHead className="w-[12%]">
              <button
                type="button"
                onClick={() => handleSort('price')}
                className={`group inline-flex items-center gap-1.5 hover:text-slate-800 transition cursor-pointer select-none ${
                  sortField === 'price' ? 'text-[#0F60FF] font-bold' : ''
                }`}
              >
                <span>GIÁ</span>
                {renderSortIcon('price')}
              </button>
            </AdminTableHead>

            {/* Số lượng */}
            <AdminTableHead className="w-[12%]">
              <button
                type="button"
                onClick={() => handleSort('quantity')}
                className={`group inline-flex items-center gap-1.5 hover:text-slate-800 transition cursor-pointer select-none ${
                  sortField === 'quantity' ? 'text-[#0F60FF] font-bold' : ''
                }`}
              >
                <span>SỐ LƯỢNG</span>
                {renderSortIcon('quantity')}
              </button>
            </AdminTableHead>

            {/* Đánh giá */}
            <AdminTableHead className="w-[12%]">
              <button
                type="button"
                onClick={() => handleSort('rating')}
                className={`group inline-flex items-center gap-1.5 hover:text-slate-800 transition cursor-pointer select-none ${
                  sortField === 'rating' ? 'text-[#0F60FF] font-bold' : ''
                }`}
              >
                <span>ĐÁNH GIÁ</span>
                {renderSortIcon('rating')}
              </button>
            </AdminTableHead>

            <AdminTableHead className="w-[20%]">MÔ TẢ</AdminTableHead>
            <AdminTableHead className="w-[12%]">ẢNH</AdminTableHead>
            <AdminTableHead className="w-[14%]">HÀNH ĐỘNG</AdminTableHead>
          </AdminTableHeader>

          <AdminTableBody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <AdminTableRow key={product.id}>
                  {/* Name */}
                  <AdminTableCell className="font-semibold text-slate-900">
                    {product.name}
                  </AdminTableCell>

                  {/* Price */}
                  <AdminTableCell className="text-slate-800 font-medium">
                    {product.price}
                  </AdminTableCell>

                  {/* Quantity */}
                  <AdminTableCell className="text-slate-700">
                    {product.quantity ?? 1}
                  </AdminTableCell>

                  {/* Rating */}
                  <AdminTableCell>
                    <div className="flex items-center gap-1 text-yellow-400 font-medium">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-slate-700">{product.rating}</span>
                    </div>
                  </AdminTableCell>

                  {/* Description */}
                  <AdminTableCell className="text-slate-600 font-normal max-w-[220px]">
                    <div className="line-clamp-1">
                      {product.description || 'Lorem ipsum dolor sit amet'}
                    </div>
                  </AdminTableCell>

                  {/* Image Preview - Clickable to zoom */}
                  <AdminTableCell>
                    <div
                      onClick={() => product.image && setZoomedImage({ src: product.image, title: product.name })}
                      className={`h-10 w-10 rounded-[4px] bg-slate-100 overflow-hidden flex items-center justify-center text-white border border-slate-100 shadow-2xs relative ${
                        product.image ? 'cursor-pointer group hover:border-slate-300' : ''
                      }`}
                      title={product.image ? 'Nhấp để phóng to ảnh' : ''}
                    >
                      {product.image ? (
                        <>
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ZoomIn className="w-3.5 h-3.5 text-white" />
                          </div>
                        </>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400">IMG</span>
                      )}
                    </div>
                  </AdminTableCell>

                  {/* Actions (Edit & Delete) */}
                  <AdminTableCell>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSelectedProductForEdit(product)}
                        className="hover:opacity-75 transition p-1 cursor-pointer"
                        title="Sửa sản phẩm"
                      >
                        <Image
                          src={editIcon}
                          alt="Sửa sản phẩm"
                          className="h-5.5 w-5.5 object-contain"
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => setProductToDeleteId(product.id)}
                        className="hover:opacity-75 transition p-1 cursor-pointer"
                        title="Xóa sản phẩm"
                      >
                        <Image
                          src={trashIcon}
                          alt="Xóa sản phẩm"
                          className="h-5.5 w-5.5 object-contain"
                        />
                      </button>
                    </div>
                  </AdminTableCell>
                </AdminTableRow>
              ))
            ) : (
              <AdminTableRow>
                <AdminTableCell className="text-center py-8 text-slate-400" colSpan={7}>
                  Không tìm thấy sản phẩm nào.
                </AdminTableCell>
              </AdminTableRow>
            )}
          </AdminTableBody>
        </AdminTable>

        {/* Table Pagination */}
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Product Create Modal */}
      <ProductCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onAddProduct={handleAddProduct}
      />

      {/* Product Edit Modal */}
      <ProductEditModal
        isOpen={!!selectedProductForEdit}
        onClose={() => setSelectedProductForEdit(null)}
        product={selectedProductForEdit}
        onUpdateProduct={handleUpdateProduct}
      />

      {/* Custom Destructive Confirm Modal */}
      <AdminConfirmModal
        isOpen={productToDeleteId !== null}
        onClose={() => setProductToDeleteId(null)}
        onConfirm={handleDeleteProductConfirm}
        title="Xóa sản phẩm"
        message="Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
      />

      {/* Image Zoom Modal */}
      <AdminImageZoomModal
        isOpen={!!zoomedImage}
        onClose={() => setZoomedImage(null)}
        src={zoomedImage?.src || null}
        title={zoomedImage?.title}
      />
    </div>
  )
}
