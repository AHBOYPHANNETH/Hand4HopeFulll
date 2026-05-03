import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { BACKEND_ORIGIN } from '../../config'
import { useAuth } from '../../context/AuthContext'
import Button from '../ui/Button'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/events', label: 'Events' },
  { to: '/impact', label: 'Impact' },
  { to: '/donate', label: 'Donate' },
  { to: '/contact', label: 'Contact' },
]

function linkClass({ isActive }) {
  return `rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-teal-600 text-white shadow-sm' : 'text-stone-700 hover:bg-teal-50'}`
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, isAdmin, user, logout } = useAuth()

  function googleRedirect() {
    window.location.href = `${BACKEND_ORIGIN}/auth/google/redirect`
  }

  return (
    <header className="sticky top-0 z-40 border-b border-stone-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:py-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-teal-800">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-teal-600 text-lg text-white shadow-sm">
            H
          </span>
          <span className="hidden text-lg sm:inline">Hand4Hope</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === '/'}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button type="button" variant="outline" className="text-xs" onClick={googleRedirect}>
            Continue with Google
          </Button>
          {isAuthenticated ? (
            <>
              {isAdmin ? (
                <Link to="/admin">
                  <Button type="button" variant="ghost" className="text-xs">
                    Admin
                  </Button>
                </Link>
              ) : null}
              <span className="max-w-[140px] truncate text-xs font-medium text-stone-600">{user?.name}</span>
              <Button type="button" variant="ghost" className="text-xs" onClick={() => logout()}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button type="button" variant="ghost" className="text-xs">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button type="button" className="text-xs">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center rounded-xl border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-800 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-stone-100 bg-white px-4 pb-4 lg:hidden">
          <div className="flex flex-col gap-1 pt-2">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === '/'} onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            ))}
          </div>
          <div className="mt-3 flex flex-col gap-2 border-t border-stone-100 pt-3">
            <Button type="button" variant="outline" className="w-full" onClick={googleRedirect}>
              Continue with Google
            </Button>
            {isAuthenticated ? (
              <>
                {isAdmin ? (
                  <Link to="/admin" onClick={() => setOpen(false)}>
                    <Button type="button" variant="ghost" className="w-full">
                      Admin dashboard
                    </Button>
                  </Link>
                ) : null}
                <Button type="button" className="w-full" variant="ghost" onClick={() => { setOpen(false); logout(); }}>
                  Log out ({user?.name})
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button type="button" variant="ghost" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setOpen(false)}>
                  <Button type="button" className="w-full">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
