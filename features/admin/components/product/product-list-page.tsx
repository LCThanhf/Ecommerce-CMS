'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Search, Plus } from 'lucide-react'
import { useDispatch } from 'react-redux'
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
import { ProductCreateModal } from './product-create-modal'
import { ProductEditModal } from './product-edit-modal'
import { Product, addProduct, deleteProduct, updateProduct } from '@/features/product/store/product.slice'
import editIcon from '@/app/assets/edit.svg'
import trashIcon from '@/app/assets/trash.svg'

const ADMIN_PRODUCTS_STORAGE_KEY = 'admin_products'

// Initial mock products matching the screenshot (formatted in VNĐ)
const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: 'Sản phẩm 1', price: '6.000.000 VNĐ', priceValue: 6000000, quantity: 1, description: 'Lorem ipsum dolor sit amet', rating: 5, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80' },
  { id: 2, name: 'Sản phẩm 2', price: '5.000.000 VNĐ', priceValue: 5000000, quantity: 3, description: 'Lorem ipsum dolor sit amet', rating: 5, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Sản phẩm 3', price: '40.000.000 VNĐ', priceValue: 40000000, quantity: 6, description: 'Lorem ipsum dolor sit amet', rating: 5, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80' },
  { id: 4, name: 'Sản phẩm 4', price: '12.000.000 VNĐ', priceValue: 12000000, quantity: 355, description: 'Lorem ipsum dolor sit amet', rating: 5, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&auto=format&fit=crop&q=80' },
  { id: 5, name: 'Sản phẩm 5', price: '45.000.000 VNĐ', priceValue: 45000000, quantity: 42, description: 'Lorem ipsum dolor sit amet', rating: 5, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100&auto=format&fit=crop&q=80' },
  { id: 6, name: 'Sản phẩm 6', price: '15.000.000 VNĐ', priceValue: 15000000, quantity: 45, description: 'Lorem ipsum dolor sit amet', rating: 5, image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=100&auto=format&fit=crop&q=80' },
  { id: 7, name: 'Sản phẩm 7', price: '8.000.000 VNĐ', priceValue: 8000000, quantity: 144, description: 'Lorem ipsum dolor sit amet', rating: 5, image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=100&auto=format&fit=crop&q=80' },
  { id: 8, name: 'Sản phẩm 8', price: '80.000.000 VNĐ', priceValue: 80000000, quantity: 677, description: 'Lorem ipsum dolor sit amet', rating: 5, image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100&auto=format&fit=crop&q=80' },
  { id: 9, name: 'Sản phẩm 9', price: '35.000.000 VNĐ', priceValue: 35000000, quantity: 533, description: 'Lorem ipsum dolor sit amet', rating: 5, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&auto=format&fit=crop&q=80' },
  { id: 10, name: 'Sản phẩm 10', price: '20.000.000 VNĐ', priceValue: 20000000, quantity: 532, description: 'Lorem ipsum dolor sit amet', rating: 5, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100&auto=format&fit=crop&q=80' },
]

export const ProductListPage: React.FC = () => {
  const dispatch = useDispatch()
  const [isMounted, setIsMounted] = useState(false)

  // Synchronously initialize state from localStorage to prevent half-second visual glitch/flash on F5 refresh
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(ADMIN_PRODUCTS_STORAGE_KEY)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed
          }
        } catch {
          // ignore parsing error
        }
      }
    }
    return INITIAL_PRODUCTS
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null>(null)
  const [productToDeleteId, setProductToDeleteId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    setIsMounted(true)
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(ADMIN_PRODUCTS_STORAGE_KEY)
      if (!stored) {
        localStorage.setItem(ADMIN_PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS))
      }
    }
  }, [])

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts)
    if (typeof window !== 'undefined') {
      localStorage.setItem(ADMIN_PRODUCTS_STORAGE_KEY, JSON.stringify(newProducts))
    }
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
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Pagination logic
  const totalItems = filteredProducts.length
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleAddProduct = (newProduct: Product) => {
    const updated = [newProduct, ...products]
    saveProducts(updated)
    dispatch(addProduct(newProduct))
  }

  const handleUpdateProduct = (updatedProduct: Product) => {
    const updated = products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    saveProducts(updated)
    dispatch(updateProduct(updatedProduct))
  }

  const handleDeleteProductConfirm = () => {
    if (productToDeleteId !== null) {
      const updated = products.filter((p) => p.id !== productToDeleteId)
      saveProducts(updated)
      dispatch(deleteProduct(productToDeleteId))
      setProductToDeleteId(null)
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Control Bar: Search & Action Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-3 mb-6">
        {/* Search Input Box */}
        <div className="relative w-full sm:w-72">
          <AdminInput
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
      <div className="bg-white rounded-xl shadow-2xs border border-slate-100 overflow-hidden">
        <AdminTable>
          <AdminTableHeader>
            <AdminTableHead className="w-[20%]">TÊN SẢN PHẨM</AdminTableHead>
            <AdminTableHead className="w-[12%]">GIÁ</AdminTableHead>
            <AdminTableHead className="w-[12%]">SỐ LƯỢNG</AdminTableHead>
            <AdminTableHead className="w-[30%]">MÔ TẢ</AdminTableHead>
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

                  {/* Description */}
                  <AdminTableCell className="text-slate-600 font-normal max-w-[220px]">
                    <div className="line-clamp-1">
                      {product.description || 'Lorem ipsum dolor sit amet'}
                    </div>
                  </AdminTableCell>

                  {/* Image Preview */}
                  <AdminTableCell>
                    <div className="h-10 w-10 rounded-[4px] bg-slate-100 overflow-hidden flex items-center justify-center text-white border border-slate-100 shadow-2xs">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
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
                <AdminTableCell className="text-center py-8 text-slate-400" colSpan={6}>
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
    </div>
  )
}
