export default function Alert({ type = 'info', children }) {
  const map = {
    info: 'bg-sky-50 text-sky-900 border-sky-100',
    success: 'bg-emerald-50 text-emerald-900 border-emerald-100',
    error: 'bg-rose-50 text-rose-900 border-rose-100',
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
