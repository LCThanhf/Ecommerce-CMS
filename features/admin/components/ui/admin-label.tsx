import React from 'react'

export interface AdminLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const AdminLabel: React.FC<AdminLabelProps> = ({ children, className = '', ...props }) => {
  return (
    <label className={`block text-xs font-medium text-slate-600 mb-1.5 ${className}`} {...props}>
      {children}
    </label>
  )
}
