import { useEffect, useState } from 'react'
import { fetchMyVolunteerRequests } from '../services/eventService'

const statusClass = (status) => {
  const map = {
    approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    rejected: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  }
  return map[status] ?? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
}

export default function MyVolunteerRequests() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyVolunteerRequests()
      .then((data) => setItems(data || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">My Volunteer Requests</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Track the approval status of your event requests.</p>

      {/* overflow-x-auto enables horizontal scroll on small screens */}
      <div className="mt-6 overflow-x-auto rounded-3xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <table className="min-w-full divide-y divide-slate-100 text-sm dark:divide-slate-700">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">
                  Loading requests…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">
                  No volunteer requests yet.
                </td>
              </tr>
            ) : (
              items.map((row) => (
                <tr
                  key={`${row.event_id}-${row.requested_at}`}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">{row.event_title}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                    {new Date(row.event_starts_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{row.notes || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
