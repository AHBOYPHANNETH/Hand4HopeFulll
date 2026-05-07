import { useEffect, useState } from 'react'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import Spinner from '../components/ui/Spinner'
import {
  adminFetchVolunteerRequests,
  adminUpdateVolunteerRequestStatus,
  adminCreateEvent,
  adminDeleteEvent,
  adminFetchEvents,
  adminUpdateEvent,
} from '../services/eventService'
import { adminFetchContents, adminUpsertContents } from '../services/contentService'
import { fetchAnalytics, fetchContacts, fetchDonations } from '../services/adminService'

const tabs = [
  { id: 'overview',   label: 'Overview' },
  { id: 'events',     label: 'Events' },
  { id: 'donations',  label: 'Donations' },
  { id: 'contacts',   label: 'Contacts' },
  { id: 'volunteers', label: 'Volunteers' },
  { id: 'content',    label: 'Website Content' },
]

const statusBadge = (status) => {
  const map = {
    approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  }
  return map[status] ?? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview')
  const [analytics, setAnalytics] = useState(null)
  const [events, setEvents] = useState([])
  const [donations, setDonations] = useState([])
  const [contacts, setContacts] = useState([])
  const [contents, setContents] = useState([])
  const [volunteerRequests, setVolunteerRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState(null)

  const [eventForm, setEventForm] = useState({
    title: '', description: '', location: '', starts_at: '', image: null,
  })
  const [editingId, setEditingId] = useState(null)

  async function reloadSection(active) {
    try {
      if (active === 'overview')   setAnalytics(await fetchAnalytics())
      if (active === 'events')     setEvents(await adminFetchEvents())
      if (active === 'donations')  setDonations(await fetchDonations())
      if (active === 'contacts')   setContacts(await fetchContacts())
      if (active === 'volunteers') setVolunteerRequests(await adminFetchVolunteerRequests())
      if (active === 'content')    setContents(await adminFetchContents())
    } catch (e) {
      setNotice({ type: 'error', text: e.response?.data?.message || 'Failed to load data.' })
    }
  }

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      await reloadSection(tab)
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [tab])

  async function saveContents() {
    setNotice(null)
    try {
      const payload = contents.map((c) => ({ key: c.key, value: c.value ?? '' }))
      setContents(await adminUpsertContents(payload))
      setNotice({ type: 'success', text: 'Website content saved.' })
    } catch {
      setNotice({ type: 'error', text: 'Unable to save content.' })
    }
  }

  function updateDraft(key, value) {
    setContents((rows) => rows.map((r) => (r.key === key ? { ...r, value } : r)))
  }

  async function updateVolunteerStatus(event_id, user_id, status) {
    setNotice(null)
    try {
      const res = await adminUpdateVolunteerRequestStatus({ event_id, user_id, status })
      setVolunteerRequests(await adminFetchVolunteerRequests())
      setNotice({ type: 'success', text: res.message || 'Volunteer request updated.' })
    } catch (e) {
      setNotice({ type: 'error', text: e.response?.data?.message || 'Failed to update.' })
    }
  }

  async function submitEvent(e) {
    e.preventDefault()
    setNotice(null)
    const fd = new FormData()
    fd.append('title', eventForm.title)
    fd.append('description', eventForm.description)
    fd.append('location', eventForm.location)
    fd.append('starts_at', new Date(eventForm.starts_at).toISOString())
    if (eventForm.image) fd.append('image', eventForm.image)

    try {
      if (editingId) {
        await adminUpdateEvent(editingId, fd)
        setNotice({ type: 'success', text: 'Event updated.' })
      } else {
        await adminCreateEvent(fd)
        setNotice({ type: 'success', text: 'Event created.' })
      }
      setEventForm({ title: '', description: '', location: '', starts_at: '', image: null })
      setEditingId(null)
      setEvents(await adminFetchEvents())
    } catch (err) {
      const errs = err.response?.data?.errors
      const msg = errs ? Object.values(errs).flat().join(' ') : err.response?.data?.message
      setNotice({ type: 'error', text: msg || 'Unable to save event.' })
    }
  }

  async function removeEvent(id) {
    if (!confirm('Delete this event?')) return
    setNotice(null)
    try {
      await adminDeleteEvent(id)
      setEvents(await adminFetchEvents())
      setNotice({ type: 'success', text: 'Event deleted.' })
    } catch {
      setNotice({ type: 'error', text: 'Unable to delete event.' })
    }
  }

  function startEdit(ev) {
    setEditingId(ev.id)
    setEventForm({
      title: ev.title,
      description: ev.description || '',
      location: ev.location,
      starts_at: ev.starts_at.slice(0, 16),
      image: null,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading && tab === 'overview' && !analytics) {
    return <Spinner label="Loading dashboard…" />
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      {/* Header */}
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-400">Admin</p>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Hand4Hope Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Secure tools for programs, storytelling, and supporter care.</p>
        </div>
      </header>

      {/* Tab Bar — scrollable on mobile */}
      <div className="mt-8 overflow-x-auto pb-1">
        <div className="flex min-w-max gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                tab === t.id
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {notice && (
        <div className="mt-6">
          <Alert type={notice.type}>{notice.text}</Alert>
        </div>
      )}

      {/* ── Overview ── */}
      {tab === 'overview' && analytics && (
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Published events" value={analytics.events_count} />
          <StatCard
            label="Donations recorded"
            value={analytics.donations_count}
            hint={`Total: ${Number(analytics.donations_total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          />
          <StatCard label="Contact messages" value={analytics.contacts_count} />
          <StatCard label="Volunteer sign-ups" value={analytics.volunteer_signups_count} />
        </section>
      )}

      {/* ── Events ── */}
      {tab === 'events' && (
        <section className="mt-8 space-y-8">
          <form
            onSubmit={submitEvent}
            className="space-y-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {editingId ? 'Edit event' : 'Create event'}
              </h2>
              {editingId && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingId(null)
                    setEventForm({ title: '', description: '', location: '', starts_at: '', image: null })
                  }}
                >
                  Cancel edit
                </Button>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Title">
                <input
                  required
                  placeholder="Event title"
                  value={eventForm.title}
                  onChange={(e) => setEventForm((f) => ({ ...f, title: e.target.value }))}
                  className="input-field"
                />
              </Field>
              <Field label="Location">
                <input
                  required
                  placeholder="Phnom Penh, Cambodia"
                  value={eventForm.location}
                  onChange={(e) => setEventForm((f) => ({ ...f, location: e.target.value }))}
                  className="input-field"
                />
              </Field>
            </div>

            <Field label="Starts at">
              <input
                type="datetime-local"
                required
                value={eventForm.starts_at}
                onChange={(e) => setEventForm((f) => ({ ...f, starts_at: e.target.value }))}
                className="input-field"
              />
            </Field>

            <Field label="Description">
              <textarea
                rows={4}
                placeholder="Describe the event…"
                value={eventForm.description}
                onChange={(e) => setEventForm((f) => ({ ...f, description: e.target.value }))}
                className="textarea-field"
              />
            </Field>

            <Field label="Banner image">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEventForm((f) => ({ ...f, image: e.target.files?.[0] || null }))}
                className="text-sm text-slate-600 dark:text-slate-400"
              />
            </Field>

            <Button type="submit">{editingId ? 'Update event' : 'Publish event'}</Button>
          </form>

          {/* Events table */}
          <div className="overflow-x-auto rounded-3xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <table className="min-w-full divide-y divide-slate-100 text-sm dark:divide-slate-700">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Starts</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">
                      No events yet.
                    </td>
                  </tr>
                ) : (
                  events.map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">{ev.title}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{new Date(ev.starts_at).toLocaleString()}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{ev.location}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" size="xs" onClick={() => startEdit(ev)}>Edit</Button>
                          <Button type="button" variant="danger" size="xs" onClick={() => removeEvent(ev.id)}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── Donations ── */}
      {tab === 'donations' && (
        <section className="mt-8">
          <div className="overflow-x-auto rounded-3xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <table className="min-w-full divide-y divide-slate-100 text-sm dark:divide-slate-700">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">Donor</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {donations.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">No donations yet.</td>
                  </tr>
                ) : (
                  donations.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{d.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{d.email}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-primary-700 dark:text-primary-400">
                        {d.currency} {Number(d.amount).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{new Date(d.created_at).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── Contacts ── */}
      {tab === 'contacts' && (
        <section className="mt-8 space-y-4">
          {contacts.length === 0 && (
            <p className="text-slate-500 dark:text-slate-400">No contact messages yet.</p>
          )}
          {contacts.map((c) => (
            <article
              key={c.id}
              className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{c.name}</p>
                  <p className="text-sm text-primary-700 dark:text-primary-400">{c.email}</p>
                  {c.phone && <p className="text-xs text-slate-500 dark:text-slate-400">{c.phone}</p>}
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500">{new Date(c.created_at).toLocaleString()}</p>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">{c.message}</p>
            </article>
          ))}
        </section>
      )}

      {/* ── Website Content ── */}
      {tab === 'content' && (
        <section className="mt-8 space-y-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Site copy</h2>
            <Button type="button" onClick={saveContents}>Save changes</Button>
          </div>
          <div className="space-y-6">
            {contents.map((row) => (
              <label key={row.key} className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{row.key}</span>
                <textarea
                  rows={row.key.includes('json') ? 8 : 4}
                  value={row.value ?? ''}
                  onChange={(e) => updateDraft(row.key, e.target.value)}
                  className="textarea-field font-mono text-xs md:text-sm"
                />
              </label>
            ))}
          </div>
        </section>
      )}

      {/* ── Volunteers ── */}
      {tab === 'volunteers' && (
        <section className="mt-8">
          <div className="overflow-x-auto rounded-3xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <table className="min-w-full divide-y divide-slate-100 text-sm dark:divide-slate-700">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">Volunteer</th>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Requested</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {volunteerRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">No volunteer requests.</td>
                  </tr>
                ) : (
                  volunteerRequests.map((v) => (
                    <tr key={`${v.event_id}-${v.user_id}`} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{v.user_name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{v.user_email}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{v.event_title}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{new Date(v.requested_at).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(v.status)}`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button type="button" size="xs" onClick={() => updateVolunteerStatus(v.event_id, v.user_id, 'approved')}>
                            Accept
                          </Button>
                          <Button type="button" variant="outline" size="xs" onClick={() => updateVolunteerStatus(v.event_id, v.user_id, 'rejected')}>
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-3xl border border-primary-100 bg-primary-50/70 p-6 shadow-inner dark:border-primary-900/50 dark:bg-primary-900/20">
      <p className="text-sm font-semibold text-primary-900 dark:text-primary-300">{label}</p>
      <p className="mt-3 text-4xl font-semibold text-primary-800 dark:text-primary-200">{value ?? '—'}</p>
      {hint && <p className="mt-2 text-xs text-primary-900/70 dark:text-primary-400">{hint}</p>}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
      {children}
    </label>
  )
}
