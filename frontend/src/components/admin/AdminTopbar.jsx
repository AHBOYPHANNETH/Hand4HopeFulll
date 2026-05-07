import { Link, useLocation } from 'react-router-dom'
import { Menu, Bell, ChevronRight } from 'lucide-react'
import { ThemeToggle } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'

const PAGE_META = {
  '/admin/overview':   { title: 'Overview',           crumb: 'Overview' },
  '/admin/events':     { title: 'Events',             crumb: 'Events' },
  '/admin/donations':  { title: 'Donations',          crumb: 'Donations' },
  '/admin/contacts':   { title: 'Contact Messages',   crumb: 'Contacts' },
  '/admin/volunteers': { title: 'Volunteer Requests', crumb: 'Volunteers' },
  '/admin/content':    { title: 'Website Content',    crumb: 'Content' },
}

export default function AdminTopbar({ onMenuClick }) {
  const { unreadNotifications, user } = useAuth()
  const location = useLocation()
  const meta = PAGE_META[location.pathname] || { title: 'Admin', crumb: 'Admin' }

  const initials = (user?.name || 'A').slice(0, 1).toUpperCase()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open sidebar"
        className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1.5 text-sm sm:flex">
        <span className="font-medium text-slate-400 dark:text-slate-500">Admin</span>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
        <span className="truncate font-semibold text-slate-900 dark:text-white">{meta.crumb}</span>
      </nav>

      <h1 className="truncate font-semibold text-slate-900 dark:text-white sm:hidden">
        {meta.title}
      </h1>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <ThemeToggle />

        <Link
          to="/notifications"
          aria-label="Notifications"
          className="relative inline-flex items-center justify-center rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <Bell className="h-5 w-5" />
          {unreadNotifications > 0 && (
            <span className="absolute right-1.5 top-1.5 inline-flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
          )}
        </Link>

        {/* Avatar (desktop) */}
        <div className="ml-1 hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-900 sm:flex">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt={user.name} className="h-7 w-7 rounded-full object-cover" />
          ) : (
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
              {initials}
            </span>
          )}
          <span className="pr-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            {user?.name?.split(' ')[0] ?? 'Admin'}
          </span>
        </div>
      </div>
    </header>
  )
}
