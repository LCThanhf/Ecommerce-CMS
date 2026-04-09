'use client'

import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'

const ToastNotification = () => {
  const { message, visible } = useSelector((state: RootState) => state.toast)

  if (!visible || !message) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium animate-fade-in">
      {message}
    </div>
  )
}

export default ToastNotification
