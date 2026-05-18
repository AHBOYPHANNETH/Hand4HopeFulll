import { useEffect, useMemo, useState } from 'react'
import Spinner from '../components/ui/Spinner'
import { fetchPublicContents } from '../services/contentService'

export default function Impact() {
  const [contents, setContents] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPublicContents()
      .then(setContents)
      .finally(() => setLoading(false))
  }, [])

  const testimonials = useMemo(() => {
    try {
      return JSON.parse(contents?.testimonials_json || '[]')
    } catch {
      return []
    }
  }, [contents])

  if (loading) return <Spinner />

  const stats = [
    { label: 'Kids reached this year',  value: contents?.impact_stat_children || '—' },
    { label: 'People who keep showing up', value: contents?.impact_stat_volunteers || '—' },
    { label: 'Hours given by volunteers',  value: contents?.impact_stat_sessions || '—' },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
      <header className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">What we&apos;ve done</p>
        <h1 className="text-4xl font-semibold text-stone-900">A pile of volunteer events adds up</h1>
        <p className="text-lg text-stone-600">
          We don&apos;t love putting things in numbers. But people ask, so here you go. Behind each one is a specific morning, a specific street, and specific people who showed up.
        </p>
      </header>

      <section className="mt-12 grid gap-6 md:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-3xl border border-teal-100 bg-white p-8 text-center shadow-sm">
            <p className="text-4xl font-semibold text-teal-700">{s.value}</p>
            <p className="mt-3 text-sm font-medium text-stone-600">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="mt-16 space-y-8">
        <h2 className="text-2xl font-semibold text-stone-900">A few people who&apos;ve been around a while</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((t, idx) => (
            <figure key={idx} className="rounded-3xl border border-stone-100 bg-stone-50 p-8 shadow-inner">
              <blockquote className="text-lg leading-relaxed text-stone-800">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-teal-800">
                {t.name}
                <span className="font-normal text-stone-600"> · {t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  )
}
