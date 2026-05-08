import { useState } from 'react'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import { submitDonation } from '../services/donationService'

export default function Donate() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    amount: '',
    currency: 'USD',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    setFeedback(null)
    setLoading(true)
    try {
      const data = await submitDonation({
        ...form,
        amount: Number(form.amount),
      })
      setFeedback({ type: 'success', text: data.message })
      setForm({ name: '', email: '', amount: '', currency: 'USD', message: '' })
    } catch (err) {
      const errs = err.response?.data?.errors
      const msg = errs ? Object.values(errs).flat().join(' ') : err.response?.data?.message
      setFeedback({ type: 'error', text: msg || 'Something went wrong.' })
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
      <div className="space-y-6">
        <h1 className="text-sm font-semibold uppercase tracking-wide text-white">Donate</h1>
        <h1 className="text-4xl font-semibold text-stone-900 dark:text-white">Fuel dignity-centered programs</h1>
        <p className="leading-relaxed text-stone-600 dark:text-white">
          Contributions fund nutritious meals, adapted learning materials, staff training, and family advocacy clinics.
          Hand4Hope issues acknowledgment receipts for organizational donors upon request.
        </p>
        <div className="rounded-3xl border border-teal-100 bg-teal-50 p-6 text-sm text-teal-900">
          Prefer offline giving? Email{' '}
          <span className="font-semibold">giving@hand4hope.example</span> for bank transfer instructions (placeholder).
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5 rounded-3xl border border-stone-100 bg-white p-8 shadow-sm">
        {feedback ? <Alert type={feedback.type}>{feedback.text}</Alert> : null}

        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-700 dark:text-black" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 outline-none ring-teal-500/30 focus:border-teal-500 focus:ring-4"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-700 dark:text-black" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 outline-none ring-teal-500/30 focus:border-teal-500 focus:ring-4"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700 dark:text-black" htmlFor="amount">
              Amount
            </label>
            <input
              id="amount"
              type="number"
              min="1"
              step="0.01"
              required
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 outline-none ring-teal-500/30 focus:border-teal-500 focus:ring-4"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700 dark:text-black" htmlFor="currency">
              Currency
            </label>
            <select
              id="currency"
              value={form.currency}
              onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 outline-none ring-teal-500/30 focus:border-teal-500 focus:ring-4"
            >
              <option value="USD">USD</option>
              <option value="KHR">KHR</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-700 dark:text-black" htmlFor="message">
            Message (optional)
          </label>
          <textarea
            id="message"
            rows={4}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 outline-none ring-teal-500/30 focus:border-teal-500 focus:ring-4"
          />
        </div>

        <Button type="submit" className="w-full py-3" disabled={loading}>
          {loading ? 'Submitting…' : 'Submit donation'}
        </Button>
      </form>
    </div>
  )
}
