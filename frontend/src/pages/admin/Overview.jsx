import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, DollarSign, MessageSquare, Users, ArrowRight, Activity } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { PageHeader, StatCard, EmptyState } from '../../components/admin/shared'
import { fetchAnalytics, fetchDonations } from '../../services/adminService'
import { adminFetchEvents, adminFetchVolunteerRequests } from '../../services/eventService'

export default function Overview() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState(null)
  const [recentDonations, setRecentDonations] = useState([])
  const [recentEvents, setRecentEvents] = useState([])
  const [pending, setPending] = useState([])

  useEffect(() => {
    fetchAnalytics().then(setAnalytics).catch(() => {})
    fetchDonations().then((d) => setRecentDonations((d || []).slice(0, 5))).catch(() => {})
    adminFetchEvents().then((e) => setRecentEvents((e || []).slice(0, 5))).catch(() => {})
    adminFetchVolunteerRequests()
      .then((v) => setPending((v || []).filter((x) => x.status === 'pending').slice(0, 5)))
      .catch(() => {})
  }, [])

  const totalDonations = analytics
    ? `$${Number(analytics.donations_total_amount || 0).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`
    : '—'

  const firstName = user?.name?.split(' ')[0] ?? 'Admin'

  return (
    <>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="A snapshot of activity across Hand4Hope today."
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Calendar}
          label="Published Events"
          value={analytics?.events_count ?? '—'}
          hint="Currently scheduled"
          iconClass="bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
        />
        <StatCard
          icon={DollarSign}
          label="Donations Recorded"
          value={analytics?.donations_count ?? '—'}
          hint={`Total raised ${totalDonations}`}
          iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
        />
        <StatCard
          icon={MessageSquare}
          label="Contact Messages"
          value={analytics?.contacts_count ?? '—'}
          hint="From the contact form"
          iconClass="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <StatCard
          icon={Users}
          label="Volunteer Sign-ups"
          value={analytics?.volunteer_signups_count ?? '—'}
          hint="Across all events"
          iconClass="bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
        />
      </div>

      {/* Two-column area */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <SectionCard
          title="Recent donations"
          linkLabel="View all"
          linkTo="/admin/donations"
          className="lg:col-span-2"
        >
          {recentDonations.length === 0 ? (
            <ListEmpty message="No donations yet." />
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentDonations.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                      {(d.name || 'D').slice(0, 1).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{d.name}</p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">{d.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="whitespace-nowrap text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {d.currency} {Number(d.amount).toFixed(2)}
                    </p>
                    <p className="whitespace-nowrap text-xs text-slate-400 dark:text-slate-500">
                      {new Date(d.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title="Pending volunteers"
          linkLabel="Review"
          linkTo="/admin/volunteers"
        >
          {pending.length === 0 ? (
            <ListEmpty message="All caught up." />
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {pending.map((v) => (
                <li key={`${v.event_id}-${v.user_id}`} className="px-5 py-3.5">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {v.user_name}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    For: {v.event_title}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      {/* Upcoming events */}
      <div className="mt-6">
        <SectionCard
          title="Upcoming events"
          linkLabel="Manage"
          linkTo="/admin/events"
        >
          {recentEvents.length === 0 ? (
            <div className="px-5 py-10">
              <EmptyState
                icon={Calendar}
                title="No events yet"
                description="Create your first event to start gathering volunteers."
              />
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentEvents.map((ev) => (
                <li key={ev.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                      <Calendar className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{ev.title}</p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">{ev.location}</p>
                    </div>
                  </div>
                  <p className="shrink-0 text-xs font-medium text-slate-500 dark:text-slate-400">
                    {new Date(ev.starts_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </>
  )
}

function SectionCard({ title, linkLabel, linkTo, className = '', children }) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <h2 className="font-semibold text-slate-900 dark:text-white">{title}</h2>
        {linkTo && (
          <Link
            to={linkTo}
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            {linkLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}

function ListEmpty({ message }) {
  return (
    <div className="flex items-center justify-center gap-2 px-5 py-10 text-sm text-slate-500 dark:text-slate-400">
      <Activity className="h-4 w-4" />
      {message}
    </div>
  )
}
