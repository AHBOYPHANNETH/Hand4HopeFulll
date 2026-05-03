import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'
import Button from '../ui/Button'
import Alert from '../ui/Alert'

export default function LoginForm() {
  const navigate = useNavigate()
  const { loginWithToken } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-5 rounded-3xl border border-stone-100 bg-white p-8 shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Welcome back</h1>
        <p className="mt-1 text-sm text-stone-600">Sign in to volunteer for events and track impact.</p>
      </div>

      {error ? <Alert type="error">{error}</Alert> : null}

      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-700" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none ring-teal-500/30 focus:border-teal-500 focus:ring-4"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-700" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none ring-teal-500/30 focus:border-teal-500 focus:ring-4"
        />
      </div>

      <Button type="submit" className="w-full py-3" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign in'}
      </Button>

      <p className="text-center text-sm text-stone-600">
        No account yet?{' '}
        <Link to="/register" className="font-semibold text-teal-700 hover:text-teal-900">
          Create one
        </Link>
      </p>
    </form>
  )
}
