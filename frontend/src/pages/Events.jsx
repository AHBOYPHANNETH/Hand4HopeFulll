import { useEffect, useState } from 'react'
import EventCard from '../components/EventCard'
import Spinner from '../components/ui/Spinner'
import { fetchEvents } from '../services/eventService'

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
      <header className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Events</p>
        <h1 className="text-4xl font-semibold text-stone-900">Gatherings that welcome everyone</h1>
        <p className="text-lg text-stone-600">
          Browse orientation sessions, inclusive activities, and advocacy clinics. Volunteers can RSVP after signing in.
        </p>
      </header>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.length === 0 ? (
          <p className="text-stone-600">Events will appear here soon.</p>
        ) : (
          events.map((ev) => <EventCard key={ev.id} event={ev} />)
        )}
      </div>
    </div>
  )
}
