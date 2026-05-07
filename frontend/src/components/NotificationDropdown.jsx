import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from './ui/Button'
import { fetchNotifications, markNotificationsRead } from '../services/notificationService'
import { useAuth } from '../context/AuthContext'

function timeAgo(iso) {
  const delta = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000))
  if (delta < 60) return `${delta}s ago`
  if (delta < 3600) return `${Math.floor(delta / 60)}m ago`
  if (delta < 86400) return `${Math.floor(delta / 3600)}h ago`
  return `${Math.floor(delta / 86400)}d ago`
}

export default function NotificationDropdown() {
  const { unreadNotifications, refreshNotificationCount } = useAuth()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  async function loadList() {
    setLoading(true)
    try {
      const data = await fetchNotifications()
      setItems(data.notifications || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!open) return
    fetchNotifications()
      .then((data) => setItems(data.notifications || []))
      .finally(() => setLoading(false))
  }, [open])

  async function markOneRead(id) {
    await markNotificationsRead(id)
    await Promise.all([loadList(), refreshNotificationCount?.()])
  }

  return (
    <div className="relative">
      <button
        type="button"
        className="relative rounded-xl px-3 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-50"
        onClick={() => {
          setOpen((v) => {
            if (!v) setLoading(true)
            return !v
          })
        }}
        aria-label="Notifications"
      >
        🔔
        {unreadNotifications > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
            {unreadNotifications > 99 ? '99+' : unreadNotifications}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3">
            <p className="text-sm font-semibold text-stone-900">Notifications</p>
            <Link to="/notifications" onClick={() => setOpen(false)} className="text-xs font-semibold text-teal-700">
              View all
            </Link>
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            {loading ? (
              <p className="p-3 text-xs text-stone-500">Loading…</p>
            ) : items.length === 0 ? (
              <p className="p-3 text-xs text-stone-500">No notifications yet.</p>
            ) : (
              items.slice(0, 8).map((n) => (
                <div key={n.id} className="mb-2 rounded-xl border border-stone-100 p-3">
                  <p className="text-xs font-semibold text-teal-700">{n.title}</p>
                  <p className="mt-1 text-xs text-stone-700">{n.message}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[11px] text-stone-400">{timeAgo(n.created_at)}</span>
                    {!n.is_read ? (
                      <Button type="button" variant="ghost" className="text-xs" onClick={() => markOneRead(n.id)}>
                        Mark read
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
