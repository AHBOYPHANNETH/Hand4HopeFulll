export default function Alert({ type = 'info', children }) {
  const map = {
    info:    'bg-sky-50 text-sky-900 border-sky-100 dark:bg-sky-900/20 dark:text-sky-200 dark:border-sky-800',
    success: 'bg-emerald-50 text-emerald-900 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-200 dark:border-emerald-800',
    error:   'bg-rose-50 text-rose-900 border-rose-100 dark:bg-rose-900/20 dark:text-rose-200 dark:border-rose-800',
    warning: 'bg-amber-50 text-amber-900 border-amber-100 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-800',
  }

  return (
    <div
      role="status"
      className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${map[type] ?? map.info}`}
    >
      {children}
    </div>
  )
}
