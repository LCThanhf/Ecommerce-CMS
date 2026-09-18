import React from 'react'
import Image from 'next/image'
import hicasLogo from '@/app/assets/hicas-logo.png'

interface HicasLogoProps {
  className?: string
  imageClassName?: string
}

export const HicasLogo: React.FC<HicasLogoProps> = ({
  className = '',
  imageClassName = 'h-7.5 w-auto',
}) => {
  return (
    <div className={`inline-flex items-center justify-center select-none ${className}`}>
      <Image
        src={hicasLogo}
        alt="HICAS Logo"
        className={`${imageClassName} object-contain`}
        priority
      />
    </div>
  )
}
