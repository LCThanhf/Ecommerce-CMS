import { Eye, EyeOff, Lock, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { loginUser } from '@/features/auth/store/auth.slice'
import { resetProducts } from '@/features/product/store/product.slice'
import { findUser, getSession, saveSession } from '@/features/auth/store/auth.storage'
import type { AppDispatch } from '@/store/store'
import { FieldRow } from './field-row'

export const LoginForm = () => {
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
    <form onSubmit={handleSignIn} className="mx-auto mt-8 w-full max-w-125 space-y-11">
      <FieldRow
        type="text"
        value={username}
        onChange={setUsername}
        placeholder="Tên đăng nhập"
        leftIcon={<User className="block h-3 w-3" strokeWidth={2.25} />}
        required
        autoComplete="username"
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
  )
}
