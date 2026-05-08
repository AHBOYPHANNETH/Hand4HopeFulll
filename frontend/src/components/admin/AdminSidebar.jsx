import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  DollarSign,
  MessageSquare,
  Users,
  UserCog,
  FileText,
  ExternalLink,
  LogOut,
  X,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/picture/hand4hope_logo.png'

const NAV_ITEMS = [
  { to: '/admin/overview',   label: 'Overview',         icon: LayoutDashboard },
  { to: '/admin/events',     label: 'Events',           icon: Calendar },
  { to: '/admin/donations',  label: 'Donations',        icon: DollarSign },
  { to: '/admin/contacts',   label: 'Contacts',         icon: MessageSquare },
  { to: '/admin/volunteers', label: 'Volunteers',       icon: Users },
  { to: '/admin/users',      label: 'Users',            icon: UserCog },
  { to: '/admin/content',    label: 'Website Content',  icon: FileText },
]

export default function AdminSidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-200 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-5 dark:border-slate-800">
          <Link to="/admin/overview" className="flex items-center gap-2.5" onClick={onClose}>
            <img src={logo} alt="Hand4Hope" className="h-8 w-8 rounded-full object-cover ring-2 ring-primary-200 shadow-sm dark:ring-primary-700" />
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-slate-900 dark:text-white">Hand4Hope</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">
                Admin
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex flex-1 flex-col overflow-y-auto px-3 py-5">
          <p className="px-3 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Manage
          </p>
          <nav className="mt-2 space-y-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 shadow-sm dark:bg-primary-900/30 dark:text-primary-300'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                  }`
                }
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto space-y-2 pt-6">
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <ExternalLink className="h-4 w-4 shrink-0" />
              View public site
            </Link>

            {/* User card */}
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="h-9 w-9 shrink-0 rounded-full object-cover" />
                ) : (
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-bold text-white">
                    {(user?.name || 'A').slice(0, 1).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {user?.name ?? 'Admin'}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {user?.email ?? 'admin@hand4hope.org'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Sign out"
                  className="shrink-0 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-rose-100 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-900/30 dark:hover:text-rose-400"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
