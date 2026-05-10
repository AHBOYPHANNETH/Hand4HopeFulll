import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, LogIn } from 'lucide-react'
import { login } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'
import Alert from '../ui/Alert'

export default function LoginForm() {
  const navigate = useNavigate()
  const { loginWithToken } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login({ email, password })
      loginWithToken(data.token, data.user)
      navigate(data.user.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.email?.[0]
      setError(msg || 'Unable to sign in. Please try again.')
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
          className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary-500 to-secondary-500 shadow-lg"
        >
          <LogIn className="h-7 w-7 text-white" />
        </motion.div>
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-slate-100">
          Welcome back
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Sign in to volunteer for events and track your impact.
        </p>
      </div>

      {error ? <Alert type="error">{error}</Alert> : null}

      <div className="space-y-5">
        <Field
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          icon={Mail}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Field
          id="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          icon={Lock}
          placeholder="••••••••"
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
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary-600 to-secondary-600 py-3.5 font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Signing in…
          </>
        ) : (
          <>
            Sign in
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </motion.button>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        No account yet?{' '}
        <Link
          to="/register"
          className="font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          Create one
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
