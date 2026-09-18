import React from 'react'

export type AdminTableProps = React.HTMLAttributes<HTMLTableElement>

export const AdminTable: React.FC<AdminTableProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full text-left text-sm border-collapse" {...props}>
        {children}
      </table>
    </div>
  )
}

export type AdminTableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement>

export const AdminTableHeader: React.FC<AdminTableHeaderProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <thead className={className} {...props}>
      <tr className="border-b border-slate-100 bg-white">{children}</tr>
    </thead>
  )
}

export type AdminTableHeadProps = React.ThHTMLAttributes<HTMLTableCellElement>

export const AdminTableHead: React.FC<AdminTableHeadProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <th
      className={`px-5 py-3.5 text-left text-[11px] font-semibold tracking-wider text-slate-400 uppercase select-none ${className}`}
      {...props}
    >
      {children}
    </th>
  )
}

export type AdminTableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>

export const AdminTableBody: React.FC<AdminTableBodyProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <tbody className={`divide-y divide-slate-100 bg-white ${className}`} {...props}>
      {children}
    </tbody>
  )
}

export type AdminTableRowProps = React.HTMLAttributes<HTMLTableRowElement>

export const AdminTableRow: React.FC<AdminTableRowProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <tr className={`hover:bg-slate-50/60 transition duration-150 ${className}`} {...props}>
      {children}
    </tr>
  )
}

export type AdminTableCellProps = React.TdHTMLAttributes<HTMLTableCellElement>

export const AdminTableCell: React.FC<AdminTableCellProps> = ({
  children,
  className = '',
  colSpan,
  ...props
}) => {
  return (
    <td
      colSpan={colSpan}
      className={`px-5 py-3.5 text-slate-700 font-medium align-middle ${className}`}
      {...props}
    >
      {children}
    </td>
  )
}
