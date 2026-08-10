import React from 'react'

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'default' | 'sm' | 'lg'
}

export const AdminButton: React.FC<AdminButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'default',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition duration-150 active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none select-none'

  const variants = {
    primary: 'bg-[#0F60FF] hover:bg-[#0C53DF] text-white shadow-sm rounded-[6px]',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-[6px]',
    outline: 'border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-[6px]',
  }

  const sizes = {
    sm: 'h-9 px-3 text-xs',
    default: 'h-11 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
