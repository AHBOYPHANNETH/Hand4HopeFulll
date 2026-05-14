import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Bell, LogOut, Target, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { ThemeToggle } from '../../context/ThemeContext'
import NotificationDropdown from '../NotificationDropdown'
import Button from '../ui/Button'
import logo from '../../assets/picture/hand4hope_logo.png'

const links = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Events' },
  { to: '/donate', label: 'Donate' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()

  const showUserSession = isAuthenticated

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const initials = (user?.name || 'U')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200/50 bg-white/80 shadow-lg backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/80'
          : 'border-b border-transparent bg-white/50 backdrop-blur-md dark:bg-slate-900/50'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 font-display font-bold text-xl text-primary-700 transition-colors hover:text-primary-800 dark:text-white dark:hover:text-primary-300"
          >
            <motion.img
              src={logo}
              alt="Hand4Hope"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-primary-200 shadow-sm dark:ring-primary-700"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
            <span className="hidden sm:inline">Hand4Hope</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-semibold transition-all duration-200
                  after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:transition-all after:duration-300
                  ${isActive
                    ? 'text-primary-600 dark:text-white after:bg-primary-600'
                    : 'text-slate-700 hover:text-primary-600 dark:text-white dark:hover:text-primary-300 after:bg-transparent hover:after:bg-primary-200 dark:hover:after:bg-primary-700'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions — Desktop */}
          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />

            {showUserSession ? (
              <>
                <NotificationDropdown />

                {/* Account dropdown */}
                <div className="relative">
                  <motion.button
                    type="button"
                    onClick={() => setAccountOpen((v) => !v)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Account menu"
                    aria-expanded={accountOpen}
                    className="rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                  >
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.name || 'User'}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-sm dark:ring-slate-800"
                      />
                    ) : (
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-200 text-sm font-bold text-primary-700 ring-2 ring-white shadow-sm dark:ring-slate-800">
                        {initials}
                      </span>
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {accountOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="absolute right-0 z-50 mt-3 w-56 overflow-hidden rounded-2xl border border-slate-200/50 bg-white/95 shadow-2xl backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/95"
                      >
                        {[
                          { to: '/profile', icon: User, label: 'Profile' },
                          { to: '/my-volunteer-requests', icon: Target, label: 'My Events' },
                          { to: '/notifications', icon: Bell, label: 'Notifications' },
                        ].map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 text-sm text-slate-700 transition-colors hover:bg-primary-50 hover:text-primary-700 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-primary-400"
                            onClick={() => setAccountOpen(false)}
                          >
                            <item.icon className="h-4 w-4" /> {item.label}
                          </Link>
                        ))}
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-orange-600 transition-colors hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-900/20"
                          onClick={() => { setAccountOpen(false); logout() }}
                        >
                          <LogOut className="h-4 w-4" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="flex items-center gap-1 lg:hidden">
            <ThemeToggle />
            <motion.button
              type="button"
              className="inline-flex items-center rounded-lg p-2 text-slate-700 dark:text-slate-300"
              onClick={() => setOpen((v) => !v)}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="border-t border-slate-200/50 bg-white/95 backdrop-blur-lg dark:border-slate-700/50 dark:bg-slate-900/95 lg:hidden"
          >
            <div className="space-y-1 px-4 pb-6 pt-4">
              {/* Nav Links */}
              <div className="flex flex-col gap-1">
                {links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.to === '/'}
                    className={({ isActive }) =>
                      `rounded-lg px-4 py-3 text-sm font-semibold transition-all
                      ${isActive
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-white'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800'
                      }`
                    }
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </NavLink>
                ))}
              </div>

              <div className="my-4 border-t border-slate-200 pt-4 dark:border-slate-700">
                {showUserSession ? (
                  <div className="space-y-2">
                    <Link to="/profile" onClick={() => setOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-2 dark:text-slate-300 dark:hover:bg-slate-800">
                        <User className="h-4 w-4" /> My Profile
                      </Button>
                    </Link>
                    <Link to="/my-volunteer-requests" onClick={() => setOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-2 dark:text-slate-300 dark:hover:bg-slate-800">
                        <Target className="h-4 w-4" /> My Events
                      </Button>
                    </Link>
                    <Link to="/notifications" onClick={() => setOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-2 dark:text-slate-300 dark:hover:bg-slate-800">
                        <Bell className="h-4 w-4" /> Notifications
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      className="w-full justify-start gap-2"
                      onClick={() => { setOpen(false); logout() }}
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" onClick={() => setOpen(false)}>
                      <Button
                        variant="ghost"
                        className="w-full bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setOpen(false)}>
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
