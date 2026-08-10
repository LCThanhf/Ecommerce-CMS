'use client'

import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { HicasLogo } from './hicas-logo'
import { AdminButton } from './ui/admin-button'
import { AdminInput } from './ui/admin-input'
import { AdminLabel } from './ui/admin-label'

export const AdminSignupForm: React.FC = () => {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu nhập lại không khớp.')
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      if (email.trim() && password) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_session', JSON.stringify({ email, fullName, role: 'admin' }))
        }
        router.push('/admin/products')
      } else {
        setErrorMessage('Vui lòng điền đầy đủ thông tin.')
        setIsLoading(false)
      }
    }, 400)
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Header Logo & Title */}
      <HicasLogo className="mb-3" />
      <h1 className="text-[26px] font-bold tracking-tight text-[#1E293B] mb-5 text-center">
        Đăng ký
      </h1>

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="w-full space-y-3.5">
        {/* Full Name Field */}
        <div>
          <AdminLabel htmlFor="signup-name">Họ và tên</AdminLabel>
          <AdminInput
            id="signup-name"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nhập họ và tên"
          />
        </div>

        {/* Email Field */}
        <div>
          <AdminLabel htmlFor="signup-email">Email</AdminLabel>
          <AdminInput
            id="signup-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email"
          />
        </div>

        {/* Password Field */}
        <div>
          <AdminLabel htmlFor="signup-password">Mật khẩu</AdminLabel>
          <div className="relative">
            <AdminInput
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? (
                <Eye className="h-4 w-4 stroke-[1.75]" />
              ) : (
                <EyeOff className="h-4 w-4 stroke-[1.75]" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div>
          <AdminLabel htmlFor="signup-confirm-password">Nhập lại mật khẩu</AdminLabel>
          <div className="relative">
            <AdminInput
              id="signup-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showConfirmPassword ? (
                <Eye className="h-4 w-4 stroke-[1.75]" />
              ) : (
                <EyeOff className="h-4 w-4 stroke-[1.75]" />
              )}
            </button>
          </div>
        </div>

        {/* Error message if any */}
        {errorMessage && (
          <p className="text-xs text-red-500 font-medium text-center">{errorMessage}</p>
        )}

        {/* Submit Button */}
        <AdminButton
          type="submit"
          disabled={isLoading}
          className="w-full mt-1.5"
        >
          {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
        </AdminButton>

        {/* Login Redirect Link */}
        <p className="mt-4.5 text-center text-xs text-slate-600">
          Bạn đã có tài khoản?{' '}
          <Link href="/admin/login" className="font-medium text-[#0F60FF] hover:underline">
            Đăng nhập
          </Link>
        </p>
      </form>
    </div>
  )
}
