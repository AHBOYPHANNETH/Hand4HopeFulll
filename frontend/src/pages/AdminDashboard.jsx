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
  { id: 'overview', label: 'Overview' },
  { id: 'events', label: 'Events' },
  { id: 'donations', label: 'Donations' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'volunteers', label: 'Volunteer requests' },
  { id: 'content', label: 'Website content' },
]

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
    title: '',
    description: '',
    location: '',
    starts_at: '',
    image: null,
  })
  const [editingId, setEditingId] = useState(null)

  async function reloadSection(active) {
    try {
      if (active === 'overview') {
        const data = await fetchAnalytics()
        setAnalytics(data)
      }
      if (active === 'events') {
        setEvents(await adminFetchEvents())
      }
      if (active === 'donations') {
        setDonations(await fetchDonations())
      }
      if (active === 'contacts') {
        setContacts(await fetchContacts())
      }
      if (active === 'volunteers') {
        setVolunteerRequests(await adminFetchVolunteerRequests())
      }
      if (active === 'content') {
        setContents(await adminFetchContents())
      }
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
    return () => {
      cancelled = true
    }
  }, [tab])

  async function saveContents() {
    setNotice(null)
    try {
      const payload = contents.map((c) => ({
        key: c.key,
        value: c.value ?? '',
      }))
      const updated = await adminUpsertContents(payload)
      setContents(updated)
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
      setNotice({ type: 'error', text: e.response?.data?.message || 'Failed to update volunteer request.' })
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
    if (eventForm.image) {
      fd.append('image', eventForm.image)
    }

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
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Admin</p>
          <h1 className="text-3xl font-semibold text-stone-900">Hand4Hope dashboard</h1>
          <p className="mt-2 text-sm text-stone-600">Secure tools for programs, storytelling, and supporter care.</p>
        </div>
      </header>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-stone-100 pb-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === t.id ? 'bg-teal-700 text-white shadow-sm' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {notice ? (
        <div className="mt-6">
          <Alert type={notice.type}>{notice.text}</Alert>
        </div>
      ) : null}

      {tab === 'overview' && analytics ? (
        <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Published events" value={analytics.events_count} />
          <StatCard
            label="Donations recorded"
            value={analytics.donations_count}
            hint={`Total amount: ${Number(analytics.donations_total_amount || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
          />
          <StatCard label="Contacts" value={analytics.contacts_count} />
          <StatCard label="Volunteer sign-ups" value={analytics.volunteer_signups_count} />
        </section>
      ) : null}

      {tab === 'events' ? (
        <section className="mt-8 space-y-10">
          <form onSubmit={submitEvent} className="rounded-3xl border border-stone-100 bg-white p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-stone-900">{editingId ? 'Edit event' : 'Create event'}</h2>
              {editingId ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setEditingId(null)
                    setEventForm({ title: '', description: '', location: '', starts_at: '', image: null })
                  }}
                >
                  Cancel edit
                </Button>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Title">
                <input
                  required
                  value={eventForm.title}
                  onChange={(e) => setEventForm((f) => ({ ...f, title: e.target.value }))}
                  className="input"
                />
              </Field>
              <Field label="Location">
                <input
                  required
                  value={eventForm.location}
                  onChange={(e) => setEventForm((f) => ({ ...f, location: e.target.value }))}
                  className="input"
                />
              </Field>
            </div>

            <Field label="Starts at">
              <input
                type="datetime-local"
                required
                value={eventForm.starts_at}
                onChange={(e) => setEventForm((f) => ({ ...f, starts_at: e.target.value }))}
                className="input"
              />
            </Field>

            <Field label="Description">
              <textarea
                rows={4}
                value={eventForm.description}
                onChange={(e) => setEventForm((f) => ({ ...f, description: e.target.value }))}
                className="input"
              />
            </Field>

            <Field label="Banner image">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEventForm((f) => ({ ...f, image: e.target.files?.[0] || null }))}
                className="text-sm"
              />
            </Field>

            <Button type="submit">{editingId ? 'Update event' : 'Publish event'}</Button>
          </form>

          <div className="overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-stone-100 text-sm">
              <thead className="bg-stone-50 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Starts</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {events.map((ev) => (
                  <tr key={ev.id}>
                    <td className="px-4 py-3 font-semibold text-stone-900">{ev.title}</td>
                    <td className="px-4 py-3 text-stone-600">{new Date(ev.starts_at).toLocaleString()}</td>
                    <td className="px-4 py-3 text-stone-600">{ev.location}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Button type="button" variant="outline" className="text-xs" onClick={() => startEdit(ev)}>
                        Edit
                      </Button>
                      <Button type="button" variant="danger" className="text-xs" onClick={() => removeEvent(ev.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {tab === 'donations' ? (
        <section className="mt-8 overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-stone-100 text-sm">
            <thead className="bg-stone-50 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3">Donor</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {donations.map((d) => (
                <tr key={d.id}>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-stone-900">{d.name}</div>
                    <div className="text-xs text-stone-500">{d.email}</div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-teal-800">
                    {d.currency} {Number(d.amount).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-stone-600">{new Date(d.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      {tab === 'contacts' ? (
        <section className="mt-8 space-y-4">
          {contacts.map((c) => (
            <article key={c.id} className="rounded-3xl border border-stone-100 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-stone-900">{c.name}</p>
                  <p className="text-sm text-teal-800">{c.email}</p>
                  {c.phone ? <p className="text-xs text-stone-500">{c.phone}</p> : null}
                </div>
                <p className="text-xs text-stone-400">{new Date(c.created_at).toLocaleString()}</p>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-stone-700">{c.message}</p>
            </article>
          ))}
        </section>
      ) : null}

      {tab === 'content' ? (
        <section className="mt-8 space-y-6 rounded-3xl border border-stone-100 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-stone-900">Site copy</h2>
            <Button type="button" onClick={saveContents}>
              Save changes
            </Button>
          </div>
          <div className="space-y-6">
            {contents.map((row) => (
              <label key={row.key} className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">{row.key}</span>
                <textarea
                  rows={row.key.includes('json') ? 8 : 4}
                  value={row.value ?? ''}
                  onChange={(e) => updateDraft(row.key, e.target.value)}
                  className="input font-mono text-xs md:text-sm"
                />
              </label>
            ))}
          </div>
        </section>
      ) : null}

      {tab === 'volunteers' ? (
        <section className="mt-8 overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-stone-100 text-sm">
            <thead className="bg-stone-50 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3">Volunteer</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Requested</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {volunteerRequests.map((v) => (
                <tr key={`${v.event_id}-${v.user_id}`}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-stone-900">{v.user_name}</p>
                    <p className="text-xs text-stone-500">{v.user_email}</p>
                  </td>
                  <td className="px-4 py-3 text-stone-700">{v.event_title}</td>
                  <td className="px-4 py-3 text-stone-600">{new Date(v.requested_at).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      v.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-700'
                        : v.status === 'rejected'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Button type="button" className="text-xs" onClick={() => updateVolunteerStatus(v.event_id, v.user_id, 'approved')}>
                      Accept
                    </Button>
                    <Button type="button" variant="outline" className="text-xs" onClick={() => updateVolunteerStatus(v.event_id, v.user_id, 'rejected')}>
                      Reject
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.85rem;
          border: 1px solid #e7e5e4;
          padding: 0.65rem 0.85rem;
          font-size: 0.92rem;
          outline: none;
        }
        .input:focus {
          border-color: #0f766e;
          box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.15);
        }
      `}</style>
    </div>
  )
}

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-3xl border border-teal-100 bg-teal-50/70 p-6 shadow-inner">
      <p className="text-sm font-semibold text-teal-900">{label}</p>
      <p className="mt-3 text-4xl font-semibold text-teal-800">{value}</p>
      {hint ? <p className="mt-2 text-xs text-teal-900/70">{hint}</p> : null}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-stone-700">{label}</span>
      {children}
    </label>
  )
}
