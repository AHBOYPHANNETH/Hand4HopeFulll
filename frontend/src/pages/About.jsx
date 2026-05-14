import { useEffect, useState } from 'react'
import Spinner from '../components/ui/Spinner'
import { fetchPublicContents } from '../services/contentService'

export default function About() {
  const [contents, setContents] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPublicContents()
      .then(setContents)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-14 md:py-20">
      <header className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">About us</p>
        <h1 className="text-4xl font-semibold text-white-900">Four friends, one street, a lot of Saturdays since.</h1>
        <p className="text-lg leading-relaxed text-white-600">{contents?.about_story}</p>
      </header>

      <section className="grid gap-8 md:grid-cols-2">
        <div className="rounded-3xl border border-teal-100 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-teal-900">Where we want this to go</h2>
          <p className="mt-3 leading-relaxed text-stone-700">{contents?.vision_text}</p>
        </div>
        <div className="rounded-3xl border border-amber-100 bg-amber-50 p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-amber-900">What we actually do</h2>
          <p className="mt-3 leading-relaxed text-stone-800">{contents?.mission_text}</p>
        </div>
      </section>

      <section className="rounded-3xl bg-teal-900 px-8 py-10 text-teal-50">
        <h2 className="text-2xl font-semibold text-white">A few things we try to stick to</h2>
        <ul className="mt-6 space-y-4 text-sm leading-relaxed md:text-base">
          <li>Anyone can come. No quizzes, no training course, no sign-up fee.</li>
          <li>We pick the place by listening to people who live there, not by what looks good on Instagram.</li>
          <li>Before every event, the person running it spends five minutes telling everyone what we&apos;re doing and how to stay safe.</li>
          <li>If we collect money, we post photos of what we bought with it. If we don&apos;t, ask us about it.</li>
        </ul>
      </section>
    </div>
  )
}
