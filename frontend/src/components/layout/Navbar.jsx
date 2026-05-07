import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Bell, ShoppingCart, ChevronDown } from 'lucide-react'
import { BACKEND_ORIGIN } from '../../config'
import { useAuth } from '../../context/AuthContext'
import NotificationDropdown from '../NotificationDropdown'
import Button from '../ui/Button'
import logo from '../../assets/picture/hand4hope_logo.png'

const links = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Events' },
  { to: '/donate', label: 'Donate' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

function linkClass({ isActive }) {
  return `relative px-4 py-2 text-sm font-semibold transition-all duration-200 ${
    isActive
      ? 'text-primary-600'
      : 'text-slate-700 hover:text-primary-600'
  }`.trim()
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, isAdmin, user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const initials = (user?.name || 'U')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  function googleRedirect() {
    window.location.href = `${BACKEND_ORIGIN}/auth/google/redirect`
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200/50 bg-white/80 backdrop-blur-xl shadow-lg'
          : 'border-b border-transparent bg-white/50 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 font-display font-bold text-xl text-primary-700 hover:text-primary-800 transition-colors">
            <motion.img
              src={logo}
              alt="Hand4Hope"
              className="h-10 w-10 object-contain"
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
                className={({ isActive }) => `
                  ${linkClass({ isActive })}
                  after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5
                  ${isActive
                    ? 'after:bg-gradient-to-r after:from-primary-600 after:to-secondary-600'
                    : 'after:bg-transparent hover:after:bg-primary-200'
                  }
                  after:transition-all after:duration-300
                `}
                end={l.to === '/'}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden items-center gap-4 lg:flex">
            {isAuthenticated ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/cart" className="relative">
                    <ShoppingCart className="h-6 w-6 text-slate-700 hover:text-primary-600 transition-colors" />
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-gradient-to-r from-accent-500 to-accent-600 text-xs font-bold text-white flex items-center justify-center">
                      0
                    </span>
                  </Link>
                </motion.div>
                <NotificationDropdown />
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm">
                      Admin
                    </Button>
                  </Link>
                )}
                <div className="relative">
                  <motion.button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all"
                    onClick={() => setAccountOpen((v) => !v)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.name || 'User'}
                        className="h-7 w-7 rounded-full object-cover"
                      />
                    ) : (
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary-200 to-primary-300 text-sm font-bold text-primary-700">
                        {initials}
                      </span>
                    )}
                    <span className="max-w-[100px] truncate hidden sm:inline">{user?.name}</span>
                    <ChevronDown className="h-4 w-4 transition-transform" style={{ transform: accountOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </motion.button>
                  <AnimatePresence>
                    {accountOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="absolute right-0 z-50 mt-3 w-56 overflow-hidden rounded-2xl border border-slate-200/50 bg-white/95 shadow-2xl backdrop-blur-sm"
                      >
                        <Link
                          to="/profile"
                          className="block px-4 py-3 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors border-b border-slate-100"
                          onClick={() => setAccountOpen(false)}
                        >
                          👤 Profile
                        </Link>
                        <Link
                          to="/my-volunteer-requests"
                          className="block px-4 py-3 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors border-b border-slate-100"
                          onClick={() => setAccountOpen(false)}
                        >
                          🎯 My Events
                        </Link>
                        <Link
                          to="/notifications"
                          className="block px-4 py-3 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors border-b border-slate-100"
                          onClick={() => setAccountOpen(false)}
                        >
                          🔔 Notifications
                        </Link>
                        <Link
                          to="/profile"
                          className="block px-4 py-3 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors border-b border-slate-100"
                          onClick={() => setAccountOpen(false)}
                        >
                          ⚙️ Settings
                        </Link>
                        <button
                          type="button"
                          className="block w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold"
                          onClick={() => {
                            setAccountOpen(false)
                            logout()
                          }}
                        >
                          🚪 Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={googleRedirect}>
                  Google
                </Button>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            type="button"
            className="inline-flex items-center rounded-lg p-2 text-slate-700 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            whileTap={{ scale: 0.95 }}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="border-t border-slate-200/50 bg-white/95 backdrop-blur-lg lg:hidden"
          >
            <div className="px-4 py-6 space-y-1">
              <div className="flex flex-col gap-1">
                {links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    className={({ isActive }) => `
                      rounded-lg px-4 py-2 text-sm font-semibold transition-all
                      ${isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-slate-700 hover:bg-slate-100'
                      }
                    `}
                    end={l.to === '/'}
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </NavLink>
                ))}
              </div>
              <div className="border-t border-slate-200 my-4 pt-4">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link to="/cart" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">
                        <ShoppingCart className="h-4 w-4" />
                        Cart
                      </Button>
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          Admin
                        </Button>
                      </Link>
                    )}
                    <Link to="/profile" onClick={() => setOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        My Profile
                      </Button>
                    </Link>
                    <Link to="/my-volunteer-requests" onClick={() => setOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        My Events
                      </Button>
                    </Link>
                    <Link to="/notifications" onClick={() => setOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        Notifications
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      className="w-full justify-start"
                      onClick={() => {
                        setOpen(false)
                        logout()
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full" onClick={googleRedirect}>
                      Google
                    </Button>
                    <Link to="/login" onClick={() => setOpen(false)}>
                      <Button variant="ghost" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setOpen(false)}>
                      <Button className="w-full">
                        Sign Up
                      </Button>
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
