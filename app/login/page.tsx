'use client'

import Image from 'next/image'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { ReactNode } from 'react'
import logoIcon from '../assets/logo.png.png'

function NetworkDecoration() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1600 900" fill="none" aria-hidden="true">
          <g opacity="0.3" stroke="rgba(196, 238, 255, 0.35)" strokeWidth="2">
            <line x1="110" y1="120" x2="290" y2="240" />
            <line x1="1220" y1="340" x2="1500" y2="450" />
            <line x1="1500" y1="450" x2="1570" y2="390" />
            <line x1="1500" y1="450" x2="1390" y2="560" />
            <line x1="1390" y1="560" x2="1570" y2="630" />
            <line x1="1570" y1="630" x2="1500" y2="450" />
            <line x1="1220" y1="340" x2="1390" y2="560" />
          </g>
          <g fill="rgba(179, 231, 255, 0.42)">
            <circle cx="110" cy="120" r="11" />
            <circle cx="290" cy="240" r="16" />
            <circle cx="1220" cy="340" r="13" />
            <circle cx="1500" cy="450" r="14" />
            <circle cx="1570" cy="390" r="9" />
            <circle cx="1390" cy="560" r="9" />
            <circle cx="1570" cy="630" r="8" />
            <circle cx="35" cy="610" r="10" />
            <circle cx="110" cy="560" r="8" />
          </g>
        </svg>
        <div className="absolute -left-4 top-[8%] h-16 w-16 rounded-full border border-cyan-100/20" />
        <div className="absolute left-[14%] top-[35%] h-8 w-8 rounded-full border border-cyan-100/20" />
        <div className="absolute left-[76%] top-[16%] h-6 w-6 rounded-full border border-cyan-100/25" />
      </div>

      <svg
        className="pointer-events-none absolute bottom-0 left-0 h-[34vh] min-h-45 w-full text-cyan-100/20"
        viewBox="0 0 1600 380"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g stroke="currentColor" strokeWidth="1.25">
          <path d="M0 370H1600" />
          <path d="M70 368V300H140V368" />
          <path d="M140 368V280H260V368" />
          <path d="M260 368V295H360V368" />
          <path d="M360 368V260H540V368" />
          <path d="M540 368V272H660V368" />
          <path d="M660 368V290H750V368" />
          <path d="M750 368V245H900V368" />
          <path d="M900 368V278H1040V368" />
          <path d="M1040 368V252H1185V368" />
          <path d="M1185 368V280H1310V368" />
          <path d="M1310 368V265H1490V368" />
          <path d="M1490 368V300H1600V368" />
          <path d="M200 280H230M200 292H230M200 304H230" />
          <path d="M420 268H510M420 282H510M420 296H510" />
          <path d="M770 257H880M770 272H880M770 287H880" />
          <path d="M1070 264H1165M1070 278H1165M1070 292H1165" />
        </g>
      </svg>
    </>
  )
}

function TopCircle() {
  return (
    <div
      className="mx-auto inline-flex h-24 w-24 items-center justify-center rounded-full bg-white/90 shadow-[0_10px_20px_rgba(0,0,0,0.2)]"
      aria-hidden="true"
    >
      <Image src={logoIcon} alt="Website logo" className="h-18 w-18 object-contain" />
    </div>
  )
}

function FieldRow({
  type,
  placeholder,
  leftIcon,
  value,
  onChange,
  rightIcon,
}: {
  type: string
  placeholder: string
  leftIcon: ReactNode
  value: string
  onChange: (value: string) => void
  rightIcon?: ReactNode
}) {
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
        className="h-16 w-full rounded-sm border border-[#d6dee4] bg-[#eff1f3] pl-14 pr-10 text-[17px] text-[#52606d] placeholder:text-[#98a6b4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] outline-none transition focus:border-[#a6d8f2]"
      />
      {rightIcon ? (
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#677784]">{rightIcon}</span>
      ) : null}
    </label>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Vui lòng nhập tên đăng nhập và mật khẩu.')
      return
    }

    setErrorMessage('')
    router.push('/shop')
  }

  return (
    <main
      className="relative isolate flex min-h-screen items-start justify-center overflow-hidden bg-linear-to-b from-[#14a4dd] via-[#0fa1dd] to-[#1498d5] px-4 pb-10 pt-16 text-white sm:items-center sm:pt-10"
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
              className="h-16 w-full rounded-sm border border-[#d6dee4] bg-[#eff1f3] pl-14 pr-12 text-[17px] text-[#52606d] placeholder:text-[#98a6b4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] outline-none transition focus:border-[#a6d8f2]"
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
            className="mt-3 mx-auto block h-11.5 w-4/5 rounded-sm border border-cyan-100/90 text-[18px] font-medium text-cyan-50 transition duration-150 hover:bg-white/10 active:translate-y-px"
          >
            Đăng nhập
          </button>

          {errorMessage ? <p className="text-sm text-red-100">{errorMessage}</p> : null}
        </form>

        <div className="mt-16 space-y-1 text-[13px] text-cyan-50/85">
          <p>
            Nếu bạn có thắc mắc hay cần giải đáp, vui lòng liên hệ số điện thoại: <span className="font-semibold">19001000</span>
          </p>
          <p>Bản quyền thuộc về AnyBim</p>
        </div>
      </section>
    </main>
  )
}
