'use client'

import Image from 'next/image'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { loginUser } from '@/features/auth/auth.slice'
import { resetProducts } from '@/features/product/product.slice'
import { findUser, getSession, saveSession } from '@/features/auth/auth.storage'
import type { AppDispatch } from '@/store/store'
import logoIcon from '../../assets/logo.png'
import vectorBg from '../../assets/Vector.png'
import group19 from '../../assets/Group 19.png'

const NetworkDecoration = () => {
  return (
    <>
      <div
        className="pointer-events-none absolute top-[10%] w-[22%]"
        style={{ right: '-4%', filter: 'brightness(0) invert(1)', opacity: 0.55 }}
        aria-hidden="true"
      >
        <Image
          src={group19}
          alt=""
          className="w-full object-contain"
        />
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-0 w-full opacity-30"
        style={{ mixBlendMode: 'multiply' }}
        aria-hidden="true"
      >
        <Image
          src={vectorBg}
          alt=""
          className="w-full object-fill"
          priority
        />
      </div>
    </>
  )
}

const TopCircle = () => {
  return (
    <div
      className="mx-auto inline-flex h-24 w-24 items-center justify-center rounded-full bg-white/90 shadow-[0_10px_20px_rgba(0,0,0,0.2)]"
      aria-hidden="true"
    >
      <Image src={logoIcon} alt="Website logo" className="h-18 w-18 object-contain" />
    </div>
  )
}

const FieldRow = ({
  type,
  placeholder,
  leftIcon,
  value,
  onChange,
  rightIcon,
  required,
}: {
  type: string
  placeholder: string
  leftIcon: ReactNode
  value: string
  onChange: (value: string) => void
  rightIcon?: ReactNode
  required?: boolean
}) => {
  return (
    <label className="relative block">
      <span className="pointer-events-none absolute left-4 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-[#1598d6] leading-none text-white">
        {leftIcon}
      </span>
      <input
        autoComplete="username"
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="h-16 w-full rounded-sm border border-[#d6dee4] bg-[#eff1f3] pl-14 pr-10 text-[16px] text-[#52606d] placeholder:text-[#98a6b4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] outline-none transition focus:border-[#a6d8f2]"
      />
      {rightIcon ? (
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#677784]">{rightIcon}</span>
      ) : null}
    </label>
  )
}

const LoginPage = () => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberLogin, setRememberLogin] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (getSession()) {
      router.replace('/shop')
    }
  }, [router])

  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const user = findUser(username.trim(), password)
    if (!user) {
      setErrorMessage('Sai tên tài khoản hoặc mật khẩu.')
      return
    }

    dispatch(resetProducts())
    dispatch(loginUser({ username: user.username, email: user.email }))
    saveSession({ username: user.username, email: user.email }, rememberLogin)
    router.push('/shop')
  }

  return (
    <main
      className="relative isolate flex min-h-screen items-start justify-center overflow-hidden bg-[#01AEEF] px-4 pb-10 pt-16 text-white sm:items-center sm:pt-10"
    >
      <NetworkDecoration />

      <section className="relative z-10 w-full max-w-150 text-center animate-in fade-in zoom-in-95 duration-500">
        <TopCircle />

        <form onSubmit={handleSignIn} className="mx-auto mt-8 w-full max-w-125 space-y-11">
          <FieldRow
            type="text"
            value={username}
            onChange={setUsername}
            placeholder="Tên đăng nhập"
            leftIcon={<User className="block h-3 w-3" strokeWidth={2.25} />}
            required
          />

          <label className="relative block">
            <span className="pointer-events-none absolute left-4 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-[#1598d6] leading-none text-white">
              <Lock className="block h-3 w-3" strokeWidth={2.25} />
            </span>
            <input
              name="password"
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Mật khẩu"
              required
              className="h-16 w-full rounded-sm border border-[#d6dee4] bg-[#eff1f3] pl-14 pr-12 text-[16px] text-[#52606d] placeholder:text-[#98a6b4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] outline-none transition focus:border-[#a6d8f2]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#677784] transition hover:text-[#4f5f6d]"
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <Eye size={16} strokeWidth={2.25} /> : <EyeOff size={16} strokeWidth={2.25} />}
            </button>
          </label>

          <div className="mt-4 flex items-center justify-between px-2 text-[14px] text-cyan-50/95">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberLogin}
                onChange={(event) => setRememberLogin(event.target.checked)}
                className="h-3.25 w-3.25 rounded-sm border-white/60"
              />
              <span>Lưu đăng nhập</span>
            </label>
            <a href="#" className="transition hover:text-white">
              Bạn quên mật khẩu?
            </a>
          </div>

          <button
            type="submit"
            className="mt-3 mx-auto block h-11.5 w-[88%] rounded-sm border-2 border-cyan-100/90 text-[15px] font-medium text-cyan-50 transition duration-150 hover:bg-white/10 active:translate-y-px"
          >
            Đăng nhập
          </button>

          {errorMessage ? <p className="text-sm text-red-100">{errorMessage}</p> : null}

          <p className="mt-4 text-[14px] text-cyan-50/95">
            Chưa có tài khoản?{' '}
            <a
              href="/signup"
              className="text-cyan-50/95 underline underline-offset-2 transition hover:text-white"
            >
              Đăng ký ngay
            </a>
          </p>
        </form>

        <div className="mt-16 space-y-1 text-[13px] text-cyan-50/50">
          <p>
            Nếu bạn có thắc mắc hay cần giải đáp, vui lòng liên hệ số điện thoại: <span className="font-semibold">19001000</span>
          </p>
          <p>Bản quyền thuộc về AnyBim</p>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
