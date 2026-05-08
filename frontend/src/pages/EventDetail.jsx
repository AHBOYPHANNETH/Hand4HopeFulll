import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Users } from 'lucide-react'
import EventCountdown from '../components/EventCountdown'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import Spinner from '../components/ui/Spinner'
import { useAuth } from '../context/AuthContext'
import { fetchEvent } from '../services/eventService'

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
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    fetchEvent(id)
      .then(setEvent)
      .catch(() => setErr('Event not found.'))
      .finally(() => setLoading(false))
  }, [id])

  function handleVolunteerClick() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/${id}/volunteer` } })
      return
    }
    navigate(`/events/${id}/volunteer`)
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
            <CapacityBlock event={event} />
            <Button
              className="w-full py-3"
              disabled={event.is_full}
              onClick={handleVolunteerClick}
            >
              {event.is_full
                ? 'Volunteer spots full'
                : isAuthenticated
                  ? 'Join as volunteer'
                  : 'Sign in to volunteer'}
            </Button>
            {!isAuthenticated && !event.is_full ? (
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

function CapacityBlock({ event }) {
  const taken = event.volunteers_count ?? 0
  const cap = event.capacity ?? null
  const isFull = !!event.is_full

  if (!cap) {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-stone-100 bg-stone-50 px-4 py-3 text-sm">
        <span className="flex items-center gap-2 font-semibold text-stone-700">
          <Users className="h-4 w-4 text-teal-700" />
          Volunteers joined
        </span>
        <span className="text-base font-bold text-stone-900">{taken}</span>
      </div>
    )
  }

  const remaining = Math.max(cap - taken, 0)
  const pct = Math.min(100, Math.round((taken / cap) * 100))

  return (
    <div
      className={`rounded-2xl border px-4 py-3 ${
        isFull
          ? 'border-rose-200 bg-rose-50'
          : remaining <= Math.max(1, Math.round(cap * 0.2))
            ? 'border-amber-200 bg-amber-50'
            : 'border-stone-100 bg-stone-50'
      }`}
    >
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 font-semibold text-stone-700">
          <Users className="h-4 w-4 text-teal-700" />
          Volunteer spots
        </span>
        <span className="text-sm font-bold text-stone-900">
          {taken} / {cap}
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
        <div
          className={`h-full rounded-full transition-[width] duration-500 ${
            isFull
              ? 'bg-rose-500'
              : remaining <= Math.max(1, Math.round(cap * 0.2))
                ? 'bg-amber-500'
                : 'bg-teal-600'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p
        className={`mt-2 text-xs font-medium ${
          isFull ? 'text-rose-700' : 'text-stone-600'
        }`}
      >
        {isFull
          ? 'This event is full. Sign-ups are closed.'
          : remaining === 1
            ? 'Only 1 spot left!'
            : `${remaining} spots remaining`}
      </p>
    </div>
  )
}
