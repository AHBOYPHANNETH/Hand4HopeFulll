import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Calendar, MapPin, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import {
  PageHeader,
  EmptyState,
  ConfirmDialog,
  SkeletonRow,
  SearchInput,
} from '../../components/admin/shared'
import {
  adminFetchEvents,
  adminCreateEvent,
  adminUpdateEvent,
  adminDeleteEvent,
} from '../../services/eventService'

const EMPTY_FORM = { title: '', description: '', location: '', starts_at: '', image: null }

export default function EventsAdmin() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState(null)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  async function load() {
    setLoading(true)
    try {
      setEvents(await adminFetchEvents())
    } catch (e) {
      setNotice({ type: 'error', text: e.response?.data?.message || 'Failed to load events.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function openCreate() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  function openEdit(ev) {
    setEditingId(ev.id)
    setForm({
      title: ev.title,
      description: ev.description || '',
      location: ev.location,
      starts_at: ev.starts_at.slice(0, 16),
      image: null,
    })
    setModalOpen(true)
  }

  async function submit(e) {
    e.preventDefault()
    setSubmitting(true)
    setNotice(null)
    const fd = new FormData()
    fd.append('title', form.title)
    fd.append('description', form.description)
    fd.append('location', form.location)
    fd.append('starts_at', new Date(form.starts_at).toISOString())
    if (form.image) fd.append('image', form.image)
    try {
      if (editingId) {
        await adminUpdateEvent(editingId, fd)
        setNotice({ type: 'success', text: 'Event updated successfully.' })
      } else {
        await adminCreateEvent(fd)
        setNotice({ type: 'success', text: 'Event published successfully.' })
      }
      setModalOpen(false)
      await load()
    } catch (err) {
      const errs = err.response?.data?.errors
      const msg = errs ? Object.values(errs).flat().join(' ') : err.response?.data?.message
      setNotice({ type: 'error', text: msg || 'Unable to save event.' })
    } finally {
      setSubmitting(false)
    }
  }

  async function confirmDelete() {
    if (!confirmId) return
    setNotice(null)
    try {
      await adminDeleteEvent(confirmId)
      setNotice({ type: 'success', text: 'Event deleted.' })
      setConfirmId(null)
      await load()
    } catch {
      setNotice({ type: 'error', text: 'Unable to delete event.' })
    }
  }

  const filtered = events.filter(
    (ev) =>
      !search ||
      ev.title.toLowerCase().includes(search.toLowerCase()) ||
      ev.location?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <PageHeader
        title="Events"
        description="Create, edit, and publish community events."
        actions={
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4" /> New event
          </Button>
        }
      />

      {notice && (
        <div className="mb-4">
          <Alert type={notice.type}>{notice.text}</Alert>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search events…" />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {loading ? '—' : `${filtered.length} ${filtered.length === 1 ? 'event' : 'events'}`}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm dark:divide-slate-800">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3.5">Event</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Location</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={4} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8">
                    <EmptyState
                      icon={Calendar}
                      title={search ? 'No matching events' : 'No events yet'}
                      description={
                        search
                          ? 'Try a different keyword or clear the search.'
                          : 'Get started by creating your first event.'
                      }
                      action={
                        !search && (
                          <Button size="sm" onClick={openCreate}>
                            <Plus className="h-4 w-4" /> Create event
                          </Button>
                        )
                      }
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((ev) => (
                  <tr
                    key={ev.id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{ev.title}</p>
                      {ev.description && (
                        <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                          {ev.description}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {new Date(ev.starts_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {ev.location}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEdit(ev)}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmId(ev.id)}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/30"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EventModal
        open={modalOpen}
        editing={!!editingId}
        form={form}
        setForm={setForm}
        submitting={submitting}
        onCancel={() => setModalOpen(false)}
        onSubmit={submit}
      />

      <ConfirmDialog
        open={confirmId !== null}
        title="Delete this event?"
        description="This will remove the event and all related volunteer requests. This action cannot be undone."
        confirmLabel="Delete event"
        onCancel={() => setConfirmId(null)}
        onConfirm={confirmDelete}
      />
    </>
  )
}

function EventModal({ open, editing, form, setForm, submitting, onCancel, onSubmit }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onClick={onCancel}
          role="dialog"
          aria-modal="true"
        >
          <motion.form
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            onSubmit={onSubmit}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 sm:p-8"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editing ? 'Edit event' : 'Create new event'}
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Fill in the details below to {editing ? 'update' : 'publish'} this event.
                </p>
              </div>
              <button
                type="button"
                onClick={onCancel}
                aria-label="Close"
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <Field label="Title" required>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="input-field"
                  placeholder="Community gathering"
                />
              </Field>
              <Field label="Location" required>
                <input
                  required
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  className="input-field"
                  placeholder="Phnom Penh, Cambodia"
                />
              </Field>
              <Field label="Date & time" required>
                <input
                  type="datetime-local"
                  required
                  value={form.starts_at}
                  onChange={(e) => setForm((f) => ({ ...f, starts_at: e.target.value }))}
                  className="input-field"
                />
              </Field>
              <Field label="Description">
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="textarea-field"
                  placeholder="Tell volunteers what to expect…"
                />
              </Field>
              <Field label="Banner image">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, image: e.target.files?.[0] || null }))
                  }
                  className="block w-full text-sm text-slate-600 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-primary-700 hover:file:bg-primary-100 dark:text-slate-400 dark:file:bg-primary-900/40 dark:file:text-primary-300"
                />
              </Field>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" size="sm" isLoading={submitting} disabled={submitting}>
                {editing ? 'Save changes' : 'Publish event'}
              </Button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Field({ label, required, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
        {required && <span className="text-rose-500">*</span>}
      </span>
      {children}
    </label>
  )
}
