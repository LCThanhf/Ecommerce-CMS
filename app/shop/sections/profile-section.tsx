'use client'

import { UserRound } from 'lucide-react'

export default function ProfileSection() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-sky-300 bg-white/60 p-10 text-center">
      <UserRound className="h-16 w-16 text-sky-500" />
      <h2 className="mt-4 text-3xl font-semibold text-neutral-900">My Profile</h2>
      <p className="mt-2 text-lg text-neutral-600">Profile details will appear here.</p>
    </div>
  )
}
