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
      <h1 className="text-3xl font-semibold text-stone-900">My Account</h1>
      <p className="mt-2 text-sm text-stone-600">Manage your profile details and privacy settings.</p>
      {notice ? <div className="mt-4"><Alert type={notice.type}>{notice.text}</Alert></div> : null}

      <form onSubmit={submit} className="mt-6 space-y-4 rounded-3xl border border-stone-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt={user.name || 'User'} className="h-14 w-14 rounded-full object-cover" />
          ) : (
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-xl font-semibold text-teal-700">
              {(user?.name || 'U').slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-stone-800">{user?.name}</p>
            <p className="text-xs text-stone-500">{user?.email}</p>
          </div>
        </div>

        <Field label="Name">
          <input className="input" value={form.name} onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))} required />
        </Field>
        <Field label="Email">
          <input className="input bg-stone-50" value={user?.email || ''} disabled />
        </Field>
        <Field label="Phone (optional)">
          <input className="input" value={form.phone} onChange={(e) => setForm((v) => ({ ...v, phone: e.target.value }))} />
        </Field>
        <Field label="Address (optional)">
          <input className="input" value={form.address} onChange={(e) => setForm((v) => ({ ...v, address: e.target.value }))} />
        </Field>

        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={form.is_profile_public}
            onChange={(e) => setForm((v) => ({ ...v, is_profile_public: e.target.checked }))}
          />
          Show my profile publicly
        </label>
        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={form.email_notifications}
            onChange={(e) => setForm((v) => ({ ...v, email_notifications: e.target.checked }))}
          />
          Receive email notifications
        </label>

        <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save settings'}</Button>
      </form>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.85rem;
          border: 1px solid #e7e5e4;
          padding: 0.65rem 0.85rem;
          font-size: 0.92rem;
          outline: none;
        }
        .input:focus {
          border-color: #0f766e;
          box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.15);
        }
      `}</style>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-stone-700">{label}</span>
      {children}
    </label>
  )
}
