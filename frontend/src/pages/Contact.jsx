import { useEffect, useState } from 'react'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import Spinner from '../components/ui/Spinner'
import { submitContact } from '../services/contactService'
import { fetchPublicContents } from '../services/contentService'

export default function Contact() {
  const [contents, setContents] = useState(null)
  const [loadingMeta, setLoadingMeta] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    fetchPublicContents()
      .then(setContents)
      .finally(() => setLoadingMeta(false))
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    setFeedback(null)
    setLoading(true)
    try {
      const data = await submitContact(form)
      setFeedback({ type: 'success', text: data.message })
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      const errs = err.response?.data?.errors
      const msg = errs ? Object.values(errs).flat().join(' ') : err.response?.data?.message
      setFeedback({ type: 'error', text: msg || 'Unable to send message.' })
    } finally {
      setLoading(false)
    }
  }

  const mapSrc =
    'https://www.openstreetmap.org/export/embed.html?bbox=104.8876%2C11.5276%2C104.9656%2C11.5987&layer=mapnik'

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
      <header className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Get in touch</p>
        <h1 className="text-4xl font-semibold text-white-900">Drop us a message</h1>
        <p className="text-lg text-white-600">
          Want to volunteer with us, suggest a street that needs help, or partner on something? Send a note. We usually reply within a couple of days — sometimes faster if it&apos;s about a weekend coming up.
        </p>
      </header>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          {loadingMeta ? (
            <Spinner />
          ) : (
            <div className="rounded-3xl border border-stone-100 bg-white p-8 shadow-sm">
              <h2 className="text-lg font-semibold text-stone-900">Where to find us</h2>
              <p className="mt-3 text-stone-700">{contents?.contact_address}</p>
              <p className="mt-2 text-sm font-medium text-teal-800">{contents?.contact_hours}</p>
            </div>
          )}

          <div className="overflow-hidden rounded-3xl border border-stone-100 shadow-sm">
            <iframe title="Hand4Hope map" src={mapSrc} className="h-72 w-full border-0" loading="lazy" />
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 rounded-3xl border border-stone-100 bg-white p-8 shadow-sm">
          {feedback ? <Alert type={feedback.type}>{feedback.text}</Alert> : null}

          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none ring-teal-500/30 focus:border-teal-500 focus:ring-4"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none ring-teal-500/30 focus:border-teal-500 focus:ring-4"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700" htmlFor="phone">
              Phone (optional)
            </label>
            <input
              id="phone"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none ring-teal-500/30 focus:border-teal-500 focus:ring-4"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              required
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none ring-teal-500/30 focus:border-teal-500 focus:ring-4"
            />
          </div>

          <Button type="submit" className="w-full py-3" disabled={loading}>
            {loading ? 'Sending…' : 'Send message'}
          </Button>
        </form>
      </div>
    </div>
  )
}
