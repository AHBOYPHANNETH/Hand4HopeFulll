import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import EventCard from '../components/EventCard'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import { fetchEvents } from '../services/eventService'
import { fetchPublicContents } from '../services/contentService'

export default function Home() {
  const [contents, setContents] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [c, ev] = await Promise.all([
          fetchPublicContents(),
          fetchEvents({ upcoming: true }),
        ])
        if (!cancelled) {
          setContents(c)
          setEvents(ev.slice(0, 3))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const heroTitle = contents?.hero_title || 'Hands of Hope for Every Child'
  const heroSubtitle =
    contents?.hero_subtitle ||
    'Supporting children with intellectual disabilities through daycare, education, and advocacy in Cambodia.'
  const mission = contents?.mission_text || ''

  const preview = useMemo(() => events || [], [events])

  if (loading) return <Spinner />

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-amber-400 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_white,_transparent_55%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 md:flex-row md:items-center md:py-24">
          <div className="flex-1 space-y-6">
            <p className="inline-flex rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-wide">
              Hands of Hope Community
            </p>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">{heroTitle}</h1>
            <p className="max-w-xl text-lg text-teal-50">{heroSubtitle}</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/events">
                <Button className="border-white text-white hover:bg-white/50">Explore events</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Become a volunteer
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 rounded-3xl bg-white/10 p-6 shadow-inner backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-100">Mission snapshot</p>
            <p className="mt-3 text-lg leading-relaxed text-white">{mission}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-semibold text-stone-900">Upcoming gatherings</h2>
            <p className="mt-2 max-w-xl text-stone-600">
              Join orientation sessions, inclusive play days, and family advocacy clinics across Phnom Penh.
            </p>
          </div>
          <Link to="/events" className="text-sm font-semibold text-teal-700 hover:text-teal-900">
            View all events →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {preview.length === 0 ? (
            <p className="text-sm text-stone-600 md:col-span-3">
              New events are being scheduled — check back soon or contact our team.
            </p>
          ) : (
            preview.map((ev) => <EventCard key={ev.id} event={ev} />)
          )}
        </div>
      </section>

      <section className="border-y border-teal-100 bg-teal-50/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-teal-900">Volunteers keep programs joyful</h2>
            <p className="mt-2 max-w-xl text-teal-900/80">
              Help with classrooms, outings, translation, or logistics. We provide safeguarding training for every role.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/register">
              <Button>Create volunteer profile</Button>
            </Link>
            <Link to="/impact">
              <Button variant="outline">See community impact</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
