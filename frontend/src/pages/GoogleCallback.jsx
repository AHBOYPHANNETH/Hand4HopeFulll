import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/ui/Spinner'

export default function GoogleCallback() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { loginWithToken } = useAuth()

  useEffect(() => {
    const token = params.get('token')
    const userEnc = params.get('user')

    if (!token || !userEnc) {
      navigate('/login', { replace: true })
      return
    }

    try {
      const user = JSON.parse(atob(decodeURIComponent(userEnc)))
      loginWithToken(token, user)
      navigate(user.role === 'admin' ? '/admin' : '/', { replace: true })
    } catch {
      navigate('/login', { replace: true })
    }
  }, [params, navigate, loginWithToken])

  return <Spinner label="Completing Google sign-in…" />
}
