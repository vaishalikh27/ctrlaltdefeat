import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { useApp } from '../../state/AppContext'
import type { ToastMessage } from '../../types'

const TONE_CONFIG: Record<ToastMessage['tone'], { icon: typeof Info; classes: string; iconClass: string }> = {
  default: { icon: Info, classes: 'border-base-500/40', iconClass: 'text-signal-400' },
  success: { icon: CheckCircle2, classes: 'border-bull-500/40', iconClass: 'text-bull-400' },
  warning: { icon: AlertTriangle, classes: 'border-amber-500/40', iconClass: 'text-amber-400' },
  danger: { icon: XCircle, classes: 'border-bear-500/40', iconClass: 'text-bear-400' },
}

export function ToastViewport() {
  const { toasts, dismissToast } = useApp()

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-full max-w-sm flex-col gap-2.5">
      {toasts.map((toast) => {
        const cfg = TONE_CONFIG[toast.tone]
        const Icon = cfg.icon
        return (
          <div
            key={toast.id}
            className={`glass-panel pointer-events-auto flex items-start gap-3 rounded-xl border ${cfg.classes} p-3.5 shadow-2xl animate-fade-up`}
          >
            <Icon className={`mt-0.5 h-4.5 w-4.5 shrink-0 ${cfg.iconClass}`} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-base-100">{toast.title}</p>
              {toast.description && <p className="mt-0.5 text-xs leading-snug text-base-300">{toast.description}</p>}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 rounded-md p-1 text-base-400 transition-colors hover:bg-base-700/60 hover:text-base-100"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
