import { useEffect, useState } from 'react'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { fetchNotifications, markNotificationsRead } from '../services/notificationService'

function timeAgo(iso) {
  const delta = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000))
  if (delta < 60) return `${delta}s ago`
  if (delta < 3600) return `${Math.floor(delta / 60)}m ago`
  if (delta < 86400) return `${Math.floor(delta / 3600)}h ago`
  return `${Math.floor(delta / 86400)}d ago`
}

export default function Notifications() {
  const { refreshNotificationCount } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  async function load(useLoadingState = true) {
    if (useLoadingState) setLoading(true)
    try {
      const data = await fetchNotifications()
      setItems(data.notifications || [])
    } finally {
      if (useLoadingState) setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
      .then((data) => setItems(data.notifications || []))
      .finally(() => setLoading(false))
  }, [])

  async function markAll() {
    await markNotificationsRead()
    await Promise.all([load(), refreshNotificationCount?.()])
  }

  async function markOne(id) {
    await markNotificationsRead(id)
    await Promise.all([load(), refreshNotificationCount?.()])
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold text-stone-900">Notifications</h1>
        <Button type="button" variant="outline" onClick={markAll}>Mark all as read</Button>
      </div>
      <div className="mt-6 space-y-3">
        {loading ? <p className="text-sm text-stone-500">Loading notifications…</p> : null}
        {!loading && items.length === 0 ? <p className="text-sm text-stone-500">No notifications available.</p> : null}
        {items.map((n) => (
          <article key={n.id} className={`rounded-2xl border p-4 ${n.is_read ? 'border-stone-100 bg-white' : 'border-teal-100 bg-teal-50/50'}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-teal-800">{n.title}</p>
                <p className="mt-1 text-sm text-stone-700">{n.message}</p>
                <p className="mt-2 text-xs text-stone-400">{timeAgo(n.created_at)}</p>
              </div>
              {!n.is_read ? (
                <Button type="button" variant="ghost" className="text-xs" onClick={() => markOne(n.id)}>
                  Mark read
                </Button>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
