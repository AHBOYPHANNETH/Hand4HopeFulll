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
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Calendar</p>
        <h1 className="text-4xl font-semibold text-white-900">Volunteer events we&apos;ve got coming up</h1>
        <p className="text-lg text-white-600">
          Pick one. After you log in you can RSVP and we&apos;ll send the meeting spot a couple of days before.
        </p>
      </header>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.length === 0 ? (
          <p className="text-stone-600">Nothing on the calendar right now. We&apos;ll post the next one in the Telegram group.</p>
        ) : (
          events.map((ev) => <EventCard key={ev.id} event={ev} />)
        )}
      </div>
    </div>
  )
}
