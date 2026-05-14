import { useEffect, useMemo, useState } from 'react'
import { Users, Check, X } from 'lucide-react'
import Alert from '../../components/ui/Alert'
import {
  PageHeader,
  EmptyState,
  SkeletonRow,
  SearchInput,
  StatusBadge,
} from '../../components/admin/shared'
import {
  adminFetchVolunteerRequests,
  adminUpdateVolunteerRequestStatus,
} from '../../services/eventService'

const FILTERS = [
  { id: 'all',       label: 'All' },
  { id: 'pending',   label: 'Pending' },
  { id: 'approved',  label: 'Approved' },
  { id: 'rejected',  label: 'Rejected' },
]

export default function VolunteersAdmin() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  async function load() {
    try {
      setRequests(await adminFetchVolunteerRequests())
    } catch (e) {
      setNotice({ type: 'error', text: e.response?.data?.message || 'Failed to load volunteers.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function updateStatus(event_id, user_id, status) {
    setNotice(null)
    try {
      const res = await adminUpdateVolunteerRequestStatus({ event_id, user_id, status })
      await load()
      setNotice({ type: 'success', text: res.message || 'Volunteer request updated.' })
    } catch (e) {
      setNotice({ type: 'error', text: e.response?.data?.message || 'Failed to update.' })
    }
  }

  const filtered = useMemo(
    () =>
      requests.filter((v) => {
        const okStatus = filter === 'all' || v.status === filter
        const okSearch =
          !search ||
          v.user_name?.toLowerCase().includes(search.toLowerCase()) ||
          v.user_email?.toLowerCase().includes(search.toLowerCase()) ||
          v.event_title?.toLowerCase().includes(search.toLowerCase())
        return okStatus && okSearch
      }),
    [requests, filter, search]
  )

  const counts = useMemo(
    () => ({
      all: requests.length,
      pending: requests.filter((v) => v.status === 'pending').length,
      approved: requests.filter((v) => v.status === 'approved').length,
      rejected: requests.filter((v) => v.status === 'rejected').length,
    }),
    [requests]
  )

  return (
    <>
      <PageHeader
        title="Volunteer requests"
        description="Approve or reject volunteer applications for upcoming events."
      />

      {notice && (
        <div className="mb-4">
          <Alert type={notice.type}>{notice.text}</Alert>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                filter === f.id
                  ? 'bg-primary-600 text-white shadow'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {f.label}
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  filter === f.id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {counts[f.id]}
              </span>
            </button>
          ))}
        </div>
        <SearchInput value={search} onChange={setSearch} placeholder="Search volunteer or event…" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm dark:divide-slate-800">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3.5">Volunteer</th>
                <th className="px-5 py-3.5">Event</th>
                <th className="px-5 py-3.5">Requested</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={5} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8">
                    <EmptyState
                      icon={Users}
                      title={
                        search || filter !== 'all'
                          ? 'No matching requests'
                          : 'No volunteer requests'
                      }
                      description={
                        search || filter !== 'all'
                          ? 'Try changing the filter or search keyword.'
                          : 'Volunteer requests will appear here as they come in.'
                      }
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((v) => (
                  <tr
                    key={`${v.event_id}-${v.user_id}`}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                          {(v.user_name || 'V').slice(0, 1).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900 dark:text-white">
                            {v.user_name}
                          </p>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {v.user_email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-700 dark:text-slate-300">{v.event_title}</td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                      {new Date(v.requested_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={v.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      {v.status === 'pending' ? (
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => updateStatus(v.event_id, v.user_id, 'approved')}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
                          >
                            <Check className="h-3.5 w-3.5" /> Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => updateStatus(v.event_id, v.user_id, 'rejected')}
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-orange-600 transition-colors hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-900/30"
                          >
                            <X className="h-3.5 w-3.5" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
