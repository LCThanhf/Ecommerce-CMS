import React from 'react'

export interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const AdminInput = React.forwardRef<HTMLInputElement, AdminInputProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`h-11 w-full rounded-[6px] border border-slate-200 bg-white px-3.5 text-sm text-slate-800 placeholder:text-slate-300 focus:border-[#0F60FF] focus:outline-none focus:ring-1 focus:ring-[#0F60FF] transition duration-150 ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
        } ${className}`}
        {...props}
      />
    )
  }
)

AdminInput.displayName = 'AdminInput'
