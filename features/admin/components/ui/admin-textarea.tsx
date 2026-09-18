import React from 'react'

export interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
}

export const AdminTextarea = React.forwardRef<HTMLTextAreaElement, AdminTextareaProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full rounded-[6px] border border-slate-200 bg-white p-3.5 text-sm text-slate-800 placeholder:text-slate-300 focus:border-[#1867FF] focus:outline-none focus:ring-1 focus:ring-[#1867FF] transition duration-150 resize-y min-h-[100px] ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
        } ${className}`}
        {...props}
      />
    )
  }
)

AdminTextarea.displayName = 'AdminTextarea'
