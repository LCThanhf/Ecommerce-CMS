import React from 'react'

export interface AdminCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const AdminCheckbox: React.FC<AdminCheckboxProps> = ({
  label,
  className = '',
  id,
  checked,
  onChange,
  ...props
}) => {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={`h-4 w-4 rounded border-slate-300 text-[#0F60FF] focus:ring-[#0F60FF] cursor-pointer accent-[#0F60FF] ${className}`}
        {...props}
      />
      {label && <span className="text-xs text-slate-600 font-normal">{label}</span>}
    </label>
  )
}
