export default function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-teal-800">
      <span
        className="h-10 w-10 animate-spin rounded-full border-2 border-teal-200 border-t-teal-600"
        aria-hidden
      />
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}
