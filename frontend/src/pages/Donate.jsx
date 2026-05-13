import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  Mail,
  User,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Smartphone,
  Copy,
  Check,
  AlertCircle,
} from 'lucide-react'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import {
  initiateKhqrDonation,
  fetchKhqrStatus,
} from '../services/donationService'

const PRESETS = [
  { amount: 5, label: '$5' },
  { amount: 10, label: '$10' },
  { amount: 25, label: '$25' },
  { amount: 50, label: '$50' },
  { amount: 100, label: '$100' },
  { amount: 250, label: '$250' },
]

export default function Donate() {
  const [step, setStep] = useState('form') // 'form' | 'pay' | 'success'
  const [form, setForm] = useState({
    name: '',
    email: '',
    amount: '',
    currency: 'USD',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [session, setSession] = useState(null)

  function pickPreset(value) {
    setForm((f) => ({ ...f, amount: String(value) }))
  }

  async function generate() {
    setError('')
    if (!form.amount || Number(form.amount) <= 0) {
      setError('Please enter an amount greater than zero.')
      return false
    }
    setLoading(true)
    try {
      const data = await initiateKhqrDonation({
        ...form,
        amount: Number(form.amount),
      })
      setSession(data)
      setStep('pay')
      return true
    } catch (err) {
      const errs = err.response?.data?.errors
      const msg = errs ? Object.values(errs).flat().join(' ') : err.response?.data?.message
      setError(msg || 'Could not start your donation. Please try again.')
      return false
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(e) {
    e.preventDefault()
    await generate()
  }

  function reset() {
    setSession(null)
    setStep('form')
    setError('')
    setForm({ name: '', email: '', amount: '', currency: 'USD', message: '' })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-primary-50 via-white to-secondary-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-linear-to-r from-primary-300/30 to-secondary-300/30 blur-3xl"
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-linear-to-r from-accent-300/30 to-primary-300/30 blur-3xl"
          animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 md:py-20 lg:grid-cols-2">
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Support our mission
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight text-slate-900 dark:text-slate-100 md:text-5xl">
            Fund <span className="gradient-text">dignity-centered</span> programs
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Your donation funds nutritious meals, adapted learning materials, staff
            training and family advocacy clinics for children with intellectual
            disabilities in Cambodia.
          </p>

          <div className="rounded-2xl border border-primary-100 bg-white/60 p-5 backdrop-blur dark:border-primary-900/40 dark:bg-slate-800/60">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary-500 to-secondary-500 text-white">
                <Smartphone className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  Pay with KHQR
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Scan the QR with any Bakong-supported app — ABA, ACLEDA, Wing, Bakong,
                  and more.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { n: '$5', l: '1 meal' },
              { n: '$25', l: '1 week of supplies' },
              { n: '$100', l: '1 month of care' },
            ].map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative overflow-hidden rounded-2xl border border-primary-200/70 bg-linear-to-br from-primary-50 via-white to-secondary-50 p-4 text-center shadow-md dark:border-primary-800/50 dark:from-primary-900/40 dark:via-slate-800 dark:to-secondary-900/30"
              >
                <span className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary-300/30 blur-2xl dark:bg-primary-500/20" />
                <p className="relative text-2xl font-bold text-primary-700 dark:text-primary-300">
                  {s.n}
                </p>
                <p className="relative mt-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                  {s.l}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.aside>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/80 md:p-8"
        >
          <AnimatePresence mode="wait">
            {step === 'form' && (
              <DonationForm
                key="form"
                form={form}
                setForm={setForm}
                pickPreset={pickPreset}
                onSubmit={onSubmit}
                loading={loading}
                error={error}
              />
            )}

            {step === 'pay' && session && (
              <KhqrPayment
                key="pay"
                session={session}
                onPaid={() => setStep('success')}
                onCancel={reset}
              />
            )}

            {step === 'success' && session && (
              <SuccessState key="success" session={session} onDoneClick={reset} />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

function DonationForm({ form, setForm, pickPreset, onSubmit, loading, error }) {
  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-5"
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-primary-500 to-secondary-500 shadow-lg">
          <Heart className="h-6 w-6 text-white" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-100">
            Make a donation
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Choose an amount and we'll generate a KHQR for you.
          </p>
        </div>
      </div>

      {error ? <Alert type="error">{error}</Alert> : null}

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Quick amounts
        </p>
        <div className="grid grid-cols-3 gap-2">
          {PRESETS.map((p) => {
            const active = String(p.amount) === form.amount
            return (
              <button
                key={p.amount}
                type="button"
                onClick={() => pickPreset(p.amount)}
                className={`rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition-all ${
                  active
                    ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'border-slate-200 text-slate-700 hover:border-primary-300 dark:border-slate-700 dark:text-slate-200 dark:hover:border-primary-500'
                }`}
              >
                {p.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
        <Field
          id="amount"
          label="Custom amount"
          type="number"
          step="0.01"
          min="1"
          required
          value={form.amount}
          onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
          placeholder="0.00"
        />
        <div className="space-y-2">
          <label htmlFor="currency" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Currency
          </label>
          <select
            id="currency"
            value={form.currency}
            onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 px-3 text-sm text-slate-900 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="USD">USD</option>
            <option value="KHR">KHR</option>
          </select>
        </div>
      </div>

      <Field
        id="name"
        label="Your name"
        icon={User}
        required
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        placeholder="Jane Doe"
      />

      <Field
        id="email"
        label="Email"
        type="email"
        icon={Mail}
        required
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        placeholder="you@example.com"
      />

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Message (optional)
        </label>
        <div className="group relative">
          <MessageSquare className="pointer-events-none absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400" />
          <textarea
            id="message"
            rows={3}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
            placeholder="A few words for our team…"
          />
        </div>
      </div>

      <Button type="submit" className="w-full py-3" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> PAY WITH KHQR…
          </>
        ) : (
          <>
            PAY WITH KHQR <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </motion.form>
  )
}

function Field({ id, label, icon: Icon, ...props }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <div className="group relative">
        {Icon ? (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400" />
        ) : null}
        <input
          id={id}
          {...props}
          className={`w-full rounded-xl border border-slate-200 bg-white py-3 ${Icon ? 'pl-11 pr-3' : 'px-3'} text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500`}
        />
      </div>
    </div>
  )
}

function KhqrPayment({ session, onPaid, onCancel }) {
  const [secondsLeft, setSecondsLeft] = useState(session.expires_in ?? 300)
  const [copied, setCopied] = useState(false)
  const stoppedRef = useRef(false)

  // ecc=M keeps the QR readable for dense KHQR payloads; ecc=H pushes
  // the symbol to a higher version and some bank scanners (ACLEDA, Wing)
  // fail to lock on. margin=4 is the EMVCo quiet-zone minimum.
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=640x640&margin=4&ecc=M&data=${encodeURIComponent(
    session.qr,
  )}`

  // Reset the countdown whenever a fresh QR is generated.
  useEffect(() => {
    setSecondsLeft(session.expires_in ?? 300)
  }, [session.donation_id, session.expires_in])

  // Poll the backend
  useEffect(() => {
    stoppedRef.current = false
    let timer
    async function poll() {
      if (stoppedRef.current) return
      try {
        const data = await fetchKhqrStatus(session.donation_id)
        if (data.status === 'paid') {
          stoppedRef.current = true
          onPaid()
          return
        }
      } catch {
        // ignore network blips, keep polling
      }
      if (!stoppedRef.current) timer = setTimeout(poll, 4000)
    }
    poll()
    return () => {
      stoppedRef.current = true
      if (timer) clearTimeout(timer)
    }
  }, [session.donation_id, onPaid])

  // Countdown
  useEffect(() => {
    if (secondsLeft <= 0) {
      stoppedRef.current = true
      return
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [secondsLeft])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = String(secondsLeft % 60).padStart(2, '0')
  const expired = secondsLeft <= 0

  async function copyQr() {
    try {
      await navigator.clipboard.writeText(session.qr)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-5 text-center"
    >
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-100">
          Pay with KHQR
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Scan with any KHQR-supported app, or tap the button below if you're on your phone.
        </p>
      </div>

      <div className="mx-auto inline-block rounded-2xl border-4 border-primary-500 bg-white p-3 shadow-xl">
        <img
          src={qrImageUrl}
          alt="KHQR donation"
          className="block h-72 w-72 object-contain"
        />
      </div>

      <div className="flex items-center justify-center gap-6 text-sm text-slate-600 dark:text-slate-400">
        <span>
          <strong className="text-slate-900 dark:text-slate-100">
            {Number(session.amount).toFixed(2)} {session.currency}
          </strong>
        </span>
        <span aria-hidden="true">•</span>
        <span className={expired ? 'font-semibold text-rose-600' : ''}>
          {expired ? 'Expired' : `Expires in ${minutes}:${seconds}`}
        </span>
      </div>

      <div
        className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm ${
          expired
            ? 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
            : 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
        }`}
      >
        {expired ? (
          <>
            <AlertCircle className="h-4 w-4" /> This QR has expired. Cancel and start a new donation.
          </>
        ) : (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Waiting for payment…
          </>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={copyQr}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied' : 'Copy QR string'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  )
}

function SuccessState({ session, onDoneClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-5 py-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, delay: 0.1 }}
        className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 shadow-lg"
      >
        <CheckCircle2 className="h-12 w-12 text-white" />
      </motion.div>
      <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-slate-100">
        Thank you!
      </h2>
      <p className="text-base text-slate-600 dark:text-slate-300">
        We received your donation of{' '}
        <strong className="text-slate-900 dark:text-slate-100">
          {Number(session.amount).toFixed(2)} {session.currency}
        </strong>
        . A receipt has been emailed to you.
      </p>
      <Button onClick={onDoneClick} className="mx-auto">
        Make another donation <ArrowRight className="h-4 w-4" />
      </Button>
    </motion.div>
  )
}
