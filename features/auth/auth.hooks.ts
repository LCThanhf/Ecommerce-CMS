import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { getSession } from '@/features/auth/auth.storage'

// Redirects to /login after auth hydration. Returns isReady to block render until confirmed.
const useAuthGuard = (): { isReady: boolean } => {
  const router = useRouter()
  const user = useSelector((state: RootState) => state.auth.user)
  const hasHydrated = useSelector((state: RootState) => state.auth.hasHydrated)

  useEffect(() => {
    if (hasHydrated && !user && !getSession()) {
      router.replace('/login')
    }
  }, [hasHydrated, user, router])

  return { isReady: hasHydrated && (!!user || !!getSession()) }
}

export default useAuthGuard
