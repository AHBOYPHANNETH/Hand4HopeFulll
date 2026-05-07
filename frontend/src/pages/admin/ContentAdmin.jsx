import { useEffect, useState } from 'react'
import { Save, FileText } from 'lucide-react'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import { PageHeader, EmptyState } from '../../components/admin/shared'
import { adminFetchContents, adminUpsertContents } from '../../services/contentService'

export default function ContentAdmin() {
  const [contents, setContents] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState(null)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    adminFetchContents()
      .then((c) => setContents(c || []))
      .catch(() => setContents([]))
      .finally(() => setLoading(false))
  }, [])

  function updateDraft(key, value) {
    setDirty(true)
    setContents((rows) => rows.map((r) => (r.key === key ? { ...r, value } : r)))
  }

  async function save() {
    setSaving(true)
    setNotice(null)
    try {
      const payload = contents.map((c) => ({ key: c.key, value: c.value ?? '' }))
      setContents(await adminUpsertContents(payload))
      setNotice({ type: 'success', text: 'Website content saved successfully.' })
      setDirty(false)
    } catch {
      setNotice({ type: 'error', text: 'Unable to save content.' })
    } finally {
      setSaving(false)
    }
  }

  function humanize(key) {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
  }

  return (
    <>
      <PageHeader
        title="Website content"
        description="Update copy that appears on the public website."
        actions={
          <Button size="sm" onClick={save} isLoading={saving} disabled={saving || !dirty}>
            <Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save changes'}
          </Button>
        }
      />

      {dirty && !notice && (
        <div className="mb-4">
          <Alert type="warning">You have unsaved changes.</Alert>
        </div>
      )}

      {notice && (
        <div className="mb-4">
          <Alert type={notice.type}>{notice.text}</Alert>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="h-3 w-32 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="mt-4 h-20 rounded bg-slate-100 dark:bg-slate-800/60" />
            </div>
          ))}
        </div>
      ) : contents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No content keys"
          description="Site copy keys will appear here once they're set up."
        />
      ) : (
        <div className="space-y-4">
          {contents.map((row) => {
            const isJson = row.key.includes('json')
            const isLong = row.key.includes('mission') || row.key.includes('description') || isJson
            return (
              <div
                key={row.key}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
              >
                <label className="block">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {humanize(row.key)}
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      {row.key}
                    </span>
                  </div>
                  <textarea
                    rows={isLong ? 6 : 3}
                    value={row.value ?? ''}
                    onChange={(e) => updateDraft(row.key, e.target.value)}
                    className={`textarea-field ${isJson ? 'font-mono text-xs' : ''}`}
                  />
                </label>
              </div>
            )
          })}
        </div>
      )}

      {/* Floating save bar when dirty */}
      {dirty && contents.length > 0 && (
        <div className="sticky bottom-4 mt-6 flex justify-end">
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/95 px-4 py-2 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
            <p className="text-xs text-slate-600 dark:text-slate-400">Unsaved changes</p>
            <Button size="sm" onClick={save} isLoading={saving} disabled={saving}>
              <Save className="h-4 w-4" /> Save
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
