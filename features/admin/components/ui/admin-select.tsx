import React from 'react'
import { ChevronDown } from 'lucide-react'

export interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string
  sizeVariant?: 'sm' | 'default'
}

export const AdminSelect = React.forwardRef<HTMLSelectElement, AdminSelectProps>(
  ({ className = '', error, sizeVariant = 'default', children, disabled, ...props }, ref) => {
    const sizeClasses =
      sizeVariant === 'sm'
        ? 'h-8 pl-3 pr-7 text-xs font-medium'
        : 'h-11 pl-3.5 pr-8 text-sm'

    return (
      <div className="relative inline-flex items-center w-full">
        <select
          ref={ref}
          disabled={disabled}
          className={`w-full appearance-none rounded-[6px] border border-slate-200 bg-white text-slate-800 transition duration-150 focus:border-[#0F60FF] focus:outline-none focus:ring-1 focus:ring-[#0F60FF] disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer ${sizeClasses} ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none stroke-[2]" />
      </div>
    )
  }
)

AdminSelect.displayName = 'AdminSelect'
