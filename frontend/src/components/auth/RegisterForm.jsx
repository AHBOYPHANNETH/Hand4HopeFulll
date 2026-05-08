import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'
import Button from '../ui/Button'
import Alert from '../ui/Alert'

export default function RegisterForm() {
  const navigate = useNavigate()
  const { loginWithToken } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
      const msg =
        errs &&
        Object.values(errs)
          .flat()
          .join(' ')
      setError(msg || err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-5 rounded-3xl border border-stone-100 bg-white p-8 shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-black">Join Hand4Hope</h1>
        <p className="mt-1 text-sm text-stone-600 dark:text-black">Create an account to RSVP as a volunteer.</p>
      </div>

      {error ? <Alert type="error">{error}</Alert> : null}

      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-700 dark:text-black" htmlFor="name">
          Full name
        </label>
        <input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 outline-none ring-teal-500/30 focus:border-teal-500 focus:ring-4"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-700 dark:text-black" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 outline-none ring-teal-500/30 focus:border-teal-500 focus:ring-4"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-700 dark:text-black" htmlFor="password_confirmation">
          Confirm password
        </label>
        <input
          id="password_confirmation"
          type="password"
          autoComplete="new-password"
          required
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 outline-none ring-teal-500/30 focus:border-teal-500 focus:ring-4"
        />
      </div>

      <Button type="submit" className="w-full py-3" disabled={loading}>
        {loading ? 'Creating account…' : 'Create account'}
      </Button>

      <p className="text-center text-sm text-stone-600 dark:text-black">
        Already registered?{' '}
        <Link to="/login" className="font-semibold text-teal-700 hover:text-teal-900">
          Sign in
        </Link>
      </p>
    </form>
  )
}
