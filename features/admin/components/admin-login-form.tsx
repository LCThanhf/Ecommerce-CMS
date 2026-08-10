'use client'

import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { HicasLogo } from './hicas-logo'
import { AdminButton } from './ui/admin-button'
import { AdminInput } from './ui/admin-input'
import { AdminLabel } from './ui/admin-label'
import { AdminCheckbox } from './ui/admin-checkbox'

export const AdminLoginForm: React.FC = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setIsLoading(true)

    setTimeout(() => {
      if (email.trim() && password) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_session', JSON.stringify({ email, role: 'admin' }))
        }
        router.push('/admin/products')
      } else {
        setErrorMessage('Vui lòng nhập đầy đủ email và mật khẩu.')
        setIsLoading(false)
      }
    }, 400)
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Header Logo & Title */}
      <HicasLogo className="mb-3" />
      <h1 className="text-[26px] font-bold tracking-tight text-[#1E293B] mb-7 text-center">
        Đăng nhập
      </h1>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {/* Email Field */}
        <div>
          <AdminLabel htmlFor="admin-email">Email</AdminLabel>
          <AdminInput
            id="admin-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email"
          />
        </div>

        {/* Password Field */}
        <div>
          <AdminLabel htmlFor="admin-password">Mật khẩu</AdminLabel>
          <div className="relative">
            <AdminInput
              id="admin-password"
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

        {/* Options Row: Remember Me & Forgot Password */}
        <div className="flex items-center justify-between pt-0.5 text-xs">
          <AdminCheckbox
            id="remember-me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            label="Ghi nhớ Đăng nhập"
          />
          <a href="#" className="font-medium text-[#0F60FF] hover:underline transition">
            Quên mật khẩu?
          </a>
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
          {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
        </AdminButton>

        {/* Signup Redirect Link - Tighter spacing mt-4.5 matching screenshot */}
        <p className="mt-4.5 text-center text-xs text-slate-600">
          Bạn chưa có tài khoản?{' '}
          <Link href="/admin/signup" className="font-medium text-[#0F60FF] hover:underline">
            Đăng ký
          </Link>
        </p>
      </form>
    </div>
  )
}
