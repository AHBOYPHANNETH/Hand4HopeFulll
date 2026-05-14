import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import client, { setAuthToken } from '../api/client'
import { fetchNotifications } from '../services/notificationService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hand4hope_user') || 'null')
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('hand4hope_token'))
  const [bootstrapping, setBootstrapping] = useState(!!token)
  const [unreadNotifications, setUnreadNotifications] = useState(0)

  useEffect(() => {
    setAuthToken(token || null)
  }, [token])

  useEffect(() => {
    const handleCleared = () => {
      setToken(null)
      setUser(null)
      setUnreadNotifications(0)
    }
    window.addEventListener('hand4hope:auth-cleared', handleCleared)
    return () => window.removeEventListener('hand4hope:auth-cleared', handleCleared)
  }, [])

  useEffect(() => {
    if (!token) {
      startTransition(() => setBootstrapping(false))
      return
    }
    let cancelled = false
    client
      .get('/user')
      .then(({ data }) => {
        if (!cancelled) {
          setUser(data)
          localStorage.setItem('hand4hope_user', JSON.stringify(data))
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null)
          setToken(null)
          localStorage.removeItem('hand4hope_token')
          localStorage.removeItem('hand4hope_user')
          setUnreadNotifications(0)
        }
      })
      .finally(() => {
        if (!cancelled) setBootstrapping(false)
      })
    return () => {
      cancelled = true
    }
  }, [token])

  useEffect(() => {
    if (!token || !user) return undefined
    let cancelled = false

    async function pullNotifications() {
      try {
        const data = await fetchNotifications()
        if (!cancelled) {
          setUnreadNotifications(data.unread_count || 0)
        }
      } catch {
        /* ignore polling errors */
      }
    }

    pullNotifications()
    const timer = window.setInterval(pullNotifications, 10000)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [token, user])

  const loginWithToken = (newToken, newUser) => {
    localStorage.setItem('hand4hope_token', newToken)
    localStorage.setItem('hand4hope_user', JSON.stringify(newUser))
    setAuthToken(newToken)
    setToken(newToken)
    setUser(newUser)
    setBootstrapping(false)
  }

  const logout = async () => {
    try {
      await client.post('/logout')
    } catch {
      /* ignore */
    }
    localStorage.removeItem('hand4hope_token')
    localStorage.removeItem('hand4hope_user')
    setAuthToken(null)
    setToken(null)
    setUser(null)
    setUnreadNotifications(0)
    setBootstrapping(false)
  }

  const value = useMemo(
    () => ({
      user,
      token,
      bootstrapping,
      isAuthenticated: !!user && !!token,
      isAdmin: user?.role === 'admin',
      unreadNotifications,
      refreshNotificationCount: async () => {
        if (!token) return
        try {
          const data = await fetchNotifications()
          setUnreadNotifications(data.unread_count || 0)
        } catch {
          /* ignore */
        }
      },
      loginWithToken,
      logout,
    }),
    [user, token, bootstrapping, unreadNotifications]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook paired with provider in this module
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
