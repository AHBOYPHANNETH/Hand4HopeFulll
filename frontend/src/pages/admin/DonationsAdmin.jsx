import { useEffect, useMemo, useState } from 'react'
import { DollarSign, Download } from 'lucide-react'
import Button from '../../components/ui/Button'
import {
  PageHeader,
  EmptyState,
  SkeletonRow,
  SearchInput,
  StatCard,
} from '../../components/admin/shared'
import { fetchDonations } from '../../services/adminService'

export default function DonationsAdmin() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchDonations()
      .then((d) => setDonations(d || []))
      .catch(() => setDonations([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(
    () =>
      donations.filter(
        (d) =>
          !search ||
          d.name?.toLowerCase().includes(search.toLowerCase()) ||
          d.email?.toLowerCase().includes(search.toLowerCase())
      ),
    [donations, search]
  )

  const total = filtered.reduce((sum, d) => sum + Number(d.amount || 0), 0)
  const avg = filtered.length ? total / filtered.length : 0

  function exportCsv() {
    const rows = [
      ['Name', 'Email', 'Amount', 'Currency', 'Received'],
      ...filtered.map((d) => [
        d.name,
        d.email,
        Number(d.amount).toFixed(2),
        d.currency,
        new Date(d.created_at).toISOString(),
      ]),
    ]
    const csv = rows.map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `donations-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <PageHeader
        title="Donations"
        description="Track every contribution to Hand4Hope."
        actions={
          <Button size="sm" variant="outline" onClick={exportCsv} disabled={!filtered.length}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        }
      />

      {/* Quick stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={DollarSign}
          label="Total raised"
          value={`$${total.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          hint={loading ? 'Loading…' : `${filtered.length} donations`}
          iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
        />
        <StatCard
          icon={DollarSign}
          label="Average gift"
          value={`$${avg.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          hint="Per donation"
          iconClass="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <StatCard
          icon={DollarSign}
          label="Donations"
          value={loading ? '—' : filtered.length}
          hint="In current view"
          iconClass="bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
        />
      </div>

      <div className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by donor name or email…" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm dark:divide-slate-800">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3.5">Donor</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={3} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8">
                    <EmptyState
                      icon={DollarSign}
                      title={search ? 'No donations match your search' : 'No donations yet'}
                      description={
                        search
                          ? 'Try a different keyword or clear the search.'
                          : 'Donations will appear here once supporters contribute.'
                      }
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((d) => (
                  <tr
                    key={d.id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                          {(d.name || 'D').slice(0, 1).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900 dark:text-white">{d.name}</p>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">{d.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 text-sm font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        {d.currency} {Number(d.amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-400">
                      {new Date(d.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
