'use client'

import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { HicasLogo } from './hicas-logo'

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
      <h1 className="text-[26px] font-bold tracking-tight text-[#1E293B] mb-6 text-center">
        Đăng ký
      </h1>

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {/* Full Name Field */}
        <div>
          <label htmlFor="signup-name" className="block text-xs font-medium text-slate-600 mb-1.5">
            Họ và tên
          </label>
          <input
            id="signup-name"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nhập họ và tên"
            className="h-11 w-full rounded-md border border-slate-200 bg-white px-3.5 text-sm text-slate-800 placeholder:text-slate-300 focus:border-[#1867FF] focus:outline-none focus:ring-1 focus:ring-[#1867FF] transition duration-150"
          />
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="signup-email" className="block text-xs font-medium text-slate-600 mb-1.5">
            Email
          </label>
          <input
            id="signup-email"
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
          <label htmlFor="signup-password" className="block text-xs font-medium text-slate-600 mb-1.5">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              id="signup-password"
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

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="signup-confirm-password" className="block text-xs font-medium text-slate-600 mb-1.5">
            Nhập lại mật khẩu
          </label>
          <div className="relative">
            <input
              id="signup-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="h-11 w-full rounded-md border border-slate-200 bg-white pl-3.5 pr-10 text-sm text-slate-800 placeholder:text-slate-300 focus:border-[#1867FF] focus:outline-none focus:ring-1 focus:ring-[#1867FF] transition duration-150"
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
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 h-11 rounded-lg bg-[#1867FF] text-sm font-medium text-white shadow-sm transition duration-150 hover:bg-[#1056E0] active:scale-[0.99] disabled:opacity-70"
        >
          {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
        </button>

        {/* Login Redirect Link */}
        <p className="mt-6 text-center text-xs text-slate-600">
          Bạn đã có tài khoản?{' '}
          <Link href="/admin/login" className="font-medium text-[#1867FF] hover:underline">
            Đăng nhập
          </Link>
        </p>
      </form>
    </div>
  )
}
