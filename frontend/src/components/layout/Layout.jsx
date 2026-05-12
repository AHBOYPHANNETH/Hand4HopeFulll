import { Navigate, Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { useAuth } from '../../context/AuthContext'
import Spinner from '../ui/Spinner'

export default function Layout() {
  const { bootstrapping, isAuthenticated, isAdmin } = useAuth()

  if (bootstrapping) {
    return <Spinner label="Checking session…" />
  }

  // Admins belong in the admin panel — redirect them away from the public site.
  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin" replace />
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
