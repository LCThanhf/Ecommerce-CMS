import React from 'react'
import {
  Clock,
  AlertTriangle,
  Truck,
  CheckCircle2,
  XCircle,
  LucideIcon,
} from 'lucide-react'

export type AdminBadgeVariant =
  | 'pending'
  | 'processing'
  | 'shipping'
  | 'completed'
  | 'cancelled'
  | 'neutral'

interface AdminBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: AdminBadgeVariant
  icon?: LucideIcon | false
  children: React.ReactNode
}

const VARIANT_STYLES: Record<
  AdminBadgeVariant,
  { bg: string; defaultIcon: LucideIcon }
> = {
  pending: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    defaultIcon: Clock,
  },
  processing: {
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    defaultIcon: AlertTriangle,
  },
  shipping: {
    bg: 'bg-purple-50 text-purple-700 border-purple-200',
    defaultIcon: Truck,
  },
  completed: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    defaultIcon: CheckCircle2,
  },
  cancelled: {
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    defaultIcon: XCircle,
  },
  neutral: {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    defaultIcon: Clock,
  },
}

export const AdminBadge: React.FC<AdminBadgeProps> = ({
  variant = 'neutral',
  icon,
  children,
  className = '',
  ...props
}) => {
  const config = VARIANT_STYLES[variant] || VARIANT_STYLES.neutral
  const IconComponent = icon === false ? null : icon || config.defaultIcon

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold select-none ${config.bg} ${className}`}
      {...props}
    >
      {IconComponent && <IconComponent className="h-3 w-3 shrink-0" />}
      <span>{children}</span>
    </span>
  )
}
