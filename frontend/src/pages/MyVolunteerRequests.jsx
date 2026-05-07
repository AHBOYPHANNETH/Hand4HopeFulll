import { useEffect, useState } from 'react'
import { fetchMyVolunteerRequests } from '../services/eventService'

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
      <h1 className="text-3xl font-semibold text-stone-900">My Volunteer Requests</h1>
      <p className="mt-2 text-sm text-stone-600">Track the approval status of your event requests.</p>

      <div className="mt-6 overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-stone-100 text-sm">
          <thead className="bg-stone-50 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? (
              <tr><td className="px-4 py-4 text-stone-500" colSpan={4}>Loading requests…</td></tr>
            ) : items.length === 0 ? (
              <tr><td className="px-4 py-4 text-stone-500" colSpan={4}>No volunteer requests yet.</td></tr>
            ) : (
              items.map((row) => (
                <tr key={`${row.event_id}-${row.requested_at}`}>
                  <td className="px-4 py-3 font-semibold text-stone-900">{row.event_title}</td>
                  <td className="px-4 py-3 text-stone-600">{new Date(row.event_starts_at).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      row.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-700'
                        : row.status === 'rejected'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-stone-600">{row.notes || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
