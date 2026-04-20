'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import avatarIcon from '@/app/assets/avatar.png'
import calendarIcon from '@/app/assets/calendar.png'

const GENDER_OPTIONS = ['Male', 'Female']

const formatDisplayDate = (isoDate: string): string => {
  if (!isoDate) return ''
  const [year, month, day] = isoDate.split('-')
  return `${month}/${day}/${year}`
}

const ProfileSection = () => {
  const hasAuthHydrated = useSelector((state: RootState) => state.auth.hasHydrated)
  const [dob, setDob] = useState('2018-01-01')
  const [gender, setGender] = useState('Male')
  const [addressCompany, setAddressCompany] = useState(
    '15, Duy Tan, Dich Vong Hau, Cau Giay, Ha Noi',
  )
  const [addressHome, setAddressHome] = useState(
    '15, Duy Tan, Dich Vong Hau, Cau Giay, Ha Noi',
  )

  if (!hasAuthHydrated) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-xl text-neutral-500">Đang tải hồ sơ...</p>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto px-4 sm:px-12 pt-6 sm:pt-14 pb-7 md:px-20 md:pt-16">
      {/* Avatar + name + email */}
      <div className="mb-8 sm:mb-12 flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-10 md:gap-14">
        <div className="h-24 w-24 sm:h-36 sm:w-36 shrink-0 overflow-hidden rounded-full border border-neutral-200 md:h-44 md:w-44">
          <Image
            src={avatarIcon}
            alt="User avatar"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-4xl font-bold text-neutral-900 md:text-5xl">MR. USER</h2>
          <p className="mt-4 sm:mt-10 text-lg sm:text-2xl text-neutral-800 md:text-3xl">
            Email: user@gmail.com
          </p>
        </div>
      </div>

      {/* Form fields */}
      <div className="flex flex-col gap-5 sm:gap-7">
        {/* Date of birth */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <span className="sm:w-40 sm:shrink-0 text-sm sm:text-base text-neutral-800 md:text-lg">
            Date of birth:
          </span>
          <div className="inline-flex items-end gap-2 border-b border-neutral-800 pb-0">
            <span className="text-base leading-none text-neutral-800 md:text-lg">
              {formatDisplayDate(dob)}
            </span>
            {/* Overlay native date input on the calendar icon */}
            <div className="relative inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center md:h-7 md:w-7">
              <Image
                src={calendarIcon}
                alt="Calendar"
                className="pointer-events-none h-full w-full object-contain"
              />
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                aria-label="Date of birth"
              />
            </div>
          </div>
        </div>

        {/* Sex / Gender */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <span className="sm:w-40 sm:shrink-0 text-sm sm:text-base text-neutral-800 md:text-lg">
            Sex:
          </span>
          <div className="relative inline-flex items-center">
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="appearance-none bg-transparent pl-1 pr-7 text-base text-neutral-800 outline-none md:text-lg"
              aria-label="Gender"
            >
              {GENDER_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <svg
              aria-hidden
              className="pointer-events-none absolute right-0 top-1/2 h-5 w-5 -translate-y-1/2"
              viewBox="0 0 31 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M30.6903 8.32431L29.1373 6.77142C28.9303 6.56405 28.6919 6.46069 28.4224 6.46069C28.1536 6.46069 27.9153 6.56405 27.7084 6.77142L15.5002 18.979L3.29248 6.77175C3.08543 6.56438 2.84716 6.46102 2.57799 6.46102C2.30872 6.46102 2.07045 6.56438 1.86351 6.77175L0.31073 8.32475C0.103359 8.53168 0 8.76995 0 9.03923C0 9.30829 0.103685 9.54656 0.31073 9.7535L14.7857 24.2288C14.9926 24.4358 15.231 24.5393 15.5002 24.5393C15.7693 24.5393 16.0073 24.4358 16.2141 24.2288L30.6903 9.7535C30.8972 9.54645 31 9.30818 31 9.03923C31 8.76995 30.8972 8.53168 30.6903 8.32431Z" fill="black"/>
            </svg>
          </div>
        </div>

        {/* Address Company */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <span className="sm:w-40 sm:shrink-0 text-sm sm:text-base text-neutral-800 md:text-lg">
            Address Company:
          </span>
          <span className="relative inline-block border-b border-neutral-800 pb-1 w-full sm:w-auto">
            <span aria-hidden className="invisible whitespace-pre text-base md:text-lg">{addressCompany || ' '}</span>
            <input
              type="text"
              value={addressCompany}
              onChange={(e) => setAddressCompany(e.target.value)}
              className="absolute inset-0 w-full bg-transparent text-base text-neutral-800 outline-none md:text-lg"
              aria-label="Address Company"
            />
          </span>
        </div>

        {/* Address Home */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <span className="sm:w-40 sm:shrink-0 text-sm sm:text-base text-neutral-800 md:text-lg">
            Address Home:
          </span>
          <span className="relative inline-block border-b border-neutral-800 pb-1 w-full sm:w-auto">
            <span aria-hidden className="invisible whitespace-pre text-base md:text-lg">{addressHome || ' '}</span>
            <input
              type="text"
              value={addressHome}
              onChange={(e) => setAddressHome(e.target.value)}
              className="absolute inset-0 w-full bg-transparent text-base text-neutral-800 outline-none md:text-lg"
              aria-label="Address Home"
            />
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProfileSection
