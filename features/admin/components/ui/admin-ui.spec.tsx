import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { AdminSelect } from './admin-select'
import { AdminBadge } from './admin-badge'

describe('AdminSelect', () => {
  it('renders correctly with options', () => {
    render(
      <AdminSelect data-testid="test-select" defaultValue="opt2">
        <option value="opt1">Option 1</option>
        <option value="opt2">Option 2</option>
      </AdminSelect>
    )

    const select = screen.getByTestId('test-select') as HTMLSelectElement
    expect(select.value).toBe('opt2')
  })

  it('renders sm size variant correctly', () => {
    render(
      <AdminSelect sizeVariant="sm" data-testid="test-sm-select">
        <option value="1">One</option>
      </AdminSelect>
    )

    const select = screen.getByTestId('test-sm-select')
    expect(select.className).toContain('h-8')
    expect(select.className).toContain('text-xs')
  })

  it('triggers onChange when selecting a new option', () => {
    const handleChange = vi.fn()
    render(
      <AdminSelect data-testid="select-change" onChange={handleChange}>
        <option value="A">A</option>
        <option value="B">B</option>
      </AdminSelect>
    )

    fireEvent.change(screen.getByTestId('select-change'), { target: { value: 'B' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })
})

describe('AdminBadge', () => {
  it('renders with appropriate styling for variant', () => {
    render(<AdminBadge variant="completed">Hoàn thành</AdminBadge>)
    const badge = screen.getByText('Hoàn thành')
    expect(badge).toBeDefined()
    expect(badge.parentElement?.className).toContain('bg-emerald-50')
  })

  it('renders pending status with amber styling', () => {
    render(<AdminBadge variant="pending">Chờ xác nhận</AdminBadge>)
    const badge = screen.getByText('Chờ xác nhận')
    expect(badge.parentElement?.className).toContain('bg-amber-50')
  })
})
