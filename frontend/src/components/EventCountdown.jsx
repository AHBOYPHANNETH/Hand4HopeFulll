import { useEffect, useState } from 'react'

function pad(n) {
  return String(n).padStart(2, '0')
}

export default function EventCountdown({ isoDate }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const target = new Date(isoDate).getTime()

  if (!Number.isFinite(target)) {
    return (
      <div className="rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-center text-sm font-medium text-teal-900">
        Countdown unavailable.
      </div>
    )
  }

  if (now >= target) {
    return (
      <div className="rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-center text-sm font-medium text-teal-900">
        This event has started or passed.
      </div>
    )
  }

  const diff = target - now
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const mins = Math.floor((diff / (1000 * 60)) % 60)
  const secs = Math.floor((diff / 1000) % 60)

  return (
    <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 text-center shadow-inner">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Starts in</p>
      <div className="mt-3 grid grid-cols-4 gap-2 text-stone-900">
        <div className="rounded-xl bg-white/80 px-2 py-3 shadow-sm">
          <div className="text-2xl font-bold">{pad(days)}</div>
          <div className="text-[11px] font-medium text-stone-500">Days</div>
        </div>
        <div className="rounded-xl bg-white/80 px-2 py-3 shadow-sm">
          <div className="text-2xl font-bold">{pad(hours)}</div>
          <div className="text-[11px] font-medium text-stone-500">Hrs</div>
        </div>
        <div className="rounded-xl bg-white/80 px-2 py-3 shadow-sm">
          <div className="text-2xl font-bold">{pad(mins)}</div>
          <div className="text-[11px] font-medium text-stone-500">Min</div>
        </div>
        <div className="rounded-xl bg-white/80 px-2 py-3 shadow-sm">
          <div className="text-2xl font-bold">{pad(secs)}</div>
          <div className="text-[11px] font-medium text-stone-500">Sec</div>
        </div>
      </div>
    </div>
  )
}
