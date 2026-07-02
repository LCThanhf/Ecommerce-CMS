import type { ReactNode } from 'react'

interface FieldRowProps {
  type: string
  placeholder: string
  leftIcon: ReactNode
  value: string
  onChange: (value: string) => void
  rightIcon?: ReactNode
  required?: boolean
  autoComplete?: string
}

export const FieldRow = ({
  type,
  placeholder,
  leftIcon,
  value,
  onChange,
  rightIcon,
  required,
  autoComplete,
}: FieldRowProps) => {
  return (
    <label className="relative block">
      <span className="pointer-events-none absolute left-4 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-[#1598d6] leading-none text-white">
        {leftIcon}
      </span>
      <input
        autoComplete={autoComplete}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="h-16 w-full rounded-sm border border-[#d6dee4] bg-[#eff1f3] pl-14 pr-10 text-[16px] text-[#52606d] placeholder:text-[#98a6b4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] outline-none transition focus:border-[#a6d8f2]"
      />
      {rightIcon ? (
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#677784]">{rightIcon}</span>
      ) : null}
    </label>
  )
}
