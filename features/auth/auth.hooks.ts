import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { getSession } from '@/features/auth/auth.storage'

const useAuthGuard = () => {
  const router = useRouter()
  const user = useSelector((state: RootState) => state.auth.user)

  useEffect(() => {
    if (!user && !getSession()) {
      router.replace('/login')
    }
  }, [user, router])
}

export default useAuthGuard
