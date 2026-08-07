'use client'

import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { HicasLogo } from './hicas-logo'

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
      <h1 className="text-[26px] font-bold tracking-tight text-[#1E293B] mb-8 text-center">
        Đăng nhập
      </h1>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="w-full space-y-5">
        {/* Email Field */}
        <div>
          <label htmlFor="admin-email" className="block text-xs font-medium text-slate-600 mb-1.5">
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email"
            className="h-11 w-full rounded-md border border-slate-200 bg-white px-3.5 text-sm text-slate-800 placeholder:text-slate-300 focus:border-[#1867FF] focus:outline-none focus:ring-1 focus:ring-[#1867FF] transition duration-150"
          />
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="admin-password" className="block text-xs font-medium text-slate-600 mb-1.5">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="h-11 w-full rounded-md border border-slate-200 bg-white pl-3.5 pr-10 text-sm text-slate-800 placeholder:text-slate-300 focus:border-[#1867FF] focus:outline-none focus:ring-1 focus:ring-[#1867FF] transition duration-150"
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
        <div className="flex items-center justify-between pt-1 text-xs">
          <label className="inline-flex items-center gap-2 cursor-pointer text-slate-600 select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-[#1867FF] focus:ring-[#1867FF] cursor-pointer"
            />
            <span>Ghi nhớ Đăng nhập</span>
          </label>
          <a href="#" className="font-medium text-[#1867FF] hover:underline transition">
            Quên mật khẩu?
          </a>
        </div>

        {/* Error message if any */}
        {errorMessage && (
          <p className="text-xs text-red-500 font-medium text-center">{errorMessage}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 h-11 rounded-lg bg-[#1867FF] text-sm font-medium text-white shadow-sm transition duration-150 hover:bg-[#1056E0] active:scale-[0.99] disabled:opacity-70"
        >
          {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>

        {/* Signup Redirect Link */}
        <p className="mt-8 text-center text-xs text-slate-600">
          Bạn chưa có tài khoản?{' '}
          <Link href="/admin/signup" className="font-medium text-[#1867FF] hover:underline">
            Đăng ký
          </Link>
        </p>
      </form>
    </div>
  )
}
