import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Calendar, MapPin, ArrowLeft, User, Mail, Phone, CalendarDays, Users } from 'lucide-react'
import EventCountdown from '../components/EventCountdown'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import Spinner from '../components/ui/Spinner'
import { useAuth } from '../context/AuthContext'
import { fetchEvent, volunteerForEvent } from '../services/eventService'

function formatLong(iso) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export default function EventVolunteer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated, bootstrapping } = useAuth()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    notes: '',
  })

  useEffect(() => {
    fetchEvent(id)
      .then(setEvent)
      .catch(() => setErr('Event not found.'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (bootstrapping) return
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/${id}/volunteer` }, replace: true })
      return
    }
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }))
    }
  }, [bootstrapping, isAuthenticated, user, id, navigate])

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErr('')
    setMsg(null)
    setSubmitting(true)
    try {
      const data = await volunteerForEvent(id, {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        date_of_birth: form.date_of_birth,
        notes: form.notes.trim() || undefined,
      })
      setMsg(data.message || 'Thank you for volunteering!')
      window.setTimeout(() => navigate('/my-volunteer-requests'), 1400)
    } catch (e) {
      const apiMsg = e.response?.data?.message
      const validation = e.response?.data?.errors
      const firstField = validation && Object.values(validation)[0]?.[0]
      setErr(apiMsg || firstField || 'Unable to submit your application right now.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || bootstrapping) return <Spinner />
  if (!event) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <Alert type="error">{err || 'Missing event.'}</Alert>
        <Link to="/events" className="mt-6 inline-flex text-sm font-semibold text-teal-700">
          ← Back to events
        </Link>
      </div>
    )
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
      <Link
        to={`/events/${id}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to event
      </Link>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr,1.4fr]">
        {/* Event summary card */}
        <aside className="rounded-3xl border border-stone-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
            Volunteering for
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-stone-900">{event.title}</h2>
          <div className="mt-4 space-y-2 text-sm text-stone-600">
            <p className="flex items-start gap-2">
              <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
              <span>{formatLong(event.starts_at)}</span>
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
              <span>{event.location}</span>
            </p>
          </div>
          <div className="mt-5">
            <EventCountdown isoDate={event.starts_at} />
          </div>
          {event.capacity ? (
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-stone-100 bg-stone-50 px-4 py-3 text-sm">
              <span className="flex items-center gap-2 font-semibold text-stone-700">
                <Users className="h-4 w-4 text-teal-700" />
                Spots
              </span>
              <span className="font-bold text-stone-900">
                {event.volunteers_count ?? 0} / {event.capacity}
              </span>
            </div>
          ) : null}
          {event.description && (
            <p className="mt-5 border-t border-stone-100 pt-5 text-sm leading-relaxed text-stone-600">
              {event.description}
            </p>
          )}
        </aside>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-stone-100 bg-white p-6 shadow-sm md:p-8"
        >
          <h1 className="text-2xl font-semibold text-stone-900">Volunteer application</h1>
          <p className="mt-1 text-sm text-stone-500">
            Tell us a little about yourself. Coordinators will review your details and confirm your spot.
          </p>

          {event.is_full && !msg && (
            <div className="mt-5">
              <Alert type="error">
                This event has reached its volunteer capacity. New sign-ups are closed.
              </Alert>
            </div>
          )}
          {err && (
            <div className="mt-5">
              <Alert type="error">{err}</Alert>
            </div>
          )}
          {msg && (
            <div className="mt-5">
              <Alert type="success">{msg}</Alert>
            </div>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" icon={User}>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Jane Doe"
                className={inputClass}
              />
            </Field>
            <Field label="Email" icon={Mail}>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="jane@example.com"
                className={inputClass}
              />
            </Field>
            <Field label="Phone number" icon={Phone}>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="+1 555 123 4567"
                className={inputClass}
              />
            </Field>
            <Field label="Date of birth" icon={CalendarDays}>
              <input
                type="date"
                required
                max={today}
                value={form.date_of_birth}
                onChange={(e) => update('date_of_birth', e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <div className="mt-4">
            <label
              htmlFor="notes"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500"
            >
              Notes for coordinators (optional)
            </label>
            <textarea
              id="notes"
              rows={4}
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="Skills, accessibility needs, or anything else we should know."
              className="w-full rounded-2xl border border-stone-200 px-3 py-2 text-sm outline-none ring-teal-500/30 focus:border-teal-500 focus:ring-4"
            />
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(`/events/${id}`)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={submitting}
              disabled={submitting || event.is_full}
            >
              {event.is_full
                ? 'Event full'
                : submitting
                  ? 'Submitting…'
                  : 'Submit application'}
            </Button>
          </div>

          <p className="mt-4 text-xs text-stone-500">
            By submitting, you confirm the information above is accurate. We will reach out by email
            once a coordinator reviews your request.
          </p>
        </form>
      </div>
    </div>
  )
}

function Field({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-stone-500">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </span>
      {children}
    </label>
  )
}

const inputClass =
  'w-full rounded-2xl border border-stone-200 px-3 py-2.5 text-sm text-stone-900 outline-none ring-teal-500/30 transition focus:border-teal-500 focus:ring-4'
