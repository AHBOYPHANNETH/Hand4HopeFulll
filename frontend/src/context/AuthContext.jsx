import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import client, { setAuthToken } from '../api/client'

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

  useEffect(() => {
    setAuthToken(token || null)
  }, [token])

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
        }
      })
      .finally(() => {
        if (!cancelled) setBootstrapping(false)
      })
    return () => {
      cancelled = true
    }
  }, [token])

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
    setBootstrapping(false)
  }

  const value = useMemo(
    () => ({
      user,
      token,
      bootstrapping,
      isAuthenticated: !!user && !!token,
      isAdmin: user?.role === 'admin',
      loginWithToken,
      logout,
    }),
    [user, token, bootstrapping]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook paired with provider in this module
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
