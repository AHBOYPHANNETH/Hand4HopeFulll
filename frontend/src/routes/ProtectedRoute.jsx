import { Navigate, useLocation } from 'react-router-dom'
import Spinner from '../components/ui/Spinner'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { bootstrapping, isAuthenticated } = useAuth()
  const location = useLocation()

  if (bootstrapping) {
    return <Spinner label="Checking session…" />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
