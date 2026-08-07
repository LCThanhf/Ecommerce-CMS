import React from 'react'
import Image from 'next/image'
import hicasLogo from '@/app/assets/hicas-logo.png'

interface HicasLogoProps {
  className?: string
}

export const HicasLogo: React.FC<HicasLogoProps> = ({ className = '' }) => {
  return (
    <div className={`inline-flex items-center justify-center select-none ${className}`}>
      <Image
        src={hicasLogo}
        alt="HICAS Logo"
        className="h-14 w-auto object-contain"
        priority
      />
    </div>
  )
}

