import { createContext, useCallback, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'

const ToastContext = createContext(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}

const CONFIG = {
  success: {
    icon: CheckCircle,
    classes: 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-200',
    iconClass: 'text-emerald-500 dark:text-emerald-400',
  },
  error: {
    icon: XCircle,
    classes: 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-900/30 dark:border-rose-700 dark:text-rose-200',
    iconClass: 'text-rose-500 dark:text-rose-400',
  },
  warning: {
    icon: AlertTriangle,
    classes: 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-200',
    iconClass: 'text-amber-500 dark:text-amber-400',
  },
  info: {
    icon: Info,
    classes: 'bg-sky-50 border-sky-200 text-sky-900 dark:bg-sky-900/30 dark:border-sky-700 dark:text-sky-200',
    iconClass: 'text-sky-500 dark:text-sky-400',
  },
}

function ToastItem({ id, message, type, onDismiss }) {
  const { icon: Icon, classes, iconClass } = CONFIG[type] ?? CONFIG.info
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`flex w-full max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-sm ${classes}`}
    >
      <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${iconClass}`} />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        type="button"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
        className="flex-shrink-0 opacity-50 transition-opacity hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (message, type = 'info', duration = 4000) => {
      const id = `${Date.now()}-${Math.random()}`
      setToasts((prev) => [...prev, { id, message, type }])
      if (duration > 0) setTimeout(() => dismiss(id), duration)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed right-4 top-20 z-[200] flex flex-col gap-3 sm:top-4"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <div key={t.id} className="pointer-events-auto">
              <ToastItem {...t} onDismiss={dismiss} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
