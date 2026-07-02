import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { getUsers, saveUser } from '@/features/auth/store/auth.storage'
import { FieldRow } from './field-row'

const PASSWORD_PATTERN = '(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}'

export const SignUpForm = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSignUp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage('Vui lòng điền đầy đủ thông tin.')
      return
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[!@#$%^&*]/.test(password)) {
      setErrorMessage('Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa và 1 ký tự đặc biệt (vd: @, &, !).')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp.')
      return
    }

    const existing = getUsers().find((u) => u.username === username.trim())
    if (existing) {
      setErrorMessage('Tên đăng nhập đã được sử dụng.')
      return
    }

    saveUser({ username: username.trim(), email: email.trim(), password })
    router.push('/login')
  }

  return (
    <form onSubmit={handleSignUp} className="mx-auto mt-8 w-full max-w-125 space-y-11">
      <FieldRow
        type="text"
        value={username}
        onChange={setUsername}
        placeholder="Tên đăng nhập"
        leftIcon={<User className="block h-3 w-3" strokeWidth={2.25} />}
        required
      />

      <FieldRow
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="Email"
        leftIcon={<Mail className="block h-3 w-3" strokeWidth={2.25} />}
        required
      />

      <label className="relative block">
        <span className="pointer-events-none absolute left-4 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-[#1598d6] leading-none text-white">
          <Lock className="block h-3 w-3" strokeWidth={2.25} />
        </span>
        <input
          name="password"
          autoComplete="new-password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Mật khẩu"
          required
          pattern={PASSWORD_PATTERN}
          title="ít nhất 8 ký tự, 1 chữ hoa và 1 ký tự đặc biệt"
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

      <label className="relative block">
        <span className="pointer-events-none absolute left-4 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-[#1598d6] leading-none text-white">
          <Lock className="block h-3 w-3" strokeWidth={2.25} />
        </span>
        <input
          name="confirmPassword"
          autoComplete="new-password"
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Xác nhận mật khẩu"
          required
          pattern={password.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}
          title="Vui lòng nhập lại mật khẩu"
          className="h-16 w-full rounded-sm border border-[#d6dee4] bg-[#eff1f3] pl-14 pr-12 text-[16px] text-[#52606d] placeholder:text-[#98a6b4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] outline-none transition focus:border-[#a6d8f2]"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword((previous) => !previous)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#677784] transition hover:text-[#4f5f6d]"
          aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        >
          {showConfirmPassword ? <Eye size={16} strokeWidth={2.25} /> : <EyeOff size={16} strokeWidth={2.25} />}
        </button>
      </label>

      <button
        type="submit"
        className="mt-3 mx-auto block h-11.5 w-[88%] rounded-sm border-2 border-cyan-100/90 text-[15px] font-medium text-cyan-50 transition duration-150 hover:bg-white/10 active:translate-y-px"
      >
        Đăng ký
      </button>

      {errorMessage ? <p className="text-sm text-red-100">{errorMessage}</p> : null}

      <p className="mt-4 text-[14px] text-cyan-50/95">
        Đã có tài khoản?{' '}
        <a
          href="/login"
          className="text-cyan-50/95 underline underline-offset-2 transition hover:text-white"
        >
          Đăng nhập ngay
        </a>
      </p>
    </form>
  )
}
