import { useEffect, useMemo, useState } from 'react'
import {
  Users,
  Shield,
  ShieldOff,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Pencil,
  X,
  Save,
} from 'lucide-react'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import {
  PageHeader,
  EmptyState,
  SkeletonRow,
  SearchInput,
  StatCard,
  ConfirmDialog,
} from '../../components/admin/shared'
import { useAuth } from '../../context/AuthContext'
import { fetchUsers, updateUser, deleteUser } from '../../services/adminService'

const ROLE_FILTERS = [
  { id: 'all',   label: 'All' },
  { id: 'admin', label: 'Admins' },
  { id: 'user',  label: 'Users' },
]

export default function UsersAdmin() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [busyId, setBusyId] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const data = await fetchUsers()
      setUsers(data || [])
    } catch (e) {
      setNotice({ type: 'error', text: e.response?.data?.message || 'Failed to load users.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(
    () =>
      users.filter((u) => {
        const okRole = filter === 'all' || u.role === filter
        const term = search.toLowerCase()
        const okSearch =
          !term ||
          u.name?.toLowerCase().includes(term) ||
          u.email?.toLowerCase().includes(term) ||
          u.phone?.toLowerCase().includes(term)
        return okRole && okSearch
      }),
    [users, filter, search]
  )

  const counts = useMemo(
    () => ({
      all: users.length,
      admin: users.filter((u) => u.role === 'admin').length,
      user: users.filter((u) => u.role === 'user').length,
    }),
    [users]
  )

  async function toggleRole(u) {
    if (u.id === currentUser?.id) {
      setNotice({ type: 'error', text: 'You cannot change your own admin role.' })
      return
    }
    setBusyId(u.id)
    setNotice(null)
    try {
      const nextRole = u.role === 'admin' ? 'user' : 'admin'
      const res = await updateUser(u.id, { role: nextRole })
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, ...res.user } : x)))
      setNotice({
        type: 'success',
        text: nextRole === 'admin'
          ? `${u.name} is now an admin.`
          : `${u.name} is now a regular user.`,
      })
    } catch (e) {
      setNotice({ type: 'error', text: e.response?.data?.message || 'Failed to update role.' })
    } finally {
      setBusyId(null)
    }
  }

  async function handleDelete() {
    if (!confirmDelete) return
    setBusyId(confirmDelete.id)
    setNotice(null)
    try {
      await deleteUser(confirmDelete.id)
      setUsers((prev) => prev.filter((u) => u.id !== confirmDelete.id))
      setNotice({ type: 'success', text: `${confirmDelete.name} was deleted.` })
    } catch (e) {
      setNotice({ type: 'error', text: e.response?.data?.message || 'Failed to delete user.' })
    } finally {
      setBusyId(null)
      setConfirmDelete(null)
    }
  }

  async function handleSaveEdit(payload) {
    if (!editing) return
    setBusyId(editing.id)
    setNotice(null)
    try {
      const res = await updateUser(editing.id, payload)
      setUsers((prev) => prev.map((x) => (x.id === editing.id ? { ...x, ...res.user } : x)))
      setNotice({ type: 'success', text: `${res.user.name} was updated.` })
      setEditing(null)
    } catch (e) {
      setNotice({ type: 'error', text: e.response?.data?.message || 'Failed to save changes.' })
    } finally {
      setBusyId(null)
    }
  }

  return (
    <>
      <PageHeader
        title="Users"
        description="Manage everyone who has signed in to Hand4Hope. Promote admins, edit profiles, or remove accounts."
      />

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={Users}
          label="Total users"
          value={loading ? '—' : counts.all}
          hint="Registered accounts"
          iconClass="bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
        />
        <StatCard
          icon={Shield}
          label="Administrators"
          value={loading ? '—' : counts.admin}
          hint="With dashboard access"
          iconClass="bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
        />
        <StatCard
          icon={Users}
          label="Standard users"
          value={loading ? '—' : counts.user}
          hint="Volunteers & supporters"
          iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
        />
      </div>

      {notice && (
        <div className="mb-4">
          <Alert type={notice.type}>{notice.text}</Alert>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {ROLE_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                filter === f.id
                  ? 'bg-primary-600 text-white shadow'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {f.label}
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  filter === f.id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {counts[f.id]}
              </span>
            </button>
          ))}
        </div>
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name, email, or phone…" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm dark:divide-slate-800">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Contact</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Provider</th>
                <th className="px-5 py-3.5">Volunteer</th>
                <th className="px-5 py-3.5">Joined</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={7} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8">
                    <EmptyState
                      icon={Users}
                      title={search || filter !== 'all' ? 'No matching users' : 'No users yet'}
                      description={
                        search || filter !== 'all'
                          ? 'Try a different keyword or change the role filter.'
                          : 'Users who sign in will be listed here.'
                      }
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const isSelf = u.id === currentUser?.id
                  return (
                    <tr
                      key={u.id}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {u.avatar_url ? (
                            <img
                              src={u.avatar_url}
                              alt={u.name}
                              className="h-9 w-9 shrink-0 rounded-full object-cover"
                            />
                          ) : (
                            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-bold text-white">
                              {(u.name || 'U').slice(0, 1).toUpperCase()}
                            </span>
                          )}
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900 dark:text-white">
                              {u.name}
                              {isSelf && (
                                <span className="ml-2 rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-bold uppercase text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                              ID #{u.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-0.5 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1.5 truncate text-slate-700 dark:text-slate-300">
                            <Mail className="h-3 w-3 shrink-0" />
                            {u.email}
                          </span>
                          {u.phone && (
                            <span className="flex items-center gap-1.5 truncate">
                              <Phone className="h-3 w-3 shrink-0" />
                              {u.phone}
                            </span>
                          )}
                          {u.address && (
                            <span className="flex items-center gap-1.5 truncate">
                              <MapPin className="h-3 w-3 shrink-0" />
                              {u.address}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <RoleBadge role={u.role} />
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {u.provider || 'email'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600 dark:text-slate-400">
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {u.volunteer_approved_count ?? 0}
                          </span>{' '}
                          approved
                        </div>
                        <div className="text-slate-400 dark:text-slate-500">
                          {u.volunteer_requests_count ?? 0} total
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400">
                        {u.created_at
                          ? new Date(u.created_at).toLocaleDateString()
                          : '—'}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditing(u)}
                            disabled={busyId === u.id}
                            title="Edit user"
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleRole(u)}
                            disabled={isSelf || busyId === u.id}
                            title={
                              isSelf
                                ? 'You cannot change your own role'
                                : u.role === 'admin'
                                ? 'Demote to user'
                                : 'Promote to admin'
                            }
                            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
                              u.role === 'admin'
                                ? 'text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/30'
                                : 'bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50'
                            }`}
                          >
                            {u.role === 'admin' ? (
                              <>
                                <ShieldOff className="h-3.5 w-3.5" /> Demote
                              </>
                            ) : (
                              <>
                                <Shield className="h-3.5 w-3.5" /> Promote
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDelete(u)}
                            disabled={isSelf || busyId === u.id}
                            title={isSelf ? 'You cannot delete yourself' : 'Delete user'}
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50 dark:text-rose-400 dark:hover:bg-rose-900/30"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete user"
        description={
          confirmDelete
            ? `Are you sure you want to delete ${confirmDelete.name}? This will also remove their volunteer requests and notifications. This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete user"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />

      <EditUserModal
        user={editing}
        onCancel={() => setEditing(null)}
        onSave={handleSaveEdit}
      />
    </>
  )
}

function RoleBadge({ role }) {
  const isAdmin = role === 'admin'
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
        isAdmin
          ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
      }`}
    >
      {isAdmin ? <Shield className="h-3 w-3" /> : <Users className="h-3 w-3" />}
      {role || 'user'}
    </span>
  )
}

function EditUserModal({ user, onCancel, onSave }) {
  const [form, setForm] = useState(null)

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        address: user.address ?? '',
        role: user.role ?? 'user',
        password: '',
        email_notifications: !!user.email_notifications,
      })
    } else {
      setForm(null)
    }
  }, [user])

  if (!user || !form) return null

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      address: form.address || null,
      role: form.role,
      email_notifications: form.email_notifications,
    }
    if (form.password) payload.password = form.password
    onSave(payload)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-slate-900"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Edit user</h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Name">
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Phone">
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Role">
              <select
                value={form.role}
                onChange={(e) => update('role', e.target.value)}
                className={inputClass}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </Field>
          </div>
          <Field label="Address">
            <input
              type="text"
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Reset password (optional)">
            <input
              type="password"
              minLength={8}
              placeholder="Leave blank to keep current password"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              className={inputClass}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={form.email_notifications}
              onChange={(e) => update('email_notifications', e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            Receives email notifications
          </label>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/50">
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            <Save className="mr-1 h-3.5 w-3.5" />
            Save changes
          </Button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
        {label}
      </span>
      {children}
    </label>
  )
}

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-primary-500 dark:focus:ring-primary-900/40'
