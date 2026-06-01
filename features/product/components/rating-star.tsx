import React from 'react'

export const RatingStar = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 59 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M47.7227 59.9961L29.4928 49.7439L11.2586 59.9886L14.7446 38.2831L-0.00270414 22.9072L20.3817 19.7446L29.5016 -0.00265632L38.6141 19.7488L58.9973 22.92L44.2447 38.2892L47.7227 59.9961Z"
        fill="#FFCC00"
      />
      <path
        d="M38.6758 19.623C29.444 33.0596 29.3438 33.2058 29.3438 33.2058L58.9352 22.845L38.6758 19.623Z"
        fill="#FFE680"
      />
      <path d="M29.4955 32.917V49.7877L11.0774 59.8945L29.4955 32.917Z" fill="#FFDD55" />
      <path d="M29.4955 32.917L47.6047 59.3803L44.2057 37.9488L29.4955 32.917Z" fill="#FFDD55" />
      <path d="M0.117065 22.8678L29.4971 32.9177L20.4195 19.6523L0.117065 22.8678Z" fill="#FFE680" />
      <path d="M29.4955 32.917V0.0409241L38.5572 19.6448L29.4955 32.917Z" fill="#FFDD55" />
      <path d="M11.2657 59.622L14.6866 38.0095L29.498 32.917L11.2657 59.622Z" fill="#FFD42A" />
    </svg>
  )
}

export default RatingStar
