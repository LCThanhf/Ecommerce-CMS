'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Search, Plus, ZoomIn } from 'lucide-react'
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
import { UserCreateModal } from './user-create-modal'
import { UserEditModal } from './user-edit-modal'
import { AdminUser, addAdminUser, deleteAdminUser, updateAdminUser } from '@/features/admin/store/admin-user.slice'
import type { RootState } from '@/store/store'
import editIcon from '@/app/assets/edit.svg'
import trashIcon from '@/app/assets/trash.svg'

export const UserListPage: React.FC = () => {
  const dispatch = useDispatch()
  const users = useSelector((state: RootState) => state.adminUsers.items)

  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<AdminUser | null>(null)
  const [userToDeleteId, setUserToDeleteId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [zoomedImage, setZoomedImage] = useState<{ src: string; title: string } | null>(null)

  // Filter users by search query
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Pagination logic
  const totalItems = filteredUsers.length
  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleAddUser = (newUser: AdminUser) => {
    dispatch(addAdminUser(newUser))
  }

  const handleUpdateUser = (updatedUser: AdminUser) => {
    dispatch(updateAdminUser(updatedUser))
  }

  const handleDeleteUserConfirm = () => {
    if (userToDeleteId !== null) {
      dispatch(deleteAdminUser(userToDeleteId))
      setUserToDeleteId(null)
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

      {/* User Data Table Container */}
      <div className="bg-white rounded-xl shadow-2xs border border-slate-100 overflow-hidden">
        <AdminTable>
          <AdminTableHeader>
            <AdminTableHead className="w-[12%]">AVATAR</AdminTableHead>
            <AdminTableHead className="w-[20%]">TÊN NGƯỜI DÙNG</AdminTableHead>
            <AdminTableHead className="w-[28%]">EMAIL</AdminTableHead>
            <AdminTableHead className="w-[15%]">NGÀY SINH</AdminTableHead>
            <AdminTableHead className="w-[15%]">SỐ ĐIỆN THOẠI</AdminTableHead>
            <AdminTableHead className="w-[10%]">HÀNH ĐỘNG</AdminTableHead>
          </AdminTableHeader>

          <AdminTableBody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <AdminTableRow key={user.id}>
                  {/* Avatar - Clickable to zoom */}
                  <AdminTableCell>
                    <div
                      onClick={() => user.avatar && setZoomedImage({ src: user.avatar, title: user.name })}
                      className={`h-10 w-10 rounded-[4px] bg-slate-100 overflow-hidden flex items-center justify-center text-white border border-slate-100 shadow-2xs relative ${
                        user.avatar ? 'cursor-pointer group hover:border-slate-300' : ''
                      }`}
                      title={user.avatar ? 'Nhấp để phóng to avatar' : ''}
                    >
                      {user.avatar ? (
                        <>
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ZoomIn className="w-3.5 h-3.5 text-white" />
                          </div>
                        </>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400">USR</span>
                      )}
                    </div>
                  </AdminTableCell>

                  {/* Name */}
                  <AdminTableCell className="font-bold text-[#1E293B] text-[13px]">
                    {user.name}
                  </AdminTableCell>

                  {/* Email */}
                  <AdminTableCell className="text-slate-600 font-normal">
                    {user.email}
                  </AdminTableCell>

                  {/* Date of Birth */}
                  <AdminTableCell className="text-slate-600 font-normal">
                    {user.dob}
                  </AdminTableCell>

                  {/* Phone */}
                  <AdminTableCell className="text-slate-600 font-normal">
                    {user.phone}
                  </AdminTableCell>

                  {/* Actions */}
                  <AdminTableCell>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSelectedUserForEdit(user)}
                        className="hover:opacity-75 transition p-1 cursor-pointer"
                        title="Sửa người dùng"
                      >
                        <Image
                          src={editIcon}
                          alt="Sửa người dùng"
                          className="h-5.5 w-5.5 object-contain"
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => setUserToDeleteId(user.id)}
                        className="hover:opacity-75 transition p-1 cursor-pointer"
                        title="Xóa người dùng"
                      >
                        <Image
                          src={trashIcon}
                          alt="Xóa người dùng"
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
                  Không tìm thấy người dùng nào.
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

      {/* User Create Modal */}
      <UserCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onAddUser={handleAddUser}
      />

      {/* User Edit Modal */}
      <UserEditModal
        isOpen={!!selectedUserForEdit}
        onClose={() => setSelectedUserForEdit(null)}
        user={selectedUserForEdit}
        onUpdateUser={handleUpdateUser}
      />

      {/* Custom Destructive Confirm Modal */}
      <AdminConfirmModal
        isOpen={userToDeleteId !== null}
        onClose={() => setUserToDeleteId(null)}
        onConfirm={handleDeleteUserConfirm}
        title="Xóa người dùng"
        message="Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác."
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

