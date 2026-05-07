import { useEffect, useMemo, useState } from 'react'
import { Mail, Phone, MessageSquare } from 'lucide-react'
import {
  PageHeader,
  EmptyState,
  SearchInput,
} from '../../components/admin/shared'
import { fetchContacts } from '../../services/adminService'

export default function ContactsAdmin() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchContacts()
      .then((c) => setContacts(c || []))
      .catch(() => setContacts([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(
    () =>
      contacts.filter(
        (c) =>
          !search ||
          c.name?.toLowerCase().includes(search.toLowerCase()) ||
          c.email?.toLowerCase().includes(search.toLowerCase()) ||
          c.message?.toLowerCase().includes(search.toLowerCase())
      ),
    [contacts, search]
  )

  return (
    <>
      <PageHeader
        title="Contact messages"
        description="Messages submitted via the public contact form."
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name, email, or message…" />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {loading ? '—' : `${filtered.length} ${filtered.length === 1 ? 'message' : 'messages'}`}
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="h-3 w-32 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="mt-3 h-2 w-44 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="mt-6 space-y-2">
                <div className="h-2 w-full rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-2 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title={search ? 'No matching messages' : 'No messages yet'}
          description={
            search
              ? 'Try a different keyword or clear the search.'
              : 'Messages from the public contact form will appear here.'
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((c) => (
            <article
              key={c.id}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    {(c.name || 'C').slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900 dark:text-white">{c.name}</p>
                    <a
                      href={`mailto:${c.email}`}
                      className="flex items-center gap-1 truncate text-xs font-medium text-primary-600 hover:underline dark:text-primary-400"
                    >
                      <Mail className="h-3 w-3 shrink-0" />
                      {c.email}
                    </a>
                  </div>
                </div>
                <time className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
                  {new Date(c.created_at).toLocaleDateString()}
                </time>
              </div>

              {c.phone && (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Phone className="h-3 w-3" />
                  {c.phone}
                </p>
              )}

              <p className="mt-4 flex-1 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {c.message}
              </p>

              <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                <a
                  href={`mailto:${c.email}?subject=Re: Hand4Hope`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Reply
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
