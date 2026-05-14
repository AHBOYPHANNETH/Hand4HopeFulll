import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Download, Users, ArrowLeft, MapPin, Loader2 } from 'lucide-react'
import Alert from '../../components/ui/Alert'
import {
  PageHeader,
  EmptyState,
  SkeletonRow,
  SearchInput,
} from '../../components/admin/shared'
import {
  adminFetchEventRosters,
  adminFetchEventRoster,
  adminDownloadEventRosterCsv,
} from '../../services/eventService'

function fmtDate(iso) {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function fmtDateTime(iso) {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function fmtGender(g) {
  if (!g) return '—'
  if (g === 'prefer_not_to_say') return 'Prefer not to say'
  return g.charAt(0).toUpperCase() + g.slice(1)
}

export default function EventRosterAdmin() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    adminFetchEventRosters()
      .then(setEvents)
      .catch((e) =>
        setNotice({ type: 'error', text: e.response?.data?.message || 'Failed to load events.' }),
      )
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return events
    return events.filter(
      (e) =>
        e.title?.toLowerCase().includes(q) ||
        e.location?.toLowerCase().includes(q),
    )
  }, [events, search])

  if (selectedId != null) {
    return (
      <RosterDetail
        eventId={selectedId}
        onBack={() => setSelectedId(null)}
      />
    )
  }

  return (
    <>
      <PageHeader
        title="Event volunteer rosters"
        description="Pick an event to see who was approved, then download an Excel-ready CSV to share with the event manager."
      />

      {notice && (
        <div className="mb-4">
          <Alert type={notice.type}>{notice.text}</Alert>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search event or location…" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm dark:divide-slate-800">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3.5">Event</th>
                <th className="px-5 py-3.5">When</th>
                <th className="px-5 py-3.5">Location</th>
                <th className="px-5 py-3.5 text-center">Approved</th>
                <th className="px-5 py-3.5 text-center">Pending</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={6} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8">
                    <EmptyState
                      icon={CalendarDays}
                      title={search ? 'No matching events' : 'No events yet'}
                      description={
                        search
                          ? 'Try a different keyword.'
                          : 'Create an event first, then approved volunteers will show up here.'
                      }
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((e) => (
                  <tr
                    key={e.id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">
                      {e.title}
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {fmtDateTime(e.starts_at)}
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {e.location || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                        {e.approved_count}
                        {e.capacity ? ` / ${e.capacity}` : ''}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                        {e.pending_count}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedId(e.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50"
                      >
                        <Users className="h-3.5 w-3.5" />
                        View roster
                      </button>
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

function RosterDetail({ eventId, onBack }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState(null)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    setLoading(true)
    adminFetchEventRoster(eventId)
      .then(setData)
      .catch((e) =>
        setNotice({ type: 'error', text: e.response?.data?.message || 'Failed to load roster.' }),
      )
      .finally(() => setLoading(false))
  }, [eventId])

  async function download() {
    setNotice(null)
    setDownloading(true)
    try {
      await adminDownloadEventRosterCsv(eventId, data?.event?.title || `event-${eventId}`)
    } catch (e) {
      setNotice({ type: 'error', text: e.response?.data?.message || 'Download failed.' })
    } finally {
      setDownloading(false)
    }
  }

  const volunteers = data?.volunteers ?? []
  const event = data?.event

  return (
    <>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
      >
        <ArrowLeft className="h-4 w-4" /> All events
      </button>

      <PageHeader
        title={event?.title || 'Volunteer roster'}
        description={
          event
            ? `${fmtDateTime(event.starts_at)} · ${event.location || '—'} · ${volunteers.length} approved volunteer${volunteers.length === 1 ? '' : 's'}`
            : 'Approved volunteers for this event.'
        }
        actions={
          <button
            type="button"
            onClick={download}
            disabled={downloading || volunteers.length === 0}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {downloading ? 'Preparing…' : 'Download CSV (Excel)'}
          </button>
        }
      />

      {notice && (
        <div className="mb-4">
          <Alert type={notice.type}>{notice.text}</Alert>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm dark:divide-slate-800">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3.5">#</th>
                <th className="px-5 py-3.5">Name</th>
                <th className="px-5 py-3.5">Gender</th>
                <th className="px-5 py-3.5">Phone</th>
                <th className="px-5 py-3.5">Date of birth</th>
                <th className="px-5 py-3.5">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={6} />)
              ) : volunteers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8">
                    <EmptyState
                      icon={Users}
                      title="No approved volunteers yet"
                      description="Once you approve volunteer requests on the Volunteers page, they'll appear here ready to export."
                    />
                  </td>
                </tr>
              ) : (
                volunteers.map((v, i) => (
                  <tr
                    key={i}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-5 py-4 text-slate-400">{i + 1}</td>
                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">
                      {v.name || '—'}
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {fmtGender(v.gender)}
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-600 dark:text-slate-300">
                      {v.phone || '—'}
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {fmtDate(v.date_of_birth)}
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                      {v.email || '—'}
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
