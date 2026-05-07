import { useState } from 'react'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { updateProfile } from '../services/profileService'

export default function Profile() {
  const { user, loginWithToken, token } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    is_profile_public: !!user?.is_profile_public,
    email_notifications: user?.email_notifications !== false,
  })
  const [notice, setNotice] = useState(null)
  const [saving, setSaving] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setNotice(null)
    setSaving(true)
    try {
      const updated = await updateProfile(form)
      loginWithToken(token, updated)
      setNotice({ type: 'success', text: 'Profile updated successfully.' })
    } catch (err) {
      setNotice({ type: 'error', text: err.response?.data?.message || 'Unable to update profile.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">My Account</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Manage your profile details and privacy settings.</p>

      {notice && (
        <div className="mt-4">
          <Alert type={notice.type}>{notice.text}</Alert>
        </div>
      )}

      <form
        onSubmit={submit}
        className="mt-6 space-y-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8"
      >
        {/* Avatar + name */}
        <div className="flex items-center gap-4">
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.name || 'User'}
              className="h-14 w-14 rounded-full object-cover ring-2 ring-primary-100 dark:ring-primary-800"
            />
          ) : (
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-xl font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
              {(user?.name || 'U').slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-100">{user?.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
          </div>
        </div>

        <Field label="Name">
          <input
            className="input-field"
            value={form.name}
            onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
            required
          />
        </Field>

        <Field label="Email">
          <input
            className="input-field cursor-not-allowed opacity-60"
            value={user?.email || ''}
            disabled
          />
        </Field>

        <Field label="Phone (optional)">
          <input
            className="input-field"
            value={form.phone}
            onChange={(e) => setForm((v) => ({ ...v, phone: e.target.value }))}
            placeholder="+855 xx xxx xxx"
          />
        </Field>

        <Field label="Address (optional)">
          <input
            className="input-field"
            value={form.address}
            onChange={(e) => setForm((v) => ({ ...v, address: e.target.value }))}
            placeholder="City, Country"
          />
        </Field>

        <div className="space-y-3 pt-2">
          <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={form.is_profile_public}
              onChange={(e) => setForm((v) => ({ ...v, is_profile_public: e.target.checked }))}
              className="h-4 w-4 rounded border-slate-300 accent-primary-600"
            />
            Show my profile publicly
          </label>
          <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={form.email_notifications}
              onChange={(e) => setForm((v) => ({ ...v, email_notifications: e.target.checked }))}
              className="h-4 w-4 rounded border-slate-300 accent-primary-600"
            />
            Receive email notifications
          </label>
        </div>

        <Button type="submit" disabled={saving} isLoading={saving}>
          {saving ? 'Saving…' : 'Save settings'}
        </Button>
      </form>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
      {children}
    </label>
  )
}
