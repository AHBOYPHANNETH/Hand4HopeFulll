import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, ShieldCheck, Eye, EyeOff, ArrowRight, UserPlus, Check, X } from 'lucide-react'
import { register } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'
import Alert from '../ui/Alert'

function scorePassword(pw) {
  if (!pw) return 0
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return Math.min(score, 4)
}

const STRENGTH = [
  { label: 'Too weak', color: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400' },
  { label: 'Weak', color: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400' },
  { label: 'Fair', color: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
  { label: 'Good', color: 'bg-lime-500', text: 'text-lime-600 dark:text-lime-400' },
  { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
]

export default function RegisterForm() {
  const navigate = useNavigate()
  const { loginWithToken } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const strength = useMemo(() => scorePassword(password), [password])
  const strengthMeta = STRENGTH[strength]
  const matches = passwordConfirmation.length > 0 && password === passwordConfirmation

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      })
      loginWithToken(data.token, data.user)
      navigate('/')
    } catch (err) {
      const errs = err.response?.data?.errors
      const msg = errs && Object.values(errs).flat().join(' ')
      setError(msg || err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md space-y-6 rounded-3xl border border-white/60 bg-white/90 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/80 md:p-10"
    >
      <div className="space-y-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-500 shadow-lg"
        >
          <UserPlus className="h-7 w-7 text-white" />
        </motion.div>
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-slate-100">
          Join Hand4Hope
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Create your account in under a minute.
        </p>
      </div>

      {error ? <Alert type="error">{error}</Alert> : null}

      <div className="space-y-5">
        <Field
          id="name"
          label="Full name"
          icon={User}
          placeholder="Jane Doe"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Field
          id="email"
          label="Email"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div>
          <Field
            id="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            icon={Lock}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-slate-400 transition-colors hover:text-primary-600 dark:hover:text-primary-400"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            }
          />
          {password ? (
            <div className="mt-2 space-y-1.5">
              <div className="flex gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      i < strength ? strengthMeta.color : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>
              <p className={`text-xs font-medium ${strengthMeta.text}`}>
                {strengthMeta.label}
              </p>
            </div>
          ) : null}
        </div>

        <div>
          <Field
            id="password_confirmation"
            label="Confirm password"
            type={showConfirm ? 'text' : 'password'}
            icon={ShieldCheck}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            trailing={
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="text-slate-400 transition-colors hover:text-primary-600 dark:hover:text-primary-400"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            }
          />
          {passwordConfirmation ? (
            <p
              className={`mt-2 inline-flex items-center gap-1.5 text-xs font-medium ${
                matches
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-orange-600 dark:text-orange-400'
              }`}
            >
              {matches ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
              {matches ? 'Passwords match' : "Passwords don't match"}
            </p>
          ) : null}
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-secondary-600 py-3.5 font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Creating account…
          </>
        ) : (
          <>
            Create account
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </motion.button>

      <p className="text-center text-xs text-slate-500 dark:text-slate-400">
        By creating an account, you agree to our community guidelines and code of conduct.
      </p>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        Already registered?{' '}
        <Link
          to="/login"
          className="font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          Sign in
        </Link>
      </p>
    </motion.form>
  )
}

function Field({ id, label, icon: Icon, trailing, ...props }) {
  return (
    <div className="space-y-2">
      <label
        className="text-sm font-medium text-slate-700 dark:text-slate-300"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="group relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400" />
        <input
          id={id}
          required
          {...props}
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-11 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        {trailing ? (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{trailing}</div>
        ) : null}
      </div>
    </div>
  )
}
