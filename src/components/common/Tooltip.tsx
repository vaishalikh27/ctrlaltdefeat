import { useId, useState, type ReactNode } from 'react'

interface TooltipProps {
  label: ReactNode
  children: ReactNode
  side?: 'top' | 'bottom'
}

export function Tooltip({ label, children, side = 'top' }: TooltipProps) {
  const [open, setOpen] = useState(false)
  const id = useId()

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span aria-describedby={id} tabIndex={0} className="outline-none">
        {children}
      </span>
      {open && (
        <span
          id={id}
          role="tooltip"
          className={`pointer-events-none absolute z-50 w-max max-w-64 rounded-lg border border-base-500/40 bg-base-900/95 px-3 py-2 text-xs leading-snug text-base-100 shadow-xl backdrop-blur-sm animate-fade-up ${
            side === 'top' ? 'bottom-full left-1/2 mb-2 -translate-x-1/2' : 'top-full left-1/2 mt-2 -translate-x-1/2'
          }`}
        >
          {label}
        </span>
      )}
    </span>
  )
}
