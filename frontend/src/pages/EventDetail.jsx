import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
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

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [event, setEvent] = useState(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    fetchEvent(id)
      .then(setEvent)
      .catch(() => setErr('Event not found.'))
      .finally(() => setLoading(false))
  }, [id])

  async function joinVolunteer() {
    setErr('')
    setMsg(null)
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/${id}` } })
      return
    }
    setSubmitting(true)
    try {
      const data = await volunteerForEvent(id, notes || undefined)
      setMsg(data.message)
      setNotes('')
    } catch (e) {
      setErr(e.response?.data?.message || 'Unable to register right now.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Spinner />
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

  const img =
    event.image_url ||
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1400&q=70'

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 md:py-16">
      <Link to="/events" className="text-sm font-semibold text-teal-700 hover:text-teal-900">
        ← All events
      </Link>

      <div className="mt-6 overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-sm">
        <div className="aspect-[21/9] w-full overflow-hidden">
          <img src={img} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="grid gap-8 p-8 md:grid-cols-[2fr,1fr] md:items-start">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">{formatLong(event.starts_at)}</p>
            <h1 className="text-4xl font-semibold text-stone-900">{event.title}</h1>
            <p className="text-lg font-medium text-teal-800">{event.location}</p>
            <p className="leading-relaxed text-stone-700">{event.description}</p>
          </div>
          <div className="space-y-5">
            <EventCountdown isoDate={event.starts_at} />
            {msg ? <Alert type="success">{msg}</Alert> : null}
            {err ? <Alert type="error">{err}</Alert> : null}
            <label className="block text-xs font-semibold uppercase tracking-wide text-stone-500" htmlFor="notes">
              Notes for coordinators (optional)
            </label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-2xl border border-stone-200 px-3 py-2 text-sm outline-none ring-teal-500/30 focus:border-teal-500 focus:ring-4"
              placeholder="Tell us about your skills or accessibility needs."
            />
            <Button className="w-full py-3" disabled={submitting} onClick={joinVolunteer}>
              {isAuthenticated ? (submitting ? 'Sending…' : 'Join as volunteer') : 'Sign in to volunteer'}
            </Button>
            {!isAuthenticated ? (
              <p className="text-center text-xs text-stone-500">
                Need an account?{' '}
                <Link className="font-semibold text-teal-700" to="/register">
                  Register
                </Link>{' '}
                or use Google sign-in from the navbar.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}
