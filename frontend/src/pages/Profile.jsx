import { useRef, useState } from 'react'
import { Camera, Loader2, Trash2 } from 'lucide-react'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import {
  removeAvatar as removeAvatarApi,
  updateProfile,
  uploadAvatar,
} from '../services/profileService'

const MAX_AVATAR_BYTES = 2 * 1024 * 1024 // 2 MB

export default function Profile() {
  const { user, loginWithToken, token } = useAuth()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    is_profile_public: !!user?.is_profile_public,
    email_notifications: user?.email_notifications !== false,
  })
  const [notice, setNotice] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

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

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset input so the same file can be re-selected
    e.target.value = ''

    if (!file.type.startsWith('image/')) {
      setNotice({ type: 'error', text: 'Please select an image file.' })
      return
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setNotice({ type: 'error', text: 'Image must be 2 MB or less.' })
      return
    }

    setNotice(null)
    setUploading(true)
    try {
      const updated = await uploadAvatar(file)
      loginWithToken(token, updated)
      setNotice({ type: 'success', text: 'Profile photo updated.' })
    } catch (err) {
      const errs = err.response?.data?.errors
      const msg = errs ? Object.values(errs).flat().join(' ') : err.response?.data?.message
      setNotice({ type: 'error', text: msg || 'Unable to upload photo.' })
    } finally {
      setUploading(false)
    }
  }

  async function handleRemoveAvatar() {
    if (!user?.avatar_url) return
    setNotice(null)
    setUploading(true)
    try {
      const updated = await removeAvatarApi()
      loginWithToken(token, updated)
      setNotice({ type: 'success', text: 'Profile photo removed.' })
    } catch {
      setNotice({ type: 'error', text: 'Unable to remove photo.' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">My Account</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Manage your profile details and privacy settings.
      </p>

      {notice && (
        <div className="mt-4">
          <Alert type={notice.type}>{notice.text}</Alert>
        </div>
      )}

      <form
        onSubmit={submit}
        className="mt-6 space-y-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8"
      >
        {/* Avatar uploader */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            aria-label="Change profile photo"
            className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-2 ring-primary-100 transition-all hover:ring-primary-300 focus:outline-none focus:ring-4 focus:ring-primary-200 disabled:cursor-not-allowed dark:ring-primary-800 dark:hover:ring-primary-600 dark:focus:ring-primary-700/40"
          >
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.name || 'User'}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary-100 text-2xl font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                {(user?.name || 'U').slice(0, 1).toUpperCase()}
              </div>
            )}
            {/* Hover overlay */}
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center bg-slate-900/55 opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100"
            >
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              ) : (
                <Camera className="h-6 w-6 text-white" />
              )}
            </span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="min-w-0">
            <p className="font-semibold text-slate-800 dark:text-slate-100">{user?.name}</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>

            <div className="mt-2.5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-100 disabled:opacity-50 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50"
              >
                <Camera className="h-3.5 w-3.5" />
                {user?.avatar_url ? 'Change photo' : 'Upload photo'}
              </button>

              {user?.avatar_url && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={uploading}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-orange-600 transition-colors hover:bg-orange-50 disabled:opacity-50 dark:text-orange-400 dark:hover:bg-orange-900/30"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              )}
            </div>

            <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">
              JPG, PNG, GIF or WEBP — max 2 MB
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-5 dark:border-slate-700">
          <Field label="Name">
            <input
              className="input-field"
              value={form.name}
              onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
              required
            />
          </Field>
        </div>

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
