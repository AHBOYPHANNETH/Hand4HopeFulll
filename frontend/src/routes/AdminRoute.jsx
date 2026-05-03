import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/ui/Spinner'

export default function AdminRoute({ children }) {
  const { bootstrapping, isAuthenticated, isAdmin } = useAuth()
  const location = useLocation()

  if (bootstrapping) {
    return <Spinner label="Checking session…" />
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
